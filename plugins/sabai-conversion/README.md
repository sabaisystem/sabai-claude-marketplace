# Sabai Conversion

Smart currency and timezone converter that learns your preferences. No more specifying target currencies or timezones - it just knows what you need.

## Features

- **Smart Currency Conversion**: Say "convert 30 baht" and it converts to your preferred currency (EUR by default)
- **Intelligent Timezone Conversion**: Give a time and see it in your timezone plus your customers' timezones
- **Meeting Time Finder**: Find overlapping business hours with your international contacts
- **Context Aware**: Understands your work context and customer relationships

## Installation

Add to your Claude Code settings:

```json
{
  "plugins": [
    "sabai-system/sabai-claude-marketplace/plugins/sabai-conversion"
  ]
}
```

## Configuration

Customize your preferences in the plugin settings:

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

### Preference Options

| Preference | Description | Default |
|------------|-------------|---------|
| `base_currency` | Your primary currency | EUR |
| `home_timezone` | Your timezone | Europe/Paris |
| `customer_timezones` | Timezones to show for customers | NYC, Bangkok, Tokyo |
| `common_currencies` | Additional currencies to display | USD, THB, GBP |
| `customer_currency` | Your main customer's currency | THB |

## Usage

### Currency Conversion

```
You: convert 1000 baht

💱 Currency Conversion

1,000 THB =
• 26.50 EUR ← Your currency
• 28.75 USD

Rate: 1 EUR = 37.74 THB
```

```
You: how much is $50?

💱 Currency Conversion

50 USD =
• 46.20 EUR ← Your currency
• 1,745 THB

Rate: 1 USD = 0.92 EUR
```

### Time Conversion

```
You: meeting at 3pm

🕐 Time Conversion

3:00 PM Paris (your time)

• 3:00 PM Paris ← You
• 9:00 AM New York ✓
• 9:00 PM Bangkok ✓
• 11:00 PM Tokyo

✓ = business hours
```

```
You: call at 10am Bangkok time

🕐 Time Conversion

10:00 AM Bangkok

• 4:00 AM Paris ← You (early!)
• 10:00 PM (prev day) New York
• 12:00 PM Tokyo ✓

✓ = business hours
```

### Finding Meeting Times

```
You: when can we meet with Bangkok?

🕐 Overlapping Business Hours

Paris (You) ↔ Bangkok

Good meeting times:
• 8:00 AM Paris = 2:00 PM Bangkok ✓
• 9:00 AM Paris = 3:00 PM Bangkok ✓
• 10:00 AM Paris = 4:00 PM Bangkok ✓
• 11:00 AM Paris = 5:00 PM Bangkok ✓

Recommended: 9:00-11:00 AM Paris
```

## Supported Currencies

THB, EUR, USD, GBP, JPY, CNY, SGD, AUD, CHF, and more.

## Supported Timezones

All major world timezones including:
- Europe: Paris, London, Berlin, Amsterdam
- Americas: New York, Los Angeles, Toronto, São Paulo
- Asia: Bangkok, Tokyo, Singapore, Hong Kong, Shanghai
- Oceania: Sydney, Melbourne, Auckland

## Author

[Sabai System](https://sabaisystem.com)
