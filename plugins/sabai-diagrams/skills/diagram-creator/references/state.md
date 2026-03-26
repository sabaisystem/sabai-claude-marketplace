# State Diagram Reference

## When to Use

State diagrams show how an entity transitions between states over its lifecycle. Use them for:

- **Ticket/issue lifecycles** -- backlog to done, with review and blocked states
- **Order statuses** -- placed, processing, shipped, delivered, returned
- **State machines** -- feature flags, circuit breakers, connection states
- **Document workflows** -- draft, review, approved, published
- **User account states** -- active, suspended, deactivated, deleted

## Syntax Reference

### Basic Structure

Always use `stateDiagram-v2` (not the legacy `stateDiagram`).

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Review : Submit
    Review --> Approved : Approve
    Review --> Draft : Request changes
    Approved --> Published : Publish
    Published --> [*]
```

### Start and End Markers

```mermaid
stateDiagram-v2
    [*] --> Active : Created
    Active --> [*] : Deleted
```

- `[*]` at the start of a transition = start state (filled circle)
- `[*]` at the end of a transition = end state (circle with border)

Always include a `[*] -->` start marker. Include an end marker (`--> [*]`) when the entity has a terminal state.

### State Descriptions

```mermaid
stateDiagram-v2
    state "Waiting for Payment" as waiting_payment
    state "In Transit" as in_transit

    [*] --> waiting_payment
    waiting_payment --> in_transit : Payment received
```

Use the `state "Label" as id` syntax when state names contain spaces or special characters.

### Transitions with Events

Label transitions with the event or action that causes them:

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start job
    Processing --> Complete : Job finished
    Processing --> Failed : Error occurred
    Failed --> Processing : Retry
    Complete --> [*]
```

### Composite (Nested) States

Group related states inside a parent state:

```mermaid
stateDiagram-v2
    [*] --> Active

    state Active {
        [*] --> Idle
        Idle --> Working : Assign task
        Working --> Idle : Complete task
    }

    Active --> Suspended : Suspend account
    Suspended --> Active : Reactivate
    Active --> [*] : Close account
```

### Choice Pseudo-State

Use `<<choice>>` for conditional branching:

```mermaid
stateDiagram-v2
    [*] --> Submitted
    Submitted --> review_check
    state review_check <<choice>>
    review_check --> Approved : Score >= 80
    review_check --> Rejected : Score < 80
    Approved --> [*]
    Rejected --> [*]
```

### Fork and Join

Use `<<fork>>` and `<<join>>` for parallel state transitions:

```mermaid
stateDiagram-v2
    [*] --> Received

    Received --> process_fork
    state process_fork <<fork>>
    process_fork --> PaymentProcessing
    process_fork --> InventoryCheck

    PaymentProcessing --> process_join
    InventoryCheck --> process_join
    state process_join <<join>>
    process_join --> ReadyToShip

    ReadyToShip --> [*]
```

### Notes

```mermaid
stateDiagram-v2
    [*] --> Active
    Active --> Locked : 3 failed attempts
    note right of Locked
        Auto-unlocks after 30 minutes
        or manual unlock by admin
    end note
    Locked --> Active : Unlock
```

## Example 1: Ticket Lifecycle

A complete ticket workflow from creation through resolution.

```mermaid
stateDiagram-v2
    [*] --> Open : Ticket created

    Open --> InProgress : Assign to developer
    Open --> Closed : Close as duplicate

    InProgress --> Review : Submit for review
    InProgress --> Blocked : Dependency found

    Blocked --> InProgress : Dependency resolved

    Review --> InProgress : Changes requested
    Review --> QA : Approved

    QA --> InProgress : Bug found
    QA --> Done : Tests passed

    Done --> [*]
    Closed --> [*]
```

## Example 2: E-commerce Order with Composite States

An order lifecycle with grouped processing and shipping states.

```mermaid
stateDiagram-v2
    [*] --> Placed : Customer submits order

    state "Processing" as processing {
        [*] --> PaymentPending
        PaymentPending --> PaymentConfirmed : Payment succeeds
        PaymentPending --> PaymentFailed : Payment declined
        PaymentConfirmed --> Picking : Items available
        PaymentFailed --> [*]
    }

    Placed --> processing

    state "Shipping" as shipping {
        [*] --> Packed
        Packed --> Dispatched : Carrier pickup
        Dispatched --> InTransit : Scanned at hub
        InTransit --> OutForDelivery : Last mile
    }

    processing --> shipping : Items picked
    processing --> Cancelled : Payment failed

    shipping --> Delivered : Customer confirms
    Delivered --> Returned : Return requested
    Returned --> Refunded : Refund processed

    Delivered --> [*]
    Refunded --> [*]
    Cancelled --> [*]
```

## Best Practices

1. **Always include start and end markers** -- `[*]` at the beginning and end makes the lifecycle boundaries clear
2. **Always use `stateDiagram-v2`** -- the v2 syntax has better rendering, composite state support, and choice/fork/join pseudo-states
3. **Label every transition with the event** -- transitions without labels leave the reader guessing what triggers the change. Write the triggering action or event on every arrow
4. **Show error and recovery paths** -- a state diagram is incomplete without showing what happens when things go wrong (failed payments, rejected reviews, timeouts)
5. **Use composite states for phases** -- if your lifecycle has clear phases (e.g., "Processing" contains payment and picking), nest related states to reduce top-level clutter
6. **Limit top-level states to 8** -- beyond that, use composite states or split into multiple diagrams
7. **Name states as adjectives or past participles** -- "Approved", "InProgress", "Shipped" are clearer than "Approve", "Progress", "Ship"

## Common Pitfalls

- **Missing start marker** -- every state diagram should begin with `[*] -->`. Without it, the entry point is ambiguous
- **Dead-end states with no exit** -- if a state has no outgoing transition and is not `[*]`, it traps the entity. Either add an exit path or mark it as terminal with `--> [*]`
- **Using legacy `stateDiagram` syntax** -- always use `stateDiagram-v2`. The v1 syntax lacks composite states, choice, fork/join, and has rendering issues
- **Transition labels that describe the target state instead of the event** -- write "Payment succeeds" (event), not "Paid" (state name). The arrow already points to the target state
- **Overly complex single diagrams** -- if you have more than 12 states at the top level, consider splitting by lifecycle phase into separate diagrams
