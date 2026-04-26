import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SegmentClient } from "../client.js";
import { asResult } from "./_shared.js";

export function registerTrackingTools(server: McpServer, client: SegmentClient): void {
  server.registerTool(
    "track_event",
    {
      description:
        "Send a Track call to Segment via the server-side Tracking API. Records a user action. Requires SEGMENT_WRITE_KEY.",
      inputSchema: {
        userId: z.string().optional().describe("Unique user ID (required if anonymousId not set)"),
        anonymousId: z.string().optional().describe("Anonymous session ID (required if userId not set)"),
        event: z.string().describe("Event name e.g. 'Order Completed', 'Page Viewed'"),
        properties: z.record(z.unknown()).optional(),
        timestamp: z.string().optional().describe("ISO8601 timestamp — defaults to now"),
        context: z.record(z.unknown()).optional(),
      },
    },
    async (args) => asResult(await client.trackRequest("/track", args)),
  );

  server.registerTool(
    "identify_user",
    {
      description:
        "Send an Identify call to Segment. Associates traits (name, email, plan, etc.) with a user ID. Requires SEGMENT_WRITE_KEY.",
      inputSchema: {
        userId: z.string(),
        anonymousId: z.string().optional(),
        traits: z.record(z.unknown()).optional().describe("User traits e.g. { name, email, company, plan }"),
        timestamp: z.string().optional(),
        context: z.record(z.unknown()).optional(),
      },
    },
    async (args) => asResult(await client.trackRequest("/identify", args)),
  );

  server.registerTool(
    "group_call",
    {
      description:
        "Send a Group call to Segment. Associates a user with an account/company. Requires SEGMENT_WRITE_KEY.",
      inputSchema: {
        userId: z.string().optional(),
        anonymousId: z.string().optional(),
        groupId: z.string().describe("Account or company ID"),
        traits: z.record(z.unknown()).optional().describe("Group traits e.g. { name, industry, plan, employees }"),
        timestamp: z.string().optional(),
      },
    },
    async (args) => asResult(await client.trackRequest("/group", args)),
  );

  server.registerTool(
    "page_call",
    {
      description:
        "Send a Page call to Segment. Records a page view. Requires SEGMENT_WRITE_KEY.",
      inputSchema: {
        userId: z.string().optional(),
        anonymousId: z.string().optional(),
        name: z.string().optional().describe("Page name e.g. 'Pricing'"),
        properties: z.record(z.unknown()).optional().describe("Page properties e.g. { url, title, referrer }"),
        timestamp: z.string().optional(),
      },
    },
    async (args) => asResult(await client.trackRequest("/page", args)),
  );
}
