# Smart Conversion Skill

This skill handles intelligent currency and timezone conversions based on user preferences.

## When to Use

Use this skill when the user:
- Mentions converting currency amounts (e.g., "convert 30 baht", "how much is 100 USD")
- Asks about time in different locations (e.g., "what time is 3pm in Bangkok", "meeting at 10am")
- Uses keywords like: convert, exchange, rate, time, timezone, schedule

## User Preferences

Load these preferences from the plugin configuration:

- **base_currency**: User's primary currency (default: EUR)
- **home_timezone**: User's timezone (default: Europe/Paris)
- **customer_timezones**: Timezones to display for customers/partners
- **common_currencies**: Additional currencies to show
- **customer_currency**: Main customer's currency (default: THB for Thai Baht)

## Currency Conversion

When the user mentions a currency amount:

1. **Detect the source currency** from the input:
   - "30 baht" → THB
   - "100 dollars" or "$100" → USD
   - "50 euros" or "50€" → EUR
   - "30 THB" → THB
   - Currency codes: USD, EUR, GBP, THB, JPY, etc.

2. **Determine target currencies** intelligently:
   - If source is NOT the base_currency → convert TO base_currency first
   - If source IS the base_currency → convert TO customer_currency
   - Always show the base_currency in results
   - Include common_currencies if relevant

3. **Fetch current exchange rates** using WebSearch:
   - Search for: "[amount] [source_currency] to [target_currency] exchange rate"
   - Use reliable sources like Google, XE.com, or financial sites

4. **Display results** in a clean format:
   ```
   💱 Currency Conversion

   [amount] [source] =
   • [converted] [base_currency] ← Your currency
   • [converted] [other_currency]

   Rate: 1 [source] = [rate] [target]
   ```

## Time Zone Conversion

When the user mentions a time:

1. **Parse the time** from input:
   - "3pm" → 15:00
   - "10:30" → 10:30
   - "meeting tomorrow at 2pm" → extract 14:00

2. **Determine source timezone**:
   - If timezone mentioned → use it
   - If location mentioned (e.g., "Bangkok time") → map to timezone
   - Default to home_timezone

3. **Convert to relevant timezones**:
   - Always show home_timezone
   - Show all customer_timezones
   - Highlight which times are during business hours (9am-6pm)

4. **Display results** in a clean format:
   ```
   🕐 Time Conversion

   [time] [source_location]

   • [time] [home_location] ← You
   • [time] [customer_location_1]
   • [time] [customer_location_2]

   ✓ = business hours (9am-6pm)
   ```

## Context Awareness

Be smart about context:

- If user frequently converts THB ↔ EUR, remember this pattern
- If user mentions a customer location, prioritize that timezone
- If user is scheduling a meeting, suggest times that work for all parties
- Consider daylight saving time differences

## Examples

### Currency Example
User: "convert 1000 baht"

Response:
```
💱 Currency Conversion

1,000 THB =
• 26.50 EUR ← Your currency
• 28.75 USD

Rate: 1 EUR = 37.74 THB
```

### Time Example
User: "meeting at 3pm"

Response:
```
🕐 Time Conversion

3:00 PM Paris (your time)

• 3:00 PM Paris ← You
• 9:00 AM New York ✓
• 9:00 PM Bangkok ✓
• 11:00 PM Tokyo

✓ = business hours
```

### Finding Good Meeting Times
User: "when can we meet with Bangkok?"

Response:
```
🕐 Overlapping Business Hours

Paris (You) ↔ Bangkok

Good meeting times:
• 8:00 AM Paris = 2:00 PM Bangkok ✓
• 9:00 AM Paris = 3:00 PM Bangkok ✓
• 10:00 AM Paris = 4:00 PM Bangkok ✓
• 11:00 AM Paris = 5:00 PM Bangkok ✓
• 12:00 PM Paris = 6:00 PM Bangkok (end of day)

Recommended: 9:00-11:00 AM Paris
```

## Currency Codes Reference

Common currencies to recognize:
- THB: Thai Baht (baht, ฿)
- EUR: Euro (euro, €)
- USD: US Dollar (dollar, $, usd)
- GBP: British Pound (pound, £)
- JPY: Japanese Yen (yen, ¥)
- CNY: Chinese Yuan (yuan, rmb)
- SGD: Singapore Dollar
- AUD: Australian Dollar
- CHF: Swiss Franc

## Timezone Reference

Common timezone mappings:
- Paris, France → Europe/Paris
- New York, USA → America/New_York
- Bangkok, Thailand → Asia/Bangkok
- Tokyo, Japan → Asia/Tokyo
- London, UK → Europe/London
- Singapore → Asia/Singapore
- Sydney, Australia → Australia/Sydney
- Los Angeles, USA → America/Los_Angeles
