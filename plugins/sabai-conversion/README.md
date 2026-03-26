# Sabai Conversion

**Smart currency and timezone converter that learns your preferences.**

| Field | Value |
|-------|-------|
| Type | Skills |
| Version | 1.0.0 |
| Status | Active |
| Repo | `plugins/sabai-conversion` |

---

## Overview

An intelligent currency and timezone converter plugin that automatically learns user preferences, eliminating the need to repeatedly specify target currencies or timezones. Supports context-aware currency conversion (e.g., "convert 30 baht" auto-converts to preferred currency), timezone conversion with business hours indicators, and a meeting time finder for overlapping business hours across global teams.

## Key Features

- Smart currency conversion with learned preferences
- Timezone conversion with business hours indicators
- Meeting time finder for international teams
- Context-aware - understands your work relationships
- No need to specify target currencies repeatedly

## Use Cases

- "Convert 1000 baht"
- "How much is $50?"
- "Meeting at 3pm - what time is it elsewhere?"
- "When can we meet with Bangkok?"
- "Call at 10am Bangkok time"

## Configuration

### Settings

Customize preferences in plugin settings:

```json
{
  "preferences": {
    "base_currency": "EUR",
    "home_timezone": "Europe/Paris",
    "customer_timezones": ["America/New_York", "Asia/Bangkok", "Asia/Tokyo"],
    "common_currencies": ["USD", "THB", "GBP"],
    "customer_currency": "THB"
  }
}
```

| Preference | Description | Default |
|------------|-------------|---------|
| `base_currency` | Your primary currency | EUR |
| `home_timezone` | Your timezone | Europe/Paris |
| `customer_timezones` | Timezones to show | NYC, Bangkok, Tokyo |
| `common_currencies` | Additional currencies | USD, THB, GBP |
| `customer_currency` | Main customer's currency | THB |

## Authentication

None required.

## Dependencies

- **Required**: None (uses built-in conversion logic)

## Limitations

- Exchange rates may not be real-time
- Limited to major world currencies and timezones

## Links

- [README](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-conversion)
- [CHANGELOG](https://github.com/sabaisystem/sabai-claude-marketplace/tree/main/plugins/sabai-conversion/CHANGELOG.md)
