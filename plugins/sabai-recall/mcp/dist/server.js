import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
// Works both from source (server.ts) and compiled (dist/server.js)
const DIST_DIR = import.meta.filename.endsWith(".ts")
    ? path.join(import.meta.dirname, "dist")
    : import.meta.dirname;
// Recall API configuration
const getConfig = () => {
    const apiKey = process.env.RECALL_API_KEY;
    const region = process.env.RECALL_REGION || "us-west-2";
    if (!apiKey) {
        throw new Error("RECALL_API_KEY environment variable is required. " +
            "Get your API key from https://www.recall.ai/");
    }
    return {
        apiKey,
        baseUrl: `https://${region}.recall.ai/api/v1`,
    };
};
// Helper for API requests
async function recallFetch(endpoint, options = {}) {
    const config = getConfig();
    const response = await fetch(`${config.baseUrl}${endpoint}`, {
        ...options,
        headers: {
            "Authorization": `Token ${config.apiKey}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Recall API error (${response.status}): ${errorText}`);
    }
    // Handle 204 No Content
    if (response.status === 204) {
        return {};
    }
    return response.json();
}
// ============ MCP SERVER ============
export function createServer() {
    const server = new McpServer({
        name: "Sabai Recall",
        version: "1.2.0",
    });
    const resourceUri = "ui://recall/recording-player.html";
    // Tool: Find bot by meeting URL
    server.tool("recall_find_bot_by_meeting", "Find a Recall.ai bot by meeting URL. Returns the most recent bot for the given meeting.", {
        meeting_url: z.string().describe("The meeting URL to search for"),
    }, async (args) => {
        // List bots and filter by meeting URL
        const response = await recallFetch(`/bot?limit=50`);
        // Find bots matching this meeting URL (normalize URLs for comparison)
        const normalizeUrl = (url) => url.toLowerCase().replace(/\/$/, "").split("?")[0];
        const targetUrl = normalizeUrl(args.meeting_url);
        const matchingBots = response.results.filter(bot => normalizeUrl(bot.meeting_url) === targetUrl ||
            bot.meeting_url.includes(targetUrl) ||
            targetUrl.includes(normalizeUrl(bot.meeting_url)));
        if (matchingBots.length === 0) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            meeting_url: args.meeting_url,
                            message: "No bots found for this meeting URL.",
                        }, null, 2),
                    },
                ],
            };
        }
        // Sort by most recent status change
        matchingBots.sort((a, b) => {
            const aTime = a.status_changes[a.status_changes.length - 1]?.created_at || "";
            const bTime = b.status_changes[b.status_changes.length - 1]?.created_at || "";
            return bTime.localeCompare(aTime);
        });
        const latestBot = matchingBots[0];
        const latestStatus = latestBot.status_changes[latestBot.status_changes.length - 1];
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: latestBot.id,
                        meeting_url: latestBot.meeting_url,
                        bot_name: latestBot.bot_name,
                        status: latestStatus?.code || "unknown",
                        has_recording: (latestBot.recordings?.length || 0) > 0,
                        total_bots_found: matchingBots.length,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: Watch recording with embedded video player
    registerAppTool(server, "recall_watch_recording", {
        title: "Watch Recording",
        description: "Watch a meeting recording in an embedded video player. Displays the video directly in Claude. Accepts either a bot_id or a meeting_url.",
        inputSchema: {
            bot_id: z.string().optional().describe("The bot ID to watch the recording for"),
            meeting_url: z.string().optional().describe("The meeting URL to find and watch the recording for"),
        },
        _meta: { ui: { resourceUri } },
    }, async (args) => {
        let botId = args.bot_id;
        // If meeting_url provided, find the bot
        if (!botId && args.meeting_url) {
            const response = await recallFetch(`/bot?limit=50`);
            const normalizeUrl = (url) => url.toLowerCase().replace(/\/$/, "").split("?")[0];
            const targetUrl = normalizeUrl(args.meeting_url);
            const matchingBots = response.results.filter(bot => normalizeUrl(bot.meeting_url) === targetUrl ||
                bot.meeting_url.includes(targetUrl) ||
                targetUrl.includes(normalizeUrl(bot.meeting_url)));
            if (matchingBots.length === 0) {
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({
                                meeting_url: args.meeting_url,
                                error: "No bots found for this meeting URL.",
                            }),
                        },
                    ],
                };
            }
            // Get the most recent bot with a recording
            const botsWithRecordings = matchingBots.filter(b => (b.recordings?.length || 0) > 0);
            if (botsWithRecordings.length > 0) {
                botId = botsWithRecordings[0].id;
            }
            else {
                // Fall back to most recent bot
                matchingBots.sort((a, b) => {
                    const aTime = a.status_changes[a.status_changes.length - 1]?.created_at || "";
                    const bTime = b.status_changes[b.status_changes.length - 1]?.created_at || "";
                    return bTime.localeCompare(aTime);
                });
                botId = matchingBots[0].id;
            }
        }
        if (!botId) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: "Please provide either a bot_id or a meeting_url.",
                        }),
                    },
                ],
            };
        }
        const bot = await recallFetch(`/bot/${botId}`);
        const latestStatus = bot.status_changes[bot.status_changes.length - 1];
        if (!["done", "analysis_done", "call_ended"].includes(latestStatus?.code || "")) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            bot_id: args.bot_id,
                            status: latestStatus?.code,
                            error: "Recording not yet available. Bot must have status 'done' or 'call_ended'.",
                        }),
                    },
                ],
            };
        }
        const recordingInfo = bot.recordings?.[0];
        if (!recordingInfo) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            bot_id: args.bot_id,
                            error: "No recordings found for this bot.",
                        }),
                    },
                ],
            };
        }
        const videoUrl = recordingInfo.media_shortcuts.video_mixed?.data?.download_url;
        if (!videoUrl) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            bot_id: args.bot_id,
                            error: "Video recording not available for this bot.",
                        }),
                    },
                ],
            };
        }
        return {
            content: [
                {
                    type: "text",
                    text: "Playing meeting recording. The video is displayed above.",
                },
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: bot.id,
                        bot_name: bot.bot_name,
                        meeting_url: bot.meeting_url,
                        video_url: videoUrl,
                        audio_url: recordingInfo.media_shortcuts.audio_mixed?.data?.download_url,
                        transcript_url: recordingInfo.media_shortcuts.transcript?.data?.download_url,
                        started_at: recordingInfo.started_at,
                        completed_at: recordingInfo.completed_at,
                    }),
                },
            ],
        };
    });
    // Register the HTML resource for the video player
    registerAppResource(server, resourceUri, resourceUri, { mimeType: RESOURCE_MIME_TYPE }, async () => {
        const html = await fs.readFile(path.join(DIST_DIR, "index.html"), "utf-8");
        return {
            contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
        };
    });
    // Tool: Create a bot to join a meeting
    server.tool("recall_create_bot", "Create a Recall.ai bot to join and record a meeting. The bot will join the meeting URL and can record video, audio, and transcripts.", {
        meeting_url: z.string().url().describe("The meeting URL (Zoom, Google Meet, Teams, etc.)"),
        bot_name: z.string().default("Recall Bot").describe("Display name for the bot in the meeting"),
        join_at: z.string().optional().describe("ISO 8601 timestamp for when the bot should join (schedule in advance). If not provided, joins immediately."),
        enable_transcript: z.boolean().default(true).describe("Whether to enable transcription using meeting captions"),
        record_audio: z.boolean().default(true).describe("Whether to record audio"),
        record_video: z.boolean().default(true).describe("Whether to record video"),
    }, async (args) => {
        const requestBody = {
            meeting_url: args.meeting_url,
            bot_name: args.bot_name,
        };
        // Add join_at if scheduled
        if (args.join_at) {
            requestBody.join_at = args.join_at;
        }
        // Configure recording settings
        const recordingConfig = {};
        if (args.enable_transcript) {
            recordingConfig.transcript = {
                provider: {
                    meeting_captions: {},
                },
            };
        }
        if (Object.keys(recordingConfig).length > 0) {
            requestBody.recording_config = recordingConfig;
        }
        const bot = await recallFetch("/bot", {
            method: "POST",
            body: JSON.stringify(requestBody),
        });
        const latestStatus = bot.status_changes[bot.status_changes.length - 1];
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: bot.id,
                        meeting_url: bot.meeting_url,
                        bot_name: bot.bot_name,
                        status: latestStatus?.code || "created",
                        status_message: latestStatus?.message,
                        join_at: bot.join_at,
                        message: bot.join_at
                            ? `Bot scheduled to join at ${bot.join_at}`
                            : "Bot created and joining meeting",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: Get bot details and status
    server.tool("recall_get_bot", "Get the status and details of a Recall.ai bot, including recording status and download URLs when available.", {
        bot_id: z.string().describe("The bot ID returned from recall_create_bot"),
    }, async (args) => {
        const bot = await recallFetch(`/bot/${args.bot_id}`);
        const latestStatus = bot.status_changes[bot.status_changes.length - 1];
        // Extract recording URLs if available
        const recordingInfo = bot.recordings?.[0];
        const mediaUrls = {};
        if (recordingInfo?.media_shortcuts) {
            if (recordingInfo.media_shortcuts.video_mixed?.data?.download_url) {
                mediaUrls.video = recordingInfo.media_shortcuts.video_mixed.data.download_url;
            }
            if (recordingInfo.media_shortcuts.audio_mixed?.data?.download_url) {
                mediaUrls.audio = recordingInfo.media_shortcuts.audio_mixed.data.download_url;
            }
            if (recordingInfo.media_shortcuts.transcript?.data?.download_url) {
                mediaUrls.transcript = recordingInfo.media_shortcuts.transcript.data.download_url;
            }
        }
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: bot.id,
                        meeting_url: bot.meeting_url,
                        bot_name: bot.bot_name,
                        status: latestStatus?.code || "unknown",
                        status_message: latestStatus?.message,
                        status_history: bot.status_changes.map(s => ({
                            status: s.code,
                            message: s.message,
                            at: s.created_at,
                        })),
                        has_recording: !!recordingInfo,
                        recording_started_at: recordingInfo?.started_at,
                        recording_completed_at: recordingInfo?.completed_at,
                        media_urls: Object.keys(mediaUrls).length > 0 ? mediaUrls : null,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: List all bots
    server.tool("recall_list_bots", "List all Recall.ai bots with optional filtering by status.", {
        status: z.enum([
            "ready", "joining_call", "in_waiting_room", "in_call_not_recording",
            "in_call_recording", "call_ended", "done", "fatal", "analysis_done"
        ]).optional().describe("Filter bots by status"),
        limit: z.number().min(1).max(100).default(20).describe("Number of bots to return"),
    }, async (args) => {
        let endpoint = `/bot?limit=${args.limit}`;
        if (args.status) {
            endpoint += `&status_code__in=${args.status}`;
        }
        const response = await recallFetch(endpoint);
        const bots = response.results.map(bot => {
            const latestStatus = bot.status_changes[bot.status_changes.length - 1];
            return {
                bot_id: bot.id,
                meeting_url: bot.meeting_url,
                bot_name: bot.bot_name,
                status: latestStatus?.code || "unknown",
                has_recording: (bot.recordings?.length || 0) > 0,
            };
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        total_count: response.count,
                        returned_count: bots.length,
                        bots,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: Delete/remove a bot
    server.tool("recall_delete_bot", "Remove a bot from a meeting. Use this to stop a bot that's currently in a meeting or to cancel a scheduled bot.", {
        bot_id: z.string().describe("The bot ID to delete"),
    }, async (args) => {
        await recallFetch(`/bot/${args.bot_id}`, {
            method: "DELETE",
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: args.bot_id,
                        message: "Bot successfully deleted/removed from meeting",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: Get recording media URLs
    server.tool("recall_get_recording", "Get the recording download URLs for a completed bot session. Returns video, audio, and transcript URLs when available.", {
        bot_id: z.string().describe("The bot ID to get recordings for"),
    }, async (args) => {
        const bot = await recallFetch(`/bot/${args.bot_id}`);
        const latestStatus = bot.status_changes[bot.status_changes.length - 1];
        if (!["done", "analysis_done", "call_ended"].includes(latestStatus?.code || "")) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            bot_id: args.bot_id,
                            status: latestStatus?.code,
                            message: "Recording not yet available. Bot must have status 'done' or 'call_ended'.",
                        }, null, 2),
                    },
                ],
            };
        }
        const recordingInfo = bot.recordings?.[0];
        if (!recordingInfo) {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            bot_id: args.bot_id,
                            message: "No recordings found for this bot.",
                        }, null, 2),
                    },
                ],
            };
        }
        const mediaUrls = {
            video: recordingInfo.media_shortcuts.video_mixed?.data?.download_url || null,
            audio: recordingInfo.media_shortcuts.audio_mixed?.data?.download_url || null,
            transcript: recordingInfo.media_shortcuts.transcript?.data?.download_url || null,
        };
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: args.bot_id,
                        recording_id: recordingInfo.id,
                        started_at: recordingInfo.started_at,
                        completed_at: recordingInfo.completed_at,
                        media_urls: mediaUrls,
                        message: "Recording available for download",
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: Get transcript
    server.tool("recall_get_transcript", "Get the transcript from a bot's recording. Returns timestamped words with speaker identification when available.", {
        bot_id: z.string().describe("The bot ID to get the transcript for"),
        format: z.enum(["json", "text"]).default("text").describe("Output format - 'text' for readable transcript, 'json' for full data"),
    }, async (args) => {
        // First get the bot to find the transcript URL
        const bot = await recallFetch(`/bot/${args.bot_id}`);
        const recordingInfo = bot.recordings?.[0];
        const transcriptUrl = recordingInfo?.media_shortcuts.transcript?.data?.download_url;
        if (!transcriptUrl) {
            const latestStatus = bot.status_changes[bot.status_changes.length - 1];
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            bot_id: args.bot_id,
                            status: latestStatus?.code,
                            message: "Transcript not available. The bot may still be processing or transcription was not enabled.",
                        }, null, 2),
                    },
                ],
            };
        }
        // Fetch the transcript
        const transcriptResponse = await fetch(transcriptUrl);
        if (!transcriptResponse.ok) {
            throw new Error(`Failed to fetch transcript: ${transcriptResponse.status}`);
        }
        const transcript = await transcriptResponse.json();
        if (args.format === "json") {
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            bot_id: args.bot_id,
                            word_count: transcript.words.length,
                            transcript: transcript.words,
                        }, null, 2),
                    },
                ],
            };
        }
        // Convert to readable text format
        const textTranscript = transcript.words.map(w => w.text).join(" ");
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: args.bot_id,
                        word_count: transcript.words.length,
                        transcript: textTranscript,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: Get meeting participants
    server.tool("recall_get_participants", "Get the list of participants from a meeting that the bot attended.", {
        bot_id: z.string().describe("The bot ID to get participants for"),
    }, async (args) => {
        const participants = await recallFetch(`/bot/${args.bot_id}/participants`);
        const participantList = participants.map(p => ({
            id: p.id,
            name: p.name,
            join_time: p.events.find(e => e.code === "join")?.created_at,
            leave_time: p.events.find(e => e.code === "leave")?.created_at,
        }));
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: args.bot_id,
                        participant_count: participantList.length,
                        participants: participantList,
                    }, null, 2),
                },
            ],
        };
    });
    // Tool: Leave meeting
    server.tool("recall_leave_meeting", "Make the bot leave the meeting immediately. The recording will be processed after leaving.", {
        bot_id: z.string().describe("The bot ID to make leave the meeting"),
    }, async (args) => {
        await recallFetch(`/bot/${args.bot_id}/leave_call`, {
            method: "POST",
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        bot_id: args.bot_id,
                        message: "Bot is leaving the meeting. Recording will be processed shortly.",
                    }, null, 2),
                },
            ],
        };
    });
    return server;
}
