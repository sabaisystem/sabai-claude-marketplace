import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Configuration from environment
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS || path.join(process.cwd(), "config", "credentials.json");
const TOKEN_PATH = process.env.GOOGLE_TOKEN || path.join(process.cwd(), "config", "token.json");

// Calendar API scopes
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
];

let calendar = null;

/**
 * Load OAuth2 client with credentials
 */
async function getAuthClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDENTIALS_PATH}. Run 'npm run auth' to set up.`);
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;

  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));
    oauth2Client.setCredentials(token);

    // Check if token needs refresh
    if (token.expiry_date && Date.now() >= token.expiry_date - 60000) {
      try {
        const { credentials: newCredentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(newCredentials);
        fs.writeFileSync(TOKEN_PATH, JSON.stringify(newCredentials, null, 2));
      } catch (err) {
        console.error("Failed to refresh token:", err.message);
        throw new Error("Token expired. Run 'npm run auth' to re-authenticate.");
      }
    }
  } else {
    throw new Error(`Token file not found at ${TOKEN_PATH}. Run 'npm run auth' to authenticate.`);
  }

  return oauth2Client;
}

/**
 * Initialize Calendar API client
 */
async function initCalendar() {
  if (!calendar) {
    const auth = await getAuthClient();
    calendar = google.calendar({ version: "v3", auth });
  }
  return calendar;
}

/**
 * Format date for display
 */
function formatDateTime(dateTime, timeZone) {
  if (!dateTime) return null;
  const date = new Date(dateTime);
  return date.toLocaleString("en-US", { timeZone: timeZone || "UTC" });
}

/**
 * Parse natural language date to ISO format
 */
function parseDate(input) {
  const now = new Date();
  const lower = input.toLowerCase();

  if (lower === "today") {
    return now.toISOString().split("T")[0];
  }
  if (lower === "tomorrow") {
    now.setDate(now.getDate() + 1);
    return now.toISOString().split("T")[0];
  }
  if (lower === "next week") {
    now.setDate(now.getDate() + 7);
    return now.toISOString().split("T")[0];
  }

  // Try to parse as date
  const parsed = new Date(input);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  return input;
}

/**
 * Get start and end of day
 */
function getDayBounds(date) {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * Get start and end of week
 */
function getWeekBounds(startDate) {
  const d = new Date(startDate || new Date());
  const dayOfWeek = d.getDay();
  const start = new Date(d);
  start.setDate(d.getDate() - dayOfWeek);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * Format event for response
 */
function formatEvent(event) {
  return {
    id: event.id,
    summary: event.summary || "(No title)",
    description: event.description || null,
    location: event.location || null,
    start: event.start?.dateTime || event.start?.date,
    end: event.end?.dateTime || event.end?.date,
    isAllDay: !!event.start?.date,
    status: event.status,
    htmlLink: event.htmlLink,
    hangoutLink: event.hangoutLink || null,
    attendees: event.attendees?.map((a) => ({
      email: a.email,
      displayName: a.displayName,
      responseStatus: a.responseStatus,
      organizer: a.organizer,
      self: a.self,
    })) || [],
    organizer: event.organizer ? {
      email: event.organizer.email,
      displayName: event.organizer.displayName,
      self: event.organizer.self,
    } : null,
    recurrence: event.recurrence || null,
    recurringEventId: event.recurringEventId || null,
  };
}

// Define tools
const tools = [
  {
    name: "calendar_list_events",
    description: "List calendar events for a date range. Defaults to today if no dates provided.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date (ISO format or 'today', 'tomorrow'). Defaults to today.",
        },
        endDate: {
          type: "string",
          description: "End date (ISO format). Defaults to end of start date.",
        },
        maxResults: {
          type: "number",
          description: "Maximum number of events to return (default: 50)",
          default: 50,
        },
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
      },
    },
  },
  {
    name: "calendar_today",
    description: "Get today's calendar events",
    inputSchema: {
      type: "object",
      properties: {
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
      },
    },
  },
  {
    name: "calendar_week",
    description: "Get this week's calendar events",
    inputSchema: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Start date of week (defaults to current week)",
        },
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
      },
    },
  },
  {
    name: "calendar_get_event",
    description: "Get details of a specific calendar event",
    inputSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The event ID",
        },
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
      },
      required: ["eventId"],
    },
  },
  {
    name: "calendar_create_event",
    description: "Create a new calendar event",
    inputSchema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          description: "Event title",
        },
        startDateTime: {
          type: "string",
          description: "Start date/time (ISO format)",
        },
        endDateTime: {
          type: "string",
          description: "End date/time (ISO format)",
        },
        description: {
          type: "string",
          description: "Event description",
        },
        location: {
          type: "string",
          description: "Event location",
        },
        attendees: {
          type: "array",
          items: { type: "string" },
          description: "List of attendee email addresses",
        },
        addMeet: {
          type: "boolean",
          description: "Add Google Meet link",
          default: false,
        },
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
        timeZone: {
          type: "string",
          description: "Time zone (e.g., 'America/New_York')",
        },
      },
      required: ["summary", "startDateTime", "endDateTime"],
    },
  },
  {
    name: "calendar_update_event",
    description: "Update an existing calendar event",
    inputSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The event ID to update",
        },
        summary: {
          type: "string",
          description: "New event title",
        },
        startDateTime: {
          type: "string",
          description: "New start date/time",
        },
        endDateTime: {
          type: "string",
          description: "New end date/time",
        },
        description: {
          type: "string",
          description: "New description",
        },
        location: {
          type: "string",
          description: "New location",
        },
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
      },
      required: ["eventId"],
    },
  },
  {
    name: "calendar_delete_event",
    description: "Delete a calendar event",
    inputSchema: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The event ID to delete",
        },
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
      },
      required: ["eventId"],
    },
  },
  {
    name: "calendar_free_busy",
    description: "Check free/busy times for calendars",
    inputSchema: {
      type: "object",
      properties: {
        startTime: {
          type: "string",
          description: "Start of time range (ISO format)",
        },
        endTime: {
          type: "string",
          description: "End of time range (ISO format)",
        },
        calendars: {
          type: "array",
          items: { type: "string" },
          description: "List of calendar IDs to check (default: ['primary'])",
        },
        timeZone: {
          type: "string",
          description: "Time zone",
        },
      },
      required: ["startTime", "endTime"],
    },
  },
  {
    name: "calendar_list_calendars",
    description: "List all calendars the user has access to",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "calendar_quick_add",
    description: "Create an event using natural language (e.g., 'Meeting with John tomorrow at 3pm for 1 hour')",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Natural language event description",
        },
        calendarId: {
          type: "string",
          description: "Calendar ID (default: 'primary')",
          default: "primary",
        },
      },
      required: ["text"],
    },
  },
];

// Tool handlers
async function handleTool(name, args) {
  const api = await initCalendar();

  switch (name) {
    case "calendar_list_events": {
      const { startDate, endDate, maxResults = 50, calendarId = "primary" } = args;

      let timeMin, timeMax;
      if (startDate) {
        const parsed = parseDate(startDate);
        const bounds = getDayBounds(parsed);
        timeMin = bounds.start;
        timeMax = endDate ? parseDate(endDate) : bounds.end;
      } else {
        const bounds = getDayBounds(new Date());
        timeMin = bounds.start;
        timeMax = bounds.end;
      }

      const res = await api.events.list({
        calendarId,
        timeMin,
        timeMax,
        maxResults,
        singleEvents: true,
        orderBy: "startTime",
      });

      return {
        timeRange: { start: timeMin, end: timeMax },
        events: (res.data.items || []).map(formatEvent),
        total: res.data.items?.length || 0,
      };
    }

    case "calendar_today": {
      const { calendarId = "primary" } = args;
      return handleTool("calendar_list_events", {
        startDate: "today",
        calendarId
      });
    }

    case "calendar_week": {
      const { startDate, calendarId = "primary" } = args;
      const bounds = getWeekBounds(startDate);

      const res = await api.events.list({
        calendarId,
        timeMin: bounds.start,
        timeMax: bounds.end,
        singleEvents: true,
        orderBy: "startTime",
      });

      return {
        timeRange: bounds,
        events: (res.data.items || []).map(formatEvent),
        total: res.data.items?.length || 0,
      };
    }

    case "calendar_get_event": {
      const { eventId, calendarId = "primary" } = args;
      const res = await api.events.get({
        calendarId,
        eventId,
      });
      return formatEvent(res.data);
    }

    case "calendar_create_event": {
      const {
        summary,
        startDateTime,
        endDateTime,
        description,
        location,
        attendees,
        addMeet = false,
        calendarId = "primary",
        timeZone,
      } = args;

      const event = {
        summary,
        description,
        location,
        start: {
          dateTime: startDateTime,
          timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime,
          timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      if (attendees?.length) {
        event.attendees = attendees.map((email) => ({ email }));
      }

      if (addMeet) {
        event.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        };
      }

      const res = await api.events.insert({
        calendarId,
        requestBody: event,
        conferenceDataVersion: addMeet ? 1 : 0,
        sendUpdates: attendees?.length ? "all" : "none",
      });

      return {
        success: true,
        event: formatEvent(res.data),
        message: `Event "${summary}" created successfully`,
      };
    }

    case "calendar_update_event": {
      const {
        eventId,
        summary,
        startDateTime,
        endDateTime,
        description,
        location,
        calendarId = "primary",
      } = args;

      // Get existing event
      const existing = await api.events.get({ calendarId, eventId });
      const event = existing.data;

      // Update fields
      if (summary) event.summary = summary;
      if (description !== undefined) event.description = description;
      if (location !== undefined) event.location = location;
      if (startDateTime) event.start.dateTime = startDateTime;
      if (endDateTime) event.end.dateTime = endDateTime;

      const res = await api.events.update({
        calendarId,
        eventId,
        requestBody: event,
      });

      return {
        success: true,
        event: formatEvent(res.data),
        message: "Event updated successfully",
      };
    }

    case "calendar_delete_event": {
      const { eventId, calendarId = "primary" } = args;
      await api.events.delete({ calendarId, eventId });
      return {
        success: true,
        eventId,
        message: "Event deleted successfully",
      };
    }

    case "calendar_free_busy": {
      const { startTime, endTime, calendars = ["primary"], timeZone } = args;

      const res = await api.freebusy.query({
        requestBody: {
          timeMin: startTime,
          timeMax: endTime,
          timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
          items: calendars.map((id) => ({ id })),
        },
      });

      const result = {};
      for (const [calId, data] of Object.entries(res.data.calendars || {})) {
        result[calId] = {
          busy: data.busy || [],
          errors: data.errors || [],
        };
      }

      return {
        timeRange: { start: startTime, end: endTime },
        calendars: result,
      };
    }

    case "calendar_list_calendars": {
      const res = await api.calendarList.list();
      return (res.data.items || []).map((cal) => ({
        id: cal.id,
        summary: cal.summary,
        description: cal.description,
        primary: cal.primary || false,
        accessRole: cal.accessRole,
        backgroundColor: cal.backgroundColor,
        foregroundColor: cal.foregroundColor,
        timeZone: cal.timeZone,
      }));
    }

    case "calendar_quick_add": {
      const { text, calendarId = "primary" } = args;
      const res = await api.events.quickAdd({
        calendarId,
        text,
      });
      return {
        success: true,
        event: formatEvent(res.data),
        message: `Event created from: "${text}"`,
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Create MCP server
const server = new Server(
  {
    name: "sabai-calendar",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const result = await handleTool(name, args || {});
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: error.message }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Sabai Calendar MCP server running");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
