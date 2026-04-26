# segment-mcp-server

MCP server for [Twilio Segment](https://segment.com/) — manage sources, destinations, tracking plans, and send server-side events through Claude and other MCP clients.

## Tools

### Config API (requires `SEGMENT_TOKEN`)

| Tool | Description |
|------|-------------|
| `list_sources` | List all sources in the workspace |
| `get_source` | Fetch a single source by ID |
| `create_source` | Create a new source |
| `update_source` | Rename, enable, or disable a source |
| `delete_source` | Delete a source |
| `list_destinations` | List all destinations in the workspace |
| `get_destination` | Fetch a single destination by ID |
| `create_destination` | Create a new destination and connect it to a source |
| `update_destination` | Enable/disable a destination or update its settings |
| `list_destination_filters` | List event filters on a destination |
| `list_tracking_plans` | List all Protocols tracking plans |
| `get_tracking_plan` | Fetch a tracking plan with its event rules |
| `list_tracking_plan_rules` | List all event schemas in a tracking plan |
| `get_workspace` | Fetch workspace name, slug, ID, and region |

### Tracking API (also requires `SEGMENT_WRITE_KEY`)

| Tool | Description |
|------|-------------|
| `track_event` | Send a Track call (user action) |
| `identify_user` | Send an Identify call (associate traits with a user) |
| `group_call` | Send a Group call (associate a user with a company) |
| `page_call` | Send a Page call (record a page view) |

## Installation

```bash
npx segment-mcp-server
```

### Environment variables

| Variable | Description |
|----------|-------------|
| `SEGMENT_TOKEN` | Personal Access Token — generate at **app.segment.com → Settings → Access Management → Tokens** |
| `SEGMENT_WRITE_KEY` | Source write key — find at **Source → Settings → API Keys** (required only for Tracking API tools) |

## Claude Desktop config

```json
{
  "mcpServers": {
    "segment": {
      "command": "npx",
      "args": ["-y", "segment-mcp-server"],
      "env": {
        "SEGMENT_TOKEN": "your_personal_access_token",
        "SEGMENT_WRITE_KEY": "your_source_write_key"
      }
    }
  }
}
```

## Links

- [Segment Public API Documentation](https://segment.com/docs/api/)
- [Segment Tracking API](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/)
