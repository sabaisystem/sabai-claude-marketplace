# /convert

Smart currency and timezone converter.

## When to use

When the user wants to:
- Convert currency amounts (e.g., `/convert 100 USD`, `/convert 1000 baht`)
- Convert times between timezones (e.g., `/convert 3pm Bangkok`)
- Find overlapping meeting times between locations

## Instructions

1. Parse the user's input to determine if this is a currency or time conversion
2. Load user preferences from the plugin configuration
3. Follow the detailed instructions in the `conversion.md` skill file
4. Display results in a clean, formatted output

## Examples

- `/convert 1000 THB` - Convert Thai Baht to your base currency
- `/convert 50 EUR to USD` - Convert between specific currencies
- `/convert 3pm Bangkok` - Show what time 3pm Bangkok is in your timezone
- `/convert meeting 10am` - Show meeting time across all configured timezones
