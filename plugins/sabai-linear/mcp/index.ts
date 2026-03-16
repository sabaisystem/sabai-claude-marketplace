import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { LinearClient } from "@linear/sdk";

const apiKey = process.env.LINEAR_API_KEY;
if (!apiKey) {
  console.error("ERROR: LINEAR_API_KEY environment variable is required");
  process.exit(1);
}

const linear = new LinearClient({ apiKey });

// Retry wrapper for transient API failures
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isTransient = error.message?.includes('fetch failed') ||
                          error.message?.includes('ECONNRESET') ||
                          error.message?.includes('ETIMEDOUT') ||
                          error.status === 429 ||
                          error.status === 503;
      if (!isTransient || attempt === retries) throw error;
      await new Promise(r => setTimeout(r, delay * (attempt + 1)));
    }
  }
  throw new Error('Unreachable');
}

// Client-side date filtering fallback
function applyClientSideDateFilters(issues: any[], args: any): any[] {
  let filtered = issues;
  if (args.completedAfter) {
    const cutoff = new Date(args.completedAfter).getTime();
    filtered = filtered.filter((issue: any) => {
      if (!issue.completedAt) return false;
      return new Date(issue.completedAt).getTime() >= cutoff;
    });
  }
  if (args.createdAfter) {
    const cutoff = new Date(args.createdAfter).getTime();
    filtered = filtered.filter((issue: any) => {
      if (!issue.createdAt) return false;
      return new Date(issue.createdAt).getTime() >= cutoff;
    });
  }
  if (args.updatedAfter) {
    const cutoff = new Date(args.updatedAfter).getTime();
    filtered = filtered.filter((issue: any) => {
      if (!issue.updatedAt) return false;
      return new Date(issue.updatedAt).getTime() >= cutoff;
    });
  }
  return filtered;
}

// Client-side team filtering fallback
function applyClientSideTeamFilter(issues: any[], args: any): any[] {
  if (!args.teamId) return issues;
  return issues.filter((issue: any) => issue.team?.id === args.teamId);
}

// Tool definitions
const tools = [
  {
    name: "linear_create_issue",
    description:
      "Create a new issue in Linear. Returns the created issue with its ID, identifier, URL, and title.",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Issue title" },
        description: {
          type: "string",
          description: "Issue description (markdown supported)",
        },
        teamId: { type: "string", description: "Team ID to create the issue in" },
        projectId: { type: "string", description: "Project ID to assign to" },
        assigneeId: { type: "string", description: "User ID to assign the issue to" },
        priority: {
          type: "number",
          description: "Priority: 0=none, 1=urgent, 2=high, 3=medium, 4=low",
        },
        labelIds: {
          type: "array",
          items: { type: "string" },
          description: "Label IDs to apply",
        },
        stateId: { type: "string", description: "Workflow state ID" },
        estimate: { type: "number", description: "Story points estimate" },
        parentId: { type: "string", description: "Parent issue ID (for sub-issues)" },
        cycleId: { type: "string", description: "Cycle ID to add the issue to" },
      },
      required: ["title", "teamId"],
    },
  },
  {
    name: "linear_get_issue",
    description:
      "Get a single issue by ID or identifier (e.g. 'SCM-123'). Returns full issue details including relations, comments, and labels.",
    inputSchema: {
      type: "object" as const,
      properties: {
        issueId: {
          type: "string",
          description: "Issue ID (UUID) or identifier (e.g. SCM-123)",
        },
      },
      required: ["issueId"],
    },
  },
  {
    name: "linear_search_issues",
    description:
      "Search issues using a text query and/or filters. Returns matching issues with key fields. Use this for finding issues by keywords, filtering by state, assignee, labels, etc.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Text search query" },
        teamId: { type: "string", description: "Filter by team ID" },
        projectId: { type: "string", description: "Filter by project ID" },
        assigneeId: { type: "string", description: "Filter by assignee user ID" },
        stateId: { type: "string", description: "Filter by workflow state ID" },
        stateName: {
          type: "string",
          description:
            "Filter by state name (e.g. 'In Progress', 'Done', 'Backlog')",
        },
        priority: {
          type: "number",
          description: "Filter by priority: 1=urgent, 2=high, 3=medium, 4=low",
        },
        labelName: { type: "string", description: "Filter by label name" },
        createdAfter: {
          type: "string",
          description: "Filter issues created after this date (ISO 8601)",
        },
        updatedAfter: {
          type: "string",
          description: "Filter issues updated after this date (ISO 8601)",
        },
        completedAfter: {
          type: "string",
          description: "Filter issues completed after this date (ISO 8601)",
        },
        includeArchived: {
          type: "boolean",
          description: "Include archived issues (default false)",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 50, max 250)",
        },
        orderBy: {
          type: "string",
          enum: ["createdAt", "updatedAt", "priority"],
          description: "Sort order (default: updatedAt)",
        },
        after: {
          type: "string",
          description: "Cursor for pagination — pass endCursor from a previous response to get the next page",
        },
      },
    },
  },
  {
    name: "linear_list_issues",
    description:
      "List issues for a team or project. Simpler than search — returns all issues matching the given filters without text search.",
    inputSchema: {
      type: "object" as const,
      properties: {
        teamId: { type: "string", description: "Filter by team ID" },
        projectId: { type: "string", description: "Filter by project ID" },
        assigneeId: { type: "string", description: "Filter by assignee user ID" },
        stateId: { type: "string", description: "Filter by workflow state ID" },
        stateName: {
          type: "string",
          description:
            "Filter by state name (e.g. 'In Progress', 'Done', 'Backlog', 'Todo')",
        },
        priority: { type: "number", description: "Filter by priority (1-4)" },
        includeArchived: { type: "boolean", description: "Include archived issues" },
        limit: {
          type: "number",
          description: "Max results (default 50, max 250)",
        },
        after: {
          type: "string",
          description: "Cursor for pagination — pass endCursor from a previous response to get the next page",
        },
      },
    },
  },
  {
    name: "linear_update_issue",
    description:
      "Update an existing issue. Any provided field will be updated; omitted fields are unchanged.",
    inputSchema: {
      type: "object" as const,
      properties: {
        issueId: {
          type: "string",
          description: "Issue ID (UUID) or identifier (e.g. SCM-123)",
        },
        title: { type: "string", description: "New title" },
        description: { type: "string", description: "New description (markdown)" },
        stateId: { type: "string", description: "New workflow state ID" },
        assigneeId: { type: "string", description: "New assignee user ID" },
        priority: { type: "number", description: "New priority (0-4)" },
        projectId: { type: "string", description: "Move to project" },
        labelIds: {
          type: "array",
          items: { type: "string" },
          description: "Replace label IDs",
        },
        estimate: { type: "number", description: "Story points estimate" },
        cycleId: { type: "string", description: "Move to cycle" },
        parentId: { type: "string", description: "Set parent issue" },
      },
      required: ["issueId"],
    },
  },
  {
    name: "linear_get_teams",
    description:
      "List all teams in the workspace. Returns team IDs, names, keys, and member counts.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "linear_get_team",
    description:
      "Get details for a single team including members, states, and labels.",
    inputSchema: {
      type: "object" as const,
      properties: {
        teamId: { type: "string", description: "Team ID or key (e.g. 'SCM')" },
      },
      required: ["teamId"],
    },
  },
  {
    name: "linear_list_projects",
    description:
      "List projects in the workspace, optionally filtered by team.",
    inputSchema: {
      type: "object" as const,
      properties: {
        teamId: { type: "string", description: "Filter by team ID" },
        includeArchived: { type: "boolean", description: "Include archived projects" },
      },
    },
  },
  {
    name: "linear_get_project",
    description:
      "Get details for a single project including status, progress, lead, and members.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
      },
      required: ["projectId"],
    },
  },
  {
    name: "linear_update_project",
    description: "Update a project's name, description, status, or other fields.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
        name: { type: "string", description: "New project name" },
        description: {
          type: "string",
          description: "New project description (markdown)",
        },
        state: {
          type: "string",
          description: "Project state: planned, started, paused, completed, canceled",
        },
        targetDate: {
          type: "string",
          description: "Target completion date (ISO 8601)",
        },
      },
      required: ["projectId"],
    },
  },
  {
    name: "linear_get_cycles",
    description:
      "List cycles (sprints) for a team. Returns cycle details including start/end dates, progress, and issue counts.",
    inputSchema: {
      type: "object" as const,
      properties: {
        teamId: { type: "string", description: "Team ID" },
        includeCompleted: {
          type: "boolean",
          description: "Include completed cycles (default false)",
        },
      },
      required: ["teamId"],
    },
  },
  {
    name: "linear_get_project_milestones",
    description:
      "Get milestones for a project. Returns milestone details including target dates, status, and progress.",
    inputSchema: {
      type: "object" as const,
      properties: {
        projectId: { type: "string", description: "Project ID" },
      },
      required: ["projectId"],
    },
  },
];

// Resolve issue ID — supports both UUID and identifier (e.g. SCM-123)
async function resolveIssueId(issueId: string): Promise<string> {
  // If it looks like an identifier (has letters and dash), use exact filter match
  const match = issueId.match(/^([A-Za-z]+)-(\d+)$/);
  if (match) {
    const teamKey = match[1].toUpperCase();
    const issueNumber = parseInt(match[2], 10);
    const results = await withRetry(() =>
      linear.issues({
        first: 1,
        filter: {
          number: { eq: issueNumber },
          team: { key: { eq: teamKey } },
        },
      })
    );
    const issue = results.nodes[0];
    if (!issue) throw new Error(`Issue not found: ${issueId}`);
    return issue.id;
  }
  return issueId;
}

// Format issue for output
async function formatIssue(issue: any) {
  const [state, assignee, team, labels, project] = await Promise.all([
    issue.state,
    issue.assignee,
    issue.team,
    issue.labels(),
    issue.project,
  ]);

  return {
    id: issue.id,
    identifier: issue.identifier,
    title: issue.title,
    description: issue.description,
    priority: issue.priority,
    priorityLabel: issue.priorityLabel,
    estimate: issue.estimate,
    url: issue.url,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    completedAt: issue.completedAt,
    state: state ? { id: state.id, name: state.name, type: state.type } : null,
    assignee: assignee
      ? { id: assignee.id, name: assignee.name, email: assignee.email }
      : null,
    team: team ? { id: team.id, name: team.name, key: team.key } : null,
    labels: labels?.nodes?.map((l: any) => ({ id: l.id, name: l.name })) || [],
    project: project ? { id: project.id, name: project.name } : null,
  };
}

// Build issue filter from common params
// Build issue filter — teamId and projectId are handled via scoped queries, not filter
function buildIssueFilter(args: any) {
  const filter: any = {};
  // Note: teamId and projectId are NOT added to filter — they use scoped queries instead
  if (args.assigneeId) filter.assignee = { id: { eq: args.assigneeId } };
  if (args.stateId) filter.state = { id: { eq: args.stateId } };
  if (args.stateName) filter.state = { name: { eq: args.stateName } };
  if (args.priority !== undefined) filter.priority = { eq: args.priority };
  if (args.labelName) filter.labels = { name: { eq: args.labelName } };
  if (args.createdAfter) filter.createdAt = { gte: new Date(args.createdAfter) };
  if (args.updatedAfter) filter.updatedAt = { gte: new Date(args.updatedAfter) };
  if (args.completedAfter)
    filter.completedAt = { gte: new Date(args.completedAfter) };

  return filter;
}

// Fetch issues using scoped query: team.issues() or project.issues() when possible
async function fetchIssuesScoped(args: any, filter: any, opts: any = {}): Promise<any> {
  const queryOpts = { first: opts.limit || 50, filter, ...(opts.after ? { after: opts.after } : {}), ...(opts.orderBy ? { orderBy: opts.orderBy } : {}) };

  if (args.projectId) {
    const project = await withRetry(() => linear.project(args.projectId));
    return project.issues(queryOpts);
  }
  if (args.teamId) {
    const team = await withRetry(() => linear.team(args.teamId));
    return team.issues(queryOpts);
  }
  return withRetry(() => linear.issues(queryOpts));
}

// Tool handler
async function handleTool(name: string, args: any) {
  switch (name) {
    case "linear_create_issue": {
      const input: any = {
        title: args.title,
        teamId: args.teamId,
      };
      if (args.description) input.description = args.description;
      if (args.projectId) input.projectId = args.projectId;
      if (args.assigneeId) input.assigneeId = args.assigneeId;
      if (args.priority !== undefined) input.priority = args.priority;
      if (args.labelIds) input.labelIds = args.labelIds;
      if (args.stateId) input.stateId = args.stateId;
      if (args.estimate !== undefined) input.estimate = args.estimate;
      if (args.parentId) input.parentId = args.parentId;
      if (args.cycleId) input.cycleId = args.cycleId;

      const result = await withRetry(() => linear.createIssue(input));
      const issue = await result.issue;
      if (!issue) throw new Error("Failed to create issue");

      return {
        success: true,
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        url: issue.url,
      };
    }

    case "linear_get_issue": {
      const id = await resolveIssueId(args.issueId);
      const issue = await withRetry(() => linear.issue(id));

      const formatted = await formatIssue(issue);

      // Also fetch relations and comments
      const [relations, comments, children] = await Promise.all([
        issue.relations(),
        issue.comments({ first: 10 }),
        issue.children({ first: 20 }),
      ]);

      const formattedRelations = await Promise.all(
        (relations?.nodes || []).map(async (r: any) => {
          const related = await r.relatedIssue;
          return {
            type: r.type,
            relatedIssue: related
              ? { identifier: related.identifier, title: related.title }
              : null,
          };
        })
      );

      const formattedChildren = await Promise.all(
        (children?.nodes || []).map(async (c: any) => {
          const state = await c.state;
          return {
            identifier: c.identifier,
            title: c.title,
            state: state?.name,
            priority: c.priorityLabel,
          };
        })
      );

      return {
        ...formatted,
        relations: formattedRelations,
        comments: (comments?.nodes || []).map((c: any) => ({
          id: c.id,
          body: c.body,
          createdAt: c.createdAt,
          user: c.user?.name,
        })),
        children: formattedChildren,
      };
    }

    case "linear_search_issues": {
      const limit = Math.min(args.limit || 50, 250);
      const filter = buildIssueFilter(args);
      if (!args.includeArchived) {
        filter.archivedAt = { null: true };
      }

      const orderBy = args.orderBy === "createdAt"
        ? "createdAt" as any
        : args.orderBy === "priority"
          ? "priority" as any
          : "updatedAt" as any;

      let results;
      if (args.query) {
        // issueSearch is a top-level query — add team/project to filter for scoping
        const searchFilter = { ...filter };
        if (args.teamId) searchFilter.team = { id: { eq: args.teamId } };
        if (args.projectId) searchFilter.project = { id: { eq: args.projectId } };
        results = await withRetry(() =>
          linear.issueSearch({
            query: args.query,
            first: limit,
            ...(args.after ? { after: args.after } : {}),
            filter: searchFilter,
            orderBy,
          })
        );
      } else {
        // Use scoped queries (team.issues / project.issues) for reliability
        results = await fetchIssuesScoped(args, filter, { limit, after: args.after, orderBy });
      }

      let issues = await Promise.all(
        results.nodes.map((issue: any) => formatIssue(issue))
      );

      // Client-side filtering fallback
      issues = applyClientSideDateFilters(issues, args);
      issues = applyClientSideTeamFilter(issues, args);

      const pageInfo = results.pageInfo;
      return {
        totalCount: issues.length,
        issues,
        pageInfo: {
          hasNextPage: pageInfo?.hasNextPage ?? false,
          endCursor: pageInfo?.endCursor ?? null,
        },
      };
    }

    case "linear_list_issues": {
      const limit = Math.min(args.limit || 50, 250);
      const filter = buildIssueFilter(args);
      if (!args.includeArchived) {
        filter.archivedAt = { null: true };
      }

      // Use scoped queries (team.issues / project.issues) for reliability
      const results = await fetchIssuesScoped(args, filter, { limit, after: args.after });

      let issues = await Promise.all(
        results.nodes.map((issue: any) => formatIssue(issue))
      );

      // Client-side filtering fallback
      issues = applyClientSideDateFilters(issues, args);
      issues = applyClientSideTeamFilter(issues, args);

      const pageInfo = results.pageInfo;
      return {
        totalCount: issues.length,
        issues,
        pageInfo: {
          hasNextPage: pageInfo?.hasNextPage ?? false,
          endCursor: pageInfo?.endCursor ?? null,
        },
      };
    }

    case "linear_update_issue": {
      const id = await resolveIssueId(args.issueId);
      const input: any = {};
      if (args.title) input.title = args.title;
      if (args.description !== undefined) input.description = args.description;
      if (args.stateId) input.stateId = args.stateId;
      if (args.assigneeId) input.assigneeId = args.assigneeId;
      if (args.priority !== undefined) input.priority = args.priority;
      if (args.projectId) input.projectId = args.projectId;
      if (args.labelIds) input.labelIds = args.labelIds;
      if (args.estimate !== undefined) input.estimate = args.estimate;
      if (args.cycleId) input.cycleId = args.cycleId;
      if (args.parentId) input.parentId = args.parentId;

      const result = await withRetry(() => linear.updateIssue(id, input));
      const issue = await result.issue;
      if (!issue) throw new Error("Failed to update issue");

      return {
        success: true,
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        url: issue.url,
      };
    }

    case "linear_get_teams": {
      const teams = await withRetry(() => linear.teams());
      return teams.nodes.map((t: any) => ({
        id: t.id,
        name: t.name,
        key: t.key,
        description: t.description,
        private: t.private,
      }));
    }

    case "linear_get_team": {
      let team;
      // Try by key first (short string like 'SCM'), then by ID
      if (/^[A-Za-z]+$/.test(args.teamId)) {
        const teams = await withRetry(() => linear.teams({ filter: { key: { eq: args.teamId } } }));
        team = teams.nodes[0];
        if (!team) throw new Error(`Team not found with key: ${args.teamId}`);
      } else {
        team = await withRetry(() => linear.team(args.teamId));
      }

      const [members, states, labels] = await Promise.all([
        team.members(),
        team.states(),
        team.labels(),
      ]);

      return {
        id: team.id,
        name: team.name,
        key: team.key,
        description: team.description,
        members: members.nodes.map((m: any) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          active: m.active,
        })),
        states: states.nodes.map((s: any) => ({
          id: s.id,
          name: s.name,
          type: s.type,
          position: s.position,
        })),
        labels: labels.nodes.map((l: any) => ({
          id: l.id,
          name: l.name,
          color: l.color,
        })),
      };
    }

    case "linear_list_projects": {
      const filter: any = {};
      if (args.teamId)
        filter.accessibleTeams = { id: { eq: args.teamId } };
      if (!args.includeArchived) {
        filter.state = { nin: ["canceled"] };
      }

      const projects = await withRetry(() => linear.projects({ filter, first: 100 }));

      return projects.nodes.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description?.substring(0, 200),
        state: p.state,
        progress: p.progress,
        targetDate: p.targetDate,
        url: p.url,
      }));
    }

    case "linear_get_project": {
      const project = await withRetry(() => linear.project(args.projectId));

      const [teams, members, lead] = await Promise.all([
        project.teams(),
        project.members(),
        project.lead,
      ]);

      return {
        id: project.id,
        name: project.name,
        description: project.description,
        state: project.state,
        progress: project.progress,
        targetDate: project.targetDate,
        startDate: project.startDate,
        startedAt: project.startedAt,
        completedAt: project.completedAt,
        url: project.url,
        lead: lead ? { id: lead.id, name: lead.name } : null,
        teams: teams.nodes.map((t: any) => ({
          id: t.id,
          name: t.name,
          key: t.key,
        })),
        members: members.nodes.map((m: any) => ({
          id: m.id,
          name: m.name,
        })),
      };
    }

    case "linear_update_project": {
      const input: any = {};
      if (args.name) input.name = args.name;
      if (args.description !== undefined) input.description = args.description;
      if (args.state) input.state = args.state;
      if (args.targetDate) input.targetDate = args.targetDate;

      const result = await withRetry(() => linear.updateProject(args.projectId, input));
      const project = await result.project;
      if (!project) throw new Error("Failed to update project");

      return {
        success: true,
        id: project.id,
        name: project.name,
        state: project.state,
        url: project.url,
      };
    }

    case "linear_get_cycles": {
      const filter: any = { team: { id: { eq: args.teamId } } };
      if (!args.includeCompleted) {
        filter.isPast = { eq: false };
      }

      const cycles = await withRetry(() => linear.cycles({ filter, first: 20 }));

      return cycles.nodes.map((c: any) => ({
        id: c.id,
        name: c.name,
        number: c.number,
        startsAt: c.startsAt,
        endsAt: c.endsAt,
        completedAt: c.completedAt,
        progress: c.progress,
        issueCountHistory: c.issueCountHistory,
        scopeHistory: c.scopeHistory,
        completedIssueCountAfterEachDay: c.completedIssueCountAfterEachDay,
        completedScopeHistory: c.completedScopeHistory,
      }));
    }

    case "linear_get_project_milestones": {
      const project = await withRetry(() => linear.project(args.projectId));
      const milestones = await project.projectMilestones();
      return milestones.nodes.map((m: any) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        targetDate: m.targetDate,
        status: m.status,
        progress: m.progress,
        sortOrder: m.sortOrder,
      }));
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// Create MCP server
const server = new Server(
  { name: "sabai-linear", version: "1.5.1" },
  { capabilities: { tools: {} } }
);

// Register handlers
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    const result = await handleTool(name, args || {});
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (error: any) {
    const message = error.message || String(error);
    return {
      content: [{ type: "text", text: JSON.stringify({ error: message }, null, 2) }],
      isError: true,
    };
  }
});

// Start server
async function main() {
  try {
    const me = await linear.viewer;
    console.error(`Sabai Linear MCP server running as ${me.name} (${me.email})`);
  } catch (err: any) {
    console.error(`WARNING: API key validation failed: ${err.message}`);
    console.error("Server will start but API calls may fail.");
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
