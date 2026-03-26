# Flowchart Reference

## When to Use

Flowcharts are the most versatile diagram type. Use them for:

- **Processes and pipelines** -- deployment, CI/CD, data processing
- **Decision trees** -- support triage, approval workflows, feature flags
- **User journeys** -- signup flows, onboarding, checkout
- **System architecture** -- high-level component relationships
- **Troubleshooting guides** -- diagnostic paths with yes/no branches

## Syntax Reference

### Direction

```
graph TD    %% Top to Down (hierarchical)
graph LR    %% Left to Right (sequential)
graph TB    %% Top to Bottom (same as TD)
graph BT    %% Bottom to Top
graph RL    %% Right to Left
```

Choose `TD` for hierarchical structures (trees, org charts, decision flows).
Choose `LR` for sequential processes (pipelines, timelines, data flows).

### Node Shapes

```mermaid
graph TD
    rect[Rectangle - default]
    rounded(Rounded rectangle)
    stadium([Stadium shape])
    diamond{Diamond - decision}
    hexagon{{Hexagon}}
    circle((Circle))
    asymmetric>Asymmetric]
    trapezoid[/Trapezoid/]
    trapezoid_alt[\Trapezoid alt\]
    double_circle(((Double circle)))
```

Common usage:
- `[rect]` -- standard process steps
- `(rounded)` -- start/end points
- `{diamond}` -- decisions (yes/no, if/else)
- `((circle))` -- connectors or events
- `([stadium])` -- inputs/outputs

### Edge Types

```mermaid
graph LR
    A --> B
    B -.-> C
    C ==> D
    D -->|label| E
    E -.->|optional| F
    F ==>|critical| G
    G --- H
    H -.- I
    I === J
```

| Syntax | Meaning |
|---|---|
| `-->` | Solid arrow (primary flow) |
| `-.->` | Dotted arrow (optional/async) |
| `==>` | Thick arrow (critical/highlighted) |
| `-->|label|` | Arrow with label |
| `---` | Solid line (no arrow) |
| `-.-` | Dotted line (no arrow) |
| `===` | Thick line (no arrow) |

### Subgraphs

```mermaid
graph TD
    subgraph frontend["Frontend"]
        react[React App]
        nginx[Nginx]
    end
    subgraph backend["Backend"]
        api[API Server]
        worker[Background Worker]
    end
    subgraph storage["Storage"]
        db[(PostgreSQL)]
        cache[(Redis)]
    end
    react --> nginx
    nginx --> api
    api --> db
    api --> cache
    worker --> db
```

Use subgraphs when you have more than 7 nodes to group related components. Always give subgraphs a descriptive label.

### Styling

```mermaid
graph TD
    success[Deploy Success]
    failure[Deploy Failed]
    style success fill:#22c55e,stroke:#16a34a,color:#fff
    style failure fill:#ef4444,stroke:#dc2626,color:#fff
```

Or use class definitions for reusable styles:

```mermaid
graph TD
    classDef success fill:#22c55e,stroke:#16a34a,color:#fff
    classDef error fill:#ef4444,stroke:#dc2626,color:#fff
    classDef pending fill:#eab308,stroke:#ca8a04,color:#000
    deploy[Deploy]:::success
    rollback[Rollback]:::error
    waiting[Waiting]:::pending
```

## Example 1: CI/CD Deployment Pipeline

A left-to-right pipeline showing the stages of a deployment process.

```mermaid
graph LR
    push[Push to Main] --> lint[Lint & Format]
    lint --> test[Run Tests]
    test --> build[Build Image]
    build --> scan[Security Scan]
    scan --> staging_deploy[Deploy to Staging]
    staging_deploy --> smoke[Smoke Tests]
    smoke --> approval{Manual Approval}
    approval -->|Approved| prod_deploy[Deploy to Production]
    approval -->|Rejected| notify_team[Notify Team]
    prod_deploy --> health[Health Check]
    health -->|Healthy| done([Release Complete])
    health -->|Unhealthy| rollback[Rollback]
    rollback --> notify_team
```

## Example 2: Customer Support Decision Tree

A top-down decision tree for routing customer support tickets.

```mermaid
graph TD
    start([New Ticket]) --> category{Ticket Category}
    category -->|Billing| billing_check{Has Active Sub?}
    category -->|Technical| tech_check{Can Reproduce?}
    category -->|Account| account_check{Verified Identity?}

    billing_check -->|Yes| refund_eligible{Refund Eligible?}
    billing_check -->|No| activate[Help Activate]
    refund_eligible -->|Yes| process_refund[Process Refund]
    refund_eligible -->|No| explain_policy[Explain Policy]

    tech_check -->|Yes| severity{Severity Level}
    tech_check -->|No| request_info[Request More Info]
    severity -->|Critical| escalate[Escalate to Eng]
    severity -->|Normal| create_bug[Create Bug Ticket]

    account_check -->|Yes| reset_access[Reset Access]
    account_check -->|No| verify_id[Request Verification]
```

## Example 3: User Signup Flow with Subgraphs

A top-down flow showing the user registration process grouped by responsibility area.

```mermaid
graph TD
    subgraph client["Client"]
        start([User Clicks Sign Up]) --> form[Fill Registration Form]
        form --> submit[Submit Form]
    end

    subgraph api_layer["API Layer"]
        submit --> validate{Validate Input}
        validate -->|Invalid| show_errors[Return Errors]
        show_errors --> form
        validate -->|Valid| check_dup{Email Exists?}
        check_dup -->|Yes| show_conflict[Return Conflict]
        show_conflict --> form
        check_dup -->|No| create_user[Create User Record]
    end

    subgraph services["Background Services"]
        create_user --> send_email[Send Verification Email]
        create_user --> init_profile[Initialize Profile]
        create_user --> track_event[Track Signup Event]
    end

    send_email --> verify([User Verifies Email])
    verify --> active([Account Active])
```

## Best Practices

1. **Start with the happy path** -- lay out the primary flow first, then add branches for errors and edge cases
2. **Keep decision nodes binary when possible** -- yes/no or success/fail is clearest. For multi-way decisions, use a chain of binary decisions or list the options as labeled edges
3. **Use consistent node shapes** -- pick a convention (e.g., rectangles for steps, diamonds for decisions, stadiums for start/end) and stick with it throughout the diagram
4. **Label all decision edges** -- every arrow leaving a diamond should have a label explaining the condition
5. **Limit branching depth to 4 levels** -- deeper nesting makes diagrams hard to follow. Consider splitting into sub-diagrams
6. **Name nodes by what they DO, not what they ARE** -- `validate_input` is better than `validator`, `send_email` is better than `email_service`

## Common Pitfalls

- **Forgetting to quote labels with special characters** -- `A["Step (1): Init"]` needs quotes when using parentheses
- **Circular references without context** -- loops like `A --> B --> A` need a label or condition to explain when the loop exits
- **Too many crossing edges** -- rearrange node order or use subgraphs to minimize line crossings
- **Mixing directions in one diagram** -- stick to one direction (TD or LR) per diagram. Subgraphs inherit the parent direction
- **Using single-character IDs** -- `A`, `B`, `C` make diagrams hard to maintain. Always use descriptive IDs
