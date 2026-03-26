# Sequence Diagram Reference

## When to Use

Sequence diagrams show interactions between participants over time. Use them for:

- **API flows** -- request/response cycles between client and server
- **Service-to-service interactions** -- microservice communication patterns
- **Authentication flows** -- OAuth2, SAML, JWT refresh
- **Webhook and event-driven flows** -- publish/subscribe, event sourcing
- **User-system interactions** -- how a user action triggers backend processing

## Syntax Reference

### Basic Structure

```mermaid
sequenceDiagram
    participant client as Client
    participant api as API Server
    participant db as Database

    client->>api: POST /users
    api->>db: INSERT user
    db-->>api: User created
    api-->>client: 201 Created
```

### Participant Aliases

Define participants at the top to control their order and display names:

```mermaid
sequenceDiagram
    participant u as User
    participant fe as Frontend
    participant gw as API Gateway
    participant auth as Auth Service
    participant db as Database
```

Participants appear left-to-right in the order they are declared. Order them by first interaction for a natural reading flow.

### Message Types

| Syntax | Meaning | Use For |
|---|---|---|
| `->>` | Solid arrow (synchronous) | HTTP requests, function calls |
| `-->>` | Dotted arrow (response) | HTTP responses, return values |
| `--)` | Async message (open arrow) | Events, webhooks, queue messages |
| `--x` | Lost message | Timeouts, failures |
| `->>+` | Activate target | Start of processing |
| `->>-` | Deactivate target | End of processing |

### Control Flow

**Alt/Else (conditional):**
```mermaid
sequenceDiagram
    participant client as Client
    participant api as API

    client->>api: Request
    alt success
        api-->>client: 200 OK
    else error
        api-->>client: 500 Error
    end
```

**Opt (optional):**
```mermaid
sequenceDiagram
    participant client as Client
    participant api as API
    participant cache as Cache

    client->>api: GET /data
    opt cache hit
        api-->>client: Cached response
    end
    api->>api: Process request
```

**Loop:**
```mermaid
sequenceDiagram
    participant worker as Worker
    participant queue as Queue
    participant processor as Processor

    loop Every 30 seconds
        worker->>queue: Poll for messages
        queue-->>worker: Messages batch
        worker->>processor: Process batch
    end
```

**Par (parallel):**
```mermaid
sequenceDiagram
    participant api as API
    participant svc_a as Service A
    participant svc_b as Service B

    par fetch in parallel
        api->>svc_a: Get user data
    and
        api->>svc_b: Get order data
    end
    svc_a-->>api: User data
    svc_b-->>api: Order data
```

### Activation Boxes

Show when a participant is actively processing:

```mermaid
sequenceDiagram
    participant client as Client
    participant api as API
    participant db as Database

    client->>+api: POST /orders
    api->>+db: BEGIN transaction
    db-->>-api: Transaction started
    api->>+db: INSERT order
    db-->>-api: Order inserted
    api->>+db: COMMIT
    db-->>-api: Committed
    api-->>-client: 201 Created
```

### Notes

```mermaid
sequenceDiagram
    participant client as Client
    participant api as API

    Note over client,api: TLS 1.3 encrypted
    client->>api: Request
    Note right of api: Validate JWT
    api-->>client: Response
```

## Example 1: OAuth2 Authorization Code Flow

```mermaid
sequenceDiagram
    participant user as User
    participant app as Application
    participant auth as Auth Server
    participant resource as Resource Server

    user->>app: Click "Sign In"
    app->>auth: Redirect to /authorize
    Note right of auth: state=xyz&scope=read
    auth->>user: Show login page
    user->>auth: Enter credentials
    auth->>auth: Validate credentials

    alt valid credentials
        auth->>app: Redirect with auth code
        app->>+auth: POST /token (code + secret)
        Note right of auth: Exchange code for tokens
        auth-->>-app: Access token + refresh token
        app->>+resource: GET /api/data (Bearer token)
        resource->>resource: Validate token
        resource-->>-app: Protected data
        app-->>user: Show dashboard
    else invalid credentials
        auth-->>user: Show error message
    end
```

## Example 2: E-commerce Checkout Flow

```mermaid
sequenceDiagram
    participant customer as Customer
    participant cart as Cart Service
    participant inventory as Inventory
    participant payment as Payment Gateway
    participant orders as Order Service
    participant notify as Notification

    customer->>cart: Proceed to checkout
    cart->>+inventory: Reserve items
    inventory-->>-cart: Items reserved (hold 10 min)

    cart->>customer: Show payment form
    customer->>cart: Submit payment details

    cart->>+payment: Charge card
    alt payment success
        payment-->>-cart: Payment confirmed
        cart->>+orders: Create order
        orders->>inventory: Confirm reservation
        inventory-->>orders: Stock deducted
        orders-->>-cart: Order ID: ORD-1234
        cart-->>customer: Order confirmed

        par send notifications
            orders--)notify: Send confirmation email
        and
            orders--)notify: Send SMS update
        end
    else payment failed
        payment-->>cart: Payment declined
        cart->>inventory: Release reservation
        inventory-->>cart: Items released
        cart-->>customer: Payment failed, try again
    end
```

## Best Practices

1. **Order participants by first interaction** -- the leftmost participant should be the initiator (usually the user or client), and participants should appear roughly in the order they first get called
2. **Keep participant count under 6** -- more than 6 participants makes the diagram wide and hard to read. If you need more, consider splitting into multiple diagrams by bounded context
3. **Use aliases for long names** -- `participant gw as API Gateway` keeps the diagram compact
4. **Show the happy path first, then alternatives** -- use `alt/else` for error cases rather than mixing them into the main flow
5. **Label messages with action verbs** -- "POST /users" or "Validate token" is better than just "request" or "data"
6. **Use activation boxes sparingly** -- they add clarity for long-running operations but clutter simple request/response pairs
7. **Add notes for non-obvious context** -- encryption, token formats, retry policies

## Common Pitfalls

- **Forgetting return arrows** -- every request (`->>`) should eventually have a response (`-->>`) unless it is fire-and-forget
- **Inconsistent message direction** -- responses should always go back toward the caller, not forward to the next participant
- **Too many nested alt/else blocks** -- more than 2 levels of nesting is hard to read. Flatten by splitting into separate diagrams
- **Missing participant declarations** -- always declare participants explicitly at the top to control ordering. Letting Mermaid auto-detect order can produce unexpected layouts
- **Using activation on fire-and-forget messages** -- async messages (`--)`) should not use activation since the sender does not wait
