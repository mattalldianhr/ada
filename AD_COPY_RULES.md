# Ada Ad Copy Rules

Rules for generating valid ad content that accurately represents how Ada works.

---

## Core Principle

**The ad must show a realistic editing moment.** The user has written something, they have a doubt or want to change it, and Ada helps. Everything must be internally consistent.

---

## Rule 1: The Editor Text (Initial Sentence)

The sentence must be something **the user plausibly wrote themselves**.

### Valid Examples
- Business writing: emails, reports, proposals
- Creative writing: drafts, pitches, copy
- Common phrases people actually type
- Text that contains a weakness the user might recognize

### Invalid Examples
- Random placeholder text
- Text that requires external knowledge to fix
- Text that's obviously AI-generated
- Text with errors the user wouldn't have made

### The Highlight
The `{{highlighted}}` portion must be:
- A word or phrase the user would plausibly select
- Something that can be directly replaced
- Self-contained (not breaking grammar if swapped)

**Bad:** `The deadline is {{next}} Tuesday` (partial phrase)
**Good:** `The deadline is {{next Tuesday}}` (complete unit)

---

## Rule 2: Socratic Mode - The User's Question

In Socratic mode, the user **asks about their own writing**. They are questioning their word choice, tone, clarity, or style.

### Valid Question Types

| Type | Example | Why It Works |
|------|---------|--------------|
| Tone | "Too formal?" | User questions register |
| Clarity | "Is this vague?" | User questions specificity |
| Word choice | "Is 'love' too strong?" | User questions word |
| Directness | "Too wordy?" | User questions length |
| Self-critique | "Ugh, everyone hates this" | User recognizes cliché |
| Appropriateness | "Too casual for the board?" | User questions fit |

### Invalid Question Types

| Type | Example | Why It Fails |
|------|---------|--------------|
| Factual request | "What's the date?" | User doesn't know the answer |
| External data | "How much did sales increase?" | Requires info user doesn't have |
| Research | "What's a better word?" | Too open-ended |
| Commands | "Make it shorter" | Not a question/doubt |

### Key Insight
The user **already knows what they want to express**. They're questioning **how** they expressed it, not **what** to say.

---

## Rule 3: Socratic Mode - Ada's Suggestion

Ada's suggestion must be a **direct replacement** for the highlighted text.

### Rules
1. Must grammatically fit in place of the highlight
2. Must address the user's specific question
3. Must be something the user could have written themselves
4. Cannot introduce new factual information
5. Should be roughly similar length or shorter

### Valid Pattern
```
Text: "We are {{pleased to inform you}} that..."
Question: "Too formal?"
Suggestion: "happy to share" ✓ (fits grammatically, addresses tone)
```

### Invalid Pattern
```
Text: "Sales increased {{significantly}}"
Question: "How much?"
Suggestion: "by 34%" ✗ (introduces data user doesn't have)
```

**Fix:** The user must already know the data:
```
Text: "Sales increased {{significantly}}"
Question: "I should just say the number"
Suggestion: "by 34%" ✓ (user knows the number, is choosing to add it)
```

Or reframe as style:
```
Text: "Sales increased {{significantly}}"
Question: "Too vague?"
Suggestion: "substantially" ✓ (style change, not data)
```

---

## Rule 4: Didactic Mode - Direct Replacement

In Didactic mode, the user **speaks the replacement directly**. No AI analysis needed.

### Valid Pattern
```
Text: "The deadline is {{next Tuesday}}"
Transcription: "January 14th"
Suggestion: "January 14th"
```

The transcription and suggestion are identical or near-identical (Ada cleans up filler words).

### Rules
1. User speaks exactly what they want
2. Ada transcribes and cleans up
3. Suggestion = cleaned transcription
4. Shorter thinking duration (no analysis)
5. User already knows the replacement

### Use Cases
- Dates, names, numbers (user knows the value)
- Direct corrections (user knows what's wrong)
- Filling in placeholders (user has the info)

---

## Rule 5: Internal Consistency

All four elements must relate directly:

```
editorText → highlight → transcription → suggestion
     ↓            ↓            ↓              ↓
  Context    Target      User's doubt    Resolution
```

### Consistency Checklist
- [ ] Would a real person have written this sentence?
- [ ] Would they highlight this specific phrase?
- [ ] Would they ask this specific question about it?
- [ ] Does the suggestion directly answer the question?
- [ ] Does the suggestion fit grammatically?
- [ ] Could the user have written the suggestion themselves?

---

## Rule 6: The CTA Description

The CTA description should relate to the specific ad's theme.

### Pattern
`[Verb] your [noun] with` → `Ada`

### Examples by Theme
| Ad Theme | CTA Description |
|----------|-----------------|
| Cliché removal | "Kill your clichés with" |
| Tone adjustment | "Find the right tone with" |
| Directness | "Say what you mean with" |
| Speed (Didactic) | "Speak your edits with" |
| Self-doubt | "Ask your doubts out loud with" |

---

## Rule 7: Timing Relationships

Timing should reflect the cognitive load of the interaction.

### Socratic Mode
- Longer `thinkingDuration` (1400-1800ms) - AI is analyzing
- Question is more complex
- Suggestion requires inference

### Didactic Mode
- Shorter `thinkingDuration` (600-1000ms) - Just transcription cleanup
- Direct replacement
- No analysis needed

### General
- `highlightDuration` proportional to highlight length
- `transcriptionDuration` proportional to transcription length
- `voiceDuration` should feel like natural speech

---

## Anti-Patterns to Avoid

### 1. Magic Data
**Bad:** User asks "How much?" and Ada provides "34%"
**Why:** Ada doesn't know your data. User does.
**Fix:** User states they want to add specificity they already know.

### 2. Broken Grammar
**Bad:** Suggestion doesn't fit grammatically in the sentence
**Why:** Breaks immersion, looks buggy
**Fix:** Always test: `before + suggestion + after` must read correctly

### 3. Unrealistic Highlights
**Bad:** Highlighting a single letter or partial word
**Why:** No one edits this way
**Fix:** Highlight complete semantic units

### 4. Questions Ada Can't Answer
**Bad:** "What should I say here?"
**Why:** Too open-ended, requires mind-reading
**Fix:** Specific doubts: "Is this too [adjective]?"

### 5. Suggestions That Add Information
**Bad:** Highlight "the project" → Suggestion "the Q3 marketing initiative"
**Why:** Ada doesn't know your project name
**Fix:** Style changes only, or user provides the info in Didactic mode

---

## Valid Ad Templates

### Template A: Cliché Recognition
```javascript
{
  editorText: '[Common phrase everyone writes] {{cliché}}.',
  mode: 'Socratic',
  transcription: '"[Self-aware cringe]"',
  suggestion: '[Simpler/direct version]',
  cta: { description: 'Kill your clichés with' }
}
```

### Template B: Tone Adjustment
```javascript
{
  editorText: '[Sentence with clear tone] {{phrase with tone}}...',
  mode: 'Socratic',
  transcription: '"Too [formal/casual/eager/cold]?"',
  suggestion: '[Same meaning, different tone]',
  cta: { description: 'Find the right tone with' }
}
```

### Template C: Hedge Removal
```javascript
{
  editorText: '[Sentence with hedging] {{hedge words}} [rest].',
  mode: 'Socratic',
  transcription: '"Be direct"',
  suggestion: '[Without hedges]',
  cta: { description: 'Say what you mean with' }
}
```

### Template D: Direct Replacement (Didactic)
```javascript
{
  editorText: '[Sentence with placeholder/vague term] {{vague term}}.',
  mode: 'Didactic',
  transcription: '"[Exact replacement]"',
  suggestion: '[Same as transcription]',
  cta: { description: 'Speak your edits with' }
}
```

### Template E: Word Choice Doubt
```javascript
{
  editorText: '[Sentence] {{word user is unsure about}} [rest].',
  mode: 'Socratic',
  transcription: '"Is \'[word]\' [too strong/weak/wrong]?"',
  suggestion: '[Better word]',
  cta: { description: 'Ask your doubts out loud with' }
}
```

---

## Validation Checklist

Before finalizing any ad copy:

1. **Read the full sentence aloud.** Does it sound like something someone would write?
2. **Check the highlight.** Is it a complete, selectable unit?
3. **Check the question.** Is it about the writing itself, not external knowledge?
4. **Check the suggestion.** Does it fit grammatically? Does it address the question?
5. **Check the diff.** Read: `before + suggestion + after`. Does it work?
6. **Check the mode.** Socratic = doubt/question. Didactic = direct replacement.
7. **Check the timing.** Does thinking duration match cognitive load?

---

## Examples: Before & After Rules

### Example 1: Magic Data (FIXED)

**Before (Invalid):**
```javascript
editorText: 'Sales increased {{significantly}} last quarter.',
transcription: '"How much?"',
suggestion: 'by 34%'  // ❌ Where did 34% come from?
```

**After (Valid):**
```javascript
editorText: 'Sales increased {{significantly}} last quarter.',
transcription: '"I should just say thirty-four percent"',
suggestion: 'by 34%'  // ✓ User stated the number
```

Or:
```javascript
editorText: 'Sales increased {{significantly}} last quarter.',
transcription: '"Too vague?"',
suggestion: 'noticeably'  // ✓ Style change, no new data
```

### Example 2: Broken Grammar (FIXED)

**Before (Invalid):**
```javascript
editorText: 'I {{think we might need to perhaps}} reconsider.',
suggestion: 'We need to'  // ❌ "I We need to reconsider" is broken
```

**After (Valid):**
```javascript
editorText: '{{I think we might need to perhaps}} reconsider.',
suggestion: 'We should'  // ✓ "We should reconsider" works
```

Or:
```javascript
editorText: 'I think we {{might need to perhaps}} reconsider.',
suggestion: 'should'  // ✓ "I think we should reconsider" works
```

### Example 3: Unrealistic Question (FIXED)

**Before (Invalid):**
```javascript
editorText: 'The meeting is {{scheduled for}} next week.',
transcription: '"When exactly?"',  // ❌ Ada doesn't know your calendar
suggestion: 'on Tuesday at 3pm'
```

**After (Valid - Didactic):**
```javascript
editorText: 'The meeting is {{scheduled for}} next week.',
mode: 'Didactic',
transcription: '"Tuesday at 3pm"',  // ✓ User provides the info
suggestion: 'Tuesday at 3pm'
```
