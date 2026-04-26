import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SegmentClient } from "../client.js";
import { asResult } from "./_shared.js";

export function registerDestinationTools(server: McpServer, client: SegmentClient): void {
  server.registerTool(
    "list_destinations",
    {
      description: "List all Segment destinations in the workspace. Returns destination name, slug, type, enabled status, and source connections.",
      inputSchema: {
        pagination_cursor: z.string().optional(),
        pagination_count: z.number().int().min(1).max(200).optional().default(50),
      },
    },
    async (args) =>
      asResult(await client.configRequest("GET", "/destinations", { query: args })),
  );

  server.registerTool(
    "get_destination",
    {
      description: "Fetch a single Segment destination by ID.",
      inputSchema: {
        destinationId: z.string().describe("Segment destination ID"),
      },
    },
    async ({ destinationId }) =>
      asResult(await client.configRequest("GET", `/destinations/${destinationId}`)),
  );

  server.registerTool(
    "create_destination",
    {
      description: "Create a new Segment destination and connect it to a source.",
      inputSchema: {
        sourceId: z.string(),
        metadataId: z.string().describe("Destination catalog metadata ID"),
        name: z.string().optional(),
        enabled: z.boolean().optional().default(false),
        settings: z.record(z.unknown()).optional().describe("Destination-specific settings (API keys, etc.)"),
      },
    },
    async (args) =>
      asResult(await client.configRequest("POST", "/destinations", { body: args })),
  );

  server.registerTool(
    "update_destination",
    {
      description: "Update a Segment destination — enable/disable it or update settings.",
      inputSchema: {
        destinationId: z.string(),
        name: z.string().optional(),
        enabled: z.boolean().optional(),
        settings: z.record(z.unknown()).optional(),
      },
    },
    async ({ destinationId, ...body }) =>
      asResult(
        await client.configRequest("PATCH", `/destinations/${destinationId}`, { body }),
      ),
  );

  server.registerTool(
    "list_destination_filters",
    {
      description: "List event filters configured on a Segment destination.",
      inputSchema: {
        destinationId: z.string(),
      },
    },
    async ({ destinationId }) =>
      asResult(
        await client.configRequest("GET", `/destinations/${destinationId}/filters`),
      ),
  );
}
