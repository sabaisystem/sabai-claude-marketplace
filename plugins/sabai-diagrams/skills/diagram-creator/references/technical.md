# Technical Diagrams Reference (ER + Class)

## Audience Note

ER diagrams and class diagrams are engineering-focused. If the user's request sounds non-technical (e.g., "show how users relate to orders"), consider suggesting a **flowchart** instead, which is more universally understood. Only use ER/class diagrams when the user explicitly asks for one or the context is clearly technical (database design, OOP modeling, API contracts).

## FigJam Export: NOT Supported

ER diagrams and class diagrams cannot be exported to FigJam via `generate_diagram`. If the user asks to export one of these types, inform them of the limitation and suggest screenshotting the rendered diagram instead.

---

## ER Diagrams

### When to Use

- **Database schema design** -- modeling tables and their relationships
- **Data modeling** -- entities, attributes, and cardinality
- **API contract visualization** -- how resources relate to each other

### Syntax

```mermaid
erDiagram
    ENTITY_A ||--o{ ENTITY_B : "relationship label"
```

### Relationship Notation

The notation uses two symbols -- one on each side of the line -- to describe cardinality:

| Left Symbol | Meaning |
|---|---|
| `\|\|` | Exactly one |
| `o\|` | Zero or one |
| `}o` | Zero or more |
| `}\|` | One or more |

| Right Symbol | Meaning |
|---|---|
| `\|\|` | Exactly one |
| `\|o` | Zero or one |
| `o{` | Zero or more |
| `\|{` | One or more |

**Common relationship patterns:**

```
||--||    One-to-one (exactly one on each side)
||--o{    One-to-many (one on left, zero or more on right)
|o--o{    Zero-or-one to zero-or-many
||--|{    One to one-or-more (required on both sides)
}o--o{    Many-to-many (through join table)
```

### Attributes

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string name
        datetime created_at
    }
    POST {
        int id PK
        int user_id FK
        string title
        text body
        datetime published_at
    }
```

Attribute modifiers:
- `PK` -- primary key
- `FK` -- foreign key
- `UK` -- unique key

### Example: Blog System

```mermaid
erDiagram
    USER {
        int id PK
        string email UK
        string display_name
        string avatar_url
        datetime created_at
    }
    POST {
        int id PK
        int author_id FK
        string title
        text body
        string status
        datetime published_at
        datetime created_at
    }
    COMMENT {
        int id PK
        int post_id FK
        int author_id FK
        text body
        datetime created_at
    }
    TAG {
        int id PK
        string name UK
        string slug UK
    }
    POST_TAG {
        int post_id FK
        int tag_id FK
    }
    CATEGORY {
        int id PK
        string name
        int parent_id FK
    }

    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : authors
    POST ||--o{ COMMENT : has
    POST ||--o{ POST_TAG : tagged
    TAG ||--o{ POST_TAG : applied
    CATEGORY ||--o{ POST : contains
    CATEGORY |o--o{ CATEGORY : "parent of"
```

### ER Best Practices

1. **Name entities as singular nouns** -- `USER` not `USERS`, `ORDER` not `ORDERS`
2. **Always include primary keys** -- mark with `PK` for clarity
3. **Mark foreign keys** -- use `FK` to show which fields link to other tables
4. **Label relationships with verbs** -- `writes`, `contains`, `belongs to` make the diagram self-documenting
5. **Show join tables for many-to-many** -- explicitly model the intermediate table (e.g., `POST_TAG`) rather than drawing a direct many-to-many line
6. **Keep entity count under 10** -- beyond that, split by domain or bounded context

---

## Class Diagrams

### When to Use

- **Object-oriented design** -- class hierarchies, interfaces, abstract classes
- **Design patterns** -- documenting strategy, observer, factory patterns
- **API service contracts** -- showing method signatures and relationships
- **Domain modeling** -- rich domain objects with behavior

### Syntax

```mermaid
classDiagram
    class ClassName {
        +String publicField
        -int privateField
        #bool protectedField
        +publicMethod() String
        -privateMethod() void
        #protectedMethod() int
    }
```

### Visibility Modifiers

| Symbol | Meaning |
|---|---|
| `+` | Public |
| `-` | Private |
| `#` | Protected |
| `~` | Package/Internal |

### Relationship Types

```mermaid
classDiagram
    ClassA --|> ClassB : Inheritance
    ClassC ..|> InterfaceD : Implementation
    ClassE --* ClassF : Composition
    ClassG --o ClassH : Aggregation
    ClassI --> ClassJ : Association
    ClassK ..> ClassL : Dependency
```

| Syntax | Relationship | Meaning |
|---|---|---|
| `--\|>` | Inheritance | "is a" (solid line, closed arrow) |
| `..\|>` | Implementation | "implements" (dotted line, closed arrow) |
| `--*` | Composition | "owns" (solid line, filled diamond) |
| `--o` | Aggregation | "has" (solid line, open diamond) |
| `-->` | Association | "uses" (solid line, open arrow) |
| `..>` | Dependency | "depends on" (dotted line, open arrow) |

### Cardinality

```mermaid
classDiagram
    Customer "1" --> "*" Order : places
    Order "1" --> "1..*" LineItem : contains
    LineItem "*" --> "1" Product : references
```

### Annotations

```mermaid
classDiagram
    class PaymentProcessor {
        <<interface>>
        +processPayment(amount) bool
        +refund(transactionId) bool
    }
    class AbstractHandler {
        <<abstract>>
        #handle(request) Response
    }
    class AppConfig {
        <<singleton>>
        -instance AppConfig
        +getInstance() AppConfig
    }
```

### Example: Payment System

```mermaid
classDiagram
    class PaymentProcessor {
        <<interface>>
        +processPayment(amount, currency) PaymentResult
        +refund(transactionId) RefundResult
        +getStatus(transactionId) PaymentStatus
    }

    class StripeProcessor {
        -String apiKey
        -HttpClient client
        +processPayment(amount, currency) PaymentResult
        +refund(transactionId) RefundResult
        +getStatus(transactionId) PaymentStatus
        -createPaymentIntent(amount) StripeIntent
    }

    class PayPalProcessor {
        -String clientId
        -String clientSecret
        -HttpClient client
        +processPayment(amount, currency) PaymentResult
        +refund(transactionId) RefundResult
        +getStatus(transactionId) PaymentStatus
        -getAccessToken() String
    }

    class PaymentService {
        -PaymentProcessor processor
        -TransactionRepository repo
        -EventBus eventBus
        +charge(order) PaymentResult
        +refundOrder(orderId) RefundResult
        -selectProcessor(method) PaymentProcessor
        -publishEvent(event) void
    }

    class PaymentResult {
        +String transactionId
        +bool success
        +String errorMessage
        +DateTime timestamp
    }

    class Transaction {
        +String id
        +Decimal amount
        +String currency
        +PaymentStatus status
        +DateTime createdAt
        +DateTime updatedAt
    }

    class TransactionRepository {
        <<interface>>
        +save(transaction) void
        +findById(id) Transaction
        +findByOrderId(orderId) List~Transaction~
    }

    PaymentProcessor <|.. StripeProcessor : implements
    PaymentProcessor <|.. PayPalProcessor : implements
    PaymentService --> PaymentProcessor : uses
    PaymentService --> TransactionRepository : persists
    PaymentService ..> PaymentResult : returns
    TransactionRepository ..> Transaction : manages
    StripeProcessor ..> PaymentResult : creates
    PayPalProcessor ..> PaymentResult : creates
```

### Class Diagram Best Practices

1. **Start with interfaces and abstractions** -- show the contracts first, then concrete implementations
2. **Use annotations** -- `<<interface>>`, `<<abstract>>`, `<<singleton>>`, `<<enum>>` make the design intent clear
3. **Show only relevant methods** -- include key public methods and important private ones. Skip getters/setters and boilerplate
4. **Use composition over inheritance** -- if the relationships are mostly `--|>`, consider whether the design is too inheritance-heavy
5. **Label relationships** -- `uses`, `creates`, `manages` on association arrows explain the nature of the dependency
6. **Keep classes under 8** -- for larger systems, focus on one bounded context or one design pattern per diagram
7. **Group by layer** -- if showing a layered architecture, arrange classes vertically (controller at top, repository at bottom)

---

## Common Pitfalls (Both Types)

- **Overloading a single diagram** -- both ER and class diagrams become unreadable beyond 10 entities/classes. Split by domain
- **Missing relationship labels** -- unlabeled lines force the reader to guess the nature of the connection
- **Inconsistent naming** -- pick a convention (PascalCase for classes, UPPER_SNAKE for entities) and stick with it
- **Showing implementation details in an architecture diagram** -- if the audience is non-technical, use a flowchart instead
