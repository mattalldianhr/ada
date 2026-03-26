# Agent Ad Copy Rules

Rules for generating valid agent ad content that accurately represents how Ada's agents work.

---

## Core Principle

**The ad shows an agent catching something in real-time.** The user is writing, pauses, and the agent flags an issue they might have missed. Everything must feel like a helpful collaborator, not a critic.

---

## Rule 1: The Editor Text

The sentence must be something **the user is actively writing**—mid-thought, mid-draft.

### Valid Examples
- Work emails, reports, messages
- Creative writing drafts
- Common phrases people actually type
- Text with a weakness the agent is designed to catch

### Invalid Examples
- Perfect text with nothing to flag
- Text so bad no one would write it
- Errors the agent type wouldn't catch
- Text that requires external knowledge

### The Highlight
The `{{highlighted}}` portion must be:
- Something the specific agent would flag
- A complete, replaceable unit
- Not breaking grammar if swapped

---

## Rule 2: Agent Identity

Each agent has a clear personality and purpose.

### Required Fields
| Field | Description |
|-------|-------------|
| `name` | Short, memorable name (2-3 words max) |
| `color` | Hex color for visual identity |
| `icon` | Icon type (info, mic, book, etc.) |

### Agent Types

**Professional Agents** - Help you write better
- Clarity Check (green) - vague language, hedging
- Voice Consistency (purple) - matches style guide
- Jargon Buster (orange) - corporate speak
- Brevity (blue) - wordiness, redundancy
- Confidence (teal) - undermining language

**Fun Agents** - Creative rewrites
- Use playful names
- Clear personality in suggestions
- Issue text can be in-character

---

## Rule 3: The Issue

The issue explains **why** something was flagged, not just what.

### Good Issues
- `"Significant" is vague—you have the number.`
- `Passive construction. Your voice guide says: active voice always.`
- `Hedging weakens your point. Be direct.`

### Bad Issues
- `This is wrong.` (no explanation)
- `Consider changing this.` (too vague)
- `Error detected.` (robotic)

### Issue Voice
- Direct but friendly
- Explains the reasoning
- Can reference user's style guide
- Fun agents can be in-character

---

## Rule 4: The Suggestion

The suggestion must be a **direct replacement** that fits grammatically.

### Rules
1. Must fit in place of the highlight
2. Must address the agent's specific concern
3. Must be roughly similar length or shorter
4. Fun agents: suggestion matches the agent's personality

### Validation
Test: `before + suggestion + after` must read as a valid sentence.

---

## Rule 5: Timing

Agent ads are faster than voice ads (no speaking/transcription steps).

### Typical Flow
```
typingSpeed: 35ms/char      # User types
pauseBeforeAgent: 1000-1500ms   # User stops, agent notices
highlightDuration: 500-700ms    # Agent highlights
cardAppearDuration: 400ms       # Card slides in
issueDuration: 1500-2000ms      # Read the issue
suggestionDuration: 1000-1500ms # See the fix
acceptDelay: 400ms              # Click animation
appliedDuration: 1500ms         # Success state
ctaDuration: 3000ms             # CTA screen
```

### Total Loop
~12-15 seconds per variant (faster than voice ads)

---

## Rule 6: CTA Copy

The CTA should relate to the agent's value proposition.

### Patterns
| Agent Type | CTA Description Pattern |
|------------|------------------------|
| Clarity | "Catch your [weakness] before they weaken your writing." |
| Voice | "Your tone drifts. An agent remembers what you forget." |
| Jargon | "Kill the corporate speak. Sound like yourself." |
| Fun | "[Playful hook related to agent personality]" |

---

## Character Limits

Same spatial constraints as voice ads.

| Component | Target | Max |
|-----------|--------|-----|
| Editor Text | 80-100 chars | 130 |
| Highlight | 15-30 chars | 40 |
| Issue | 40-60 chars | 80 |
| Suggestion | 10-25 chars | 35 |
| CTA Description | 40-50 chars | 60 |

---

## Agent Color Palette

| Agent Type | Color | Hex |
|------------|-------|-----|
| Clarity | Green | #059669 |
| Voice | Purple | #7c3aed |
| Jargon | Orange | #ea580c |
| Brevity | Blue | #0284c7 |
| Confidence | Teal | #0d9488 |
| Fun agents | Varies | Pick distinct colors |

---

## Validation Checklist

Before finalizing any agent ad:

- [ ] Would a real person type this sentence?
- [ ] Would THIS specific agent flag THIS specific phrase?
- [ ] Does the issue explain why (not just what)?
- [ ] Does the suggestion fit grammatically?
- [ ] Is the suggestion in-character for the agent?
- [ ] Does the CTA relate to the agent's value?

---

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Generic flags | "This could be better" | Specific: "Hedging weakens your point" |
| Wrong agent | Clarity agent flagging typos | Match agent specialty to issue |
| Broken grammar | Suggestion doesn't fit | Test full sentence |
| Too long | Exceeds character limits | Trim to essentials |
| No personality | Fun agent sounds boring | Stay in character |

---

## Example: Professional Agent

```javascript
{
  id: 'clarity-vague',
  agent: {
    name: 'Clarity Check',
    color: '#059669',
    icon: 'info'
  },
  editorText: 'Our Q3 results {{demonstrate a significant improvement}} over the previous quarter.',
  issue: '"Significant" is vague—you have the number. Lead with it.',
  suggestion: 'grew 23%',
  cta: {
    description: 'Agents watch while you write. They catch what you miss.',
    headline: 'Ada',
    buttonText: 'Download Free',
    note: 'macOS only'
  }
}
```

## Example: Fun Agent

```javascript
{
  id: 'pirate-meeting',
  agent: {
    name: 'Captain Blackquill',
    color: '#854d0e',
    icon: 'skull'
  },
  editorText: 'Please {{join us for}} the quarterly planning meeting on Friday.',
  issue: 'Arrr! This be soundin\' too landlubber-like!',
  suggestion: 'set sail with us fer',
  cta: {
    description: 'Write like a scallywag. Or don\'t. We won\'t judge.',
    headline: 'Ada',
    buttonText: 'Download Free',
    note: 'macOS only'
  }
}
```
