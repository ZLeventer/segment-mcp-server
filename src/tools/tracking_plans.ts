import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SegmentClient } from "../client.js";
import { asResult } from "./_shared.js";

export function registerTrackingPlanTools(server: McpServer, client: SegmentClient): void {
  server.registerTool(
    "list_tracking_plans",
    {
      description: "List all Segment Protocols tracking plans in the workspace.",
      inputSchema: {
        pagination_cursor: z.string().optional(),
        pagination_count: z.number().int().min(1).max(200).optional().default(50),
      },
    },
    async (args) =>
      asResult(await client.configRequest("GET", "/tracking-plans", { query: args })),
  );

  server.registerTool(
    "get_tracking_plan",
    {
      description: "Fetch a single tracking plan by ID, including its rules and event schemas.",
      inputSchema: {
        trackingPlanId: z.string(),
      },
    },
    async ({ trackingPlanId }) =>
      asResult(await client.configRequest("GET", `/tracking-plans/${trackingPlanId}`)),
  );

  server.registerTool(
    "list_tracking_plan_rules",
    {
      description: "List all event rules (schemas) defined in a tracking plan.",
      inputSchema: {
        trackingPlanId: z.string(),
        pagination_cursor: z.string().optional(),
        pagination_count: z.number().int().min(1).max(200).optional().default(50),
      },
    },
    async ({ trackingPlanId, ...query }) =>
      asResult(
        await client.configRequest("GET", `/tracking-plans/${trackingPlanId}/rules`, {
          query,
        }),
      ),
  );

  server.registerTool(
    "get_workspace",
    {
      description: "Fetch the current Segment workspace details (name, slug, ID, region).",
      inputSchema: {},
    },
    async () => asResult(await client.configRequest("GET", "/workspaces")),
  );
}
