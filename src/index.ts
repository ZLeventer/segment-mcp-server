#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SegmentClient } from "./client.js";
import { registerSourceTools } from "./tools/sources.js";
import { registerDestinationTools } from "./tools/destinations.js";
import { registerTrackingTools } from "./tools/tracking.js";
import { registerTrackingPlanTools } from "./tools/tracking_plans.js";

async function main() {
  const token = process.env.SEGMENT_TOKEN;
  if (!token) {
    console.error(
      "SEGMENT_TOKEN is not set. Generate a Personal Access Token at app.segment.com → Settings → Access Management → Tokens.",
    );
    process.exit(1);
  }

  const writeKey = process.env.SEGMENT_WRITE_KEY;
  const client = new SegmentClient(token, writeKey);
  const server = new McpServer({ name: "segment-mcp-server", version: "1.0.0" });

  registerSourceTools(server, client);
  registerDestinationTools(server, client);
  registerTrackingTools(server, client);
  registerTrackingPlanTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("segment-mcp-server ready on stdio");
}

main().catch((err) => {
  console.error("fatal:", err);
  process.exit(1);
});
