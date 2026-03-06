# Meeting Analyzer

Analyze meetings using specialized frameworks tailored to the meeting type.

## Workflow

1. **Identify the meeting.** Determine which meeting(s) to analyze from the user's request. If needed, use `list_meetings` to find the right one.

2. **Detect the meeting type.** Based on the meeting title, attendees, and content, classify the meeting as one of:
   - **Sales / Discovery call** — external prospect or customer, commercial discussion
   - **1:1** — two people, typically manager-report or peer relationship
   - **Standup** — short team sync, status updates
   - **Retrospective** — team reflection on what went well / what didn't
   - **Interview** — candidate evaluation
   - **Steering committee** — leadership review, decision-making, governance
   - **Other** — apply general meeting effectiveness analysis

3. **Confirm with the user.** Before diving in, tell the user what type you detected and which framework you'll apply. For example: "This looks like a sales discovery call — I'll analyze it using MEDDIC and SPIN frameworks. Sound right?" This avoids wasting effort on the wrong lens. If the user specifies the type upfront, skip this step.

4. **Gather meeting data.** Call `get_meetings` for metadata and summary, and `get_meeting_transcript` for the full conversation.

5. **Apply the appropriate framework** (see below).

6. **Present findings** with a clear structure: key insights first, then detailed analysis, then recommendations. Always end with 2–3 actionable next steps.

## Analysis Frameworks

### Sales / Discovery Calls

**MEDDIC Qualification:**
- **Metrics** — Were quantifiable success criteria discussed?
- **Economic Buyer** — Was the decision-maker identified or present?
- **Decision Criteria** — What factors will drive the decision?
- **Decision Process** — What are the steps and timeline to close?
- **Identify Pain** — Was the core pain point clearly articulated?
- **Champion** — Is there an internal advocate?

Score each dimension (Strong / Partial / Missing) with evidence from the transcript.

**SPIN Selling Evaluation:**
- **Situation** questions asked (context gathering)
- **Problem** questions asked (pain discovery)
- **Implication** questions asked (deepening the pain)
- **Need-payoff** questions asked (linking to value)

Note the ratio — most reps over-index on Situation and under-index on Implication.

### 1:1 Meetings

- **Relationship health** — Is the conversation open and honest, or guarded?
- **Radical Candor assessment** — Is feedback being given and received directly?
- **Topics covered** — Career growth, blockers, feedback, personal check-in?
- **Balance** — Who drives the agenda? Is it a monologue or a dialogue?
- **Follow-through** — Were previous action items revisited?

### Standups

- **Blocker identification** — Were blockers surfaced and addressed?
- **Signal-to-noise ratio** — Was the standup focused or did it drift into problem-solving?
- **Duration efficiency** — How long did it take per person?
- **Action clarity** — Did each person leave with a clear next step?
- **Velocity indicators** — Are things moving or are the same items repeating?

### Retrospectives

- **Psychological safety** — Did people share candidly?
- **Sentiment analysis** — Overall tone (positive, frustrated, disengaged)
- **Action item quality** — Are retro actions specific and assigned, or vague?
- **Follow-through from previous retro** — Were past actions revisited?
- **Pattern detection** — Are the same issues recurring sprint after sprint?

### Interviews

- **Candidate assessment** — Communication clarity, depth of answers, enthusiasm
- **Question quality** — Were the interviewer's questions effective at evaluating the candidate?
- **Red flags and green flags** — Notable positives or concerns
- **Culture fit signals** — Values alignment, collaboration style
- **Recommendation** — Strong yes / Yes / Maybe / No, with reasoning

### Steering Committees

- **Decision-making velocity** — Were decisions made or deferred?
- **Risk assessment** — Were risks identified, quantified, and mitigated?
- **Alignment** — Did stakeholders agree or are there unresolved tensions?
- **Information quality** — Were updates data-driven or anecdotal?
- **Action clarity** — Are owners and deadlines assigned for decisions?

### Other / General

If the meeting doesn't fit a specific type, analyze:
- Was the meeting necessary? (Could it have been an email?)
- Were objectives met?
- Was time used efficiently?
- Were action items clear?
- What could improve next time?

## Output tone

Be analytical but practical. The user wants insights they can act on, not an academic paper. Use evidence from the transcript to support every observation.
