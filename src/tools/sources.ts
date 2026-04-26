import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SegmentClient } from "../client.js";
import { asResult } from "./_shared.js";

export function registerSourceTools(server: McpServer, client: SegmentClient): void {
  server.registerTool(
    "list_sources",
    {
      description: "List all Segment sources in the workspace. Returns source slug, name, type, and enabled status.",
      inputSchema: {
        pagination_cursor: z.string().optional().describe("Pagination cursor from previous response"),
        pagination_count: z.number().int().min(1).max(200).optional().default(50),
      },
    },
    async (args) =>
      asResult(await client.configRequest("GET", "/sources", { query: args })),
  );

  server.registerTool(
    "get_source",
    {
      description: "Fetch a single Segment source by source ID.",
      inputSchema: {
        sourceId: z.string().describe("Segment source ID"),
      },
    },
    async ({ sourceId }) =>
      asResult(await client.configRequest("GET", `/sources/${sourceId}`)),
  );

  server.registerTool(
    "create_source",
    {
      description: "Create a new Segment source.",
      inputSchema: {
        slug: z.string().describe("Unique slug for the source (lowercase, hyphens)"),
        name: z.string(),
        enabled: z.boolean().optional().default(true),
        metadataId: z.string().describe("Source catalog metadata ID (e.g. 'qe3vihbGCE' for JavaScript)"),
        workspaceId: z.string().describe("Segment workspace ID"),
        settings: z.record(z.unknown()).optional().describe("Source-specific settings"),
      },
    },
    async (args) =>
      asResult(await client.configRequest("POST", "/sources", { body: args })),
  );

  server.registerTool(
    "update_source",
    {
      description: "Update a Segment source — rename, enable, or disable it.",
      inputSchema: {
        sourceId: z.string(),
        name: z.string().optional(),
        enabled: z.boolean().optional(),
        settings: z.record(z.unknown()).optional(),
      },
    },
    async ({ sourceId, ...body }) =>
      asResult(
        await client.configRequest("PATCH", `/sources/${sourceId}`, { body }),
      ),
  );

  server.registerTool(
    "delete_source",
    {
      description: "Delete a Segment source by ID.",
      inputSchema: {
        sourceId: z.string(),
      },
    },
    async ({ sourceId }) =>
      asResult(await client.configRequest("DELETE", `/sources/${sourceId}`)),
  );
}
