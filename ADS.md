# Ada Mobile Ad System

A schema-driven system for creating Instagram Story ads with animated voice editing demos.

## Overview

The ad system displays a phone mockup showing Ada's voice editing flow:
1. **Demo Screen**: Shows text being highlighted, voice waveform, transcription, suggestion, and acceptance
2. **CTA Screen**: Fades in with branding and download button

All content and timing is configurable via JSON schema.

## File Location

`/ads.html` - Main ad template and configuration

## JSON Schema

Each ad variant follows this schema:

```javascript
{
  id: 'unique-variant-id',

  // Optional tagline shown above editor on demo screen
  tagline: 'Edit with your voice',           // or null/undefined to hide

  // Editor content - use {{double braces}} to mark highlightable text
  editorText: 'The new policy will {{significantly impact}} our quarterly projections.',

  // Voice interaction settings
  mode: 'Socratic',                          // 'Socratic' or 'Didactic'
  transcription: '"Is this too vague?"',     // What the user "says"
  suggestion: 'boost by 15%',                // AI suggestion / replacement text

  // Timing (milliseconds) - aligned with TTS audio
  timing: {
    initialPause: 1000,                      // Pause before animation starts
    highlightDuration: 1200,                 // Mouse selection animation time
    voiceStart: 0,                           // TTS audio start timestamp
    voiceDuration: 2000,                     // How long waveform displays (speaking mode)
    voiceEnd: 2000,                          // TTS audio end timestamp
    transcriptionDuration: 1500,             // Show transcription frame
    thinkingDuration: 1800,                  // AI processing animation (thinking mode)
    suggestionDuration: 1500,                // Show suggestion frame
    acceptDelay: 400,                        // Button click animation
    appliedDuration: 2000,                   // Show "Edit applied" frame
    ctaDuration: 3000                        // Show CTA before loop
  },

  // CTA frame content
  cta: {
    description: 'Discuss your ideas, refine your prose, or dictate replacements with',
    headline: 'Ada',
    buttonText: 'Download Free',
    note: 'macOS only'
  }
}
```

## Schema Fields

### Root Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the variant |
| `tagline` | string | No | Text shown above editor (e.g., "Edit with your voice") |
| `editorText` | string | Yes | Sample text with `{{highlighted portion}}` in double braces |
| `mode` | string | Yes | Voice mode: `"Socratic"` or `"Didactic"` |
| `transcription` | string | Yes | What appears as user's spoken text (include quotes) |
| `suggestion` | string | Yes | The AI suggestion / replacement text |

### Timing Object

All values in milliseconds.

| Field | Description |
|-------|-------------|
| `initialPause` | Delay before animation begins |
| `highlightDuration` | How long the text highlight animation takes |
| `voiceStart` | Timestamp when TTS audio should start |
| `voiceDuration` | How long the waveform frame displays (speaking mode) |
| `voiceEnd` | Timestamp when TTS audio ends |
| `transcriptionDuration` | How long to show the "You said" frame |
| `thinkingDuration` | AI processing animation (thinking mode waveform) |
| `suggestionDuration` | How long to show the suggestion frame |
| `acceptDelay` | Delay after accept button "clicks" |
| `appliedDuration` | How long to show "Edit applied" frame |
| `ctaDuration` | How long to show CTA before looping |

### CTA Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `description` | string | No | Longer text above the headline |
| `headline` | string | Yes | Main branding text (e.g., "Ada") |
| `buttonText` | string | Yes | CTA button label |
| `note` | string | Yes | Small text below button (e.g., "macOS only") |

## Animation Flow

1. **Initial State**: Clean editor with optional tagline
2. **Highlight**: Text selection animates left-to-right (like mouse drag)
3. **Speaking**: Waveform animation in speaking mode (particles flying out) with mode label
4. **Transcription**: "You said" frame with spoken text
5. **Thinking**: Waveform animation in thinking mode (gentle pulsing orbit) with "Thinking..." label
6. **Suggestion**: AI suggestion with Accept/Reject buttons
7. **Accept**: Button clicks, highlight turns green
8. **Applied**: Checkmark with "Edit applied"
9. **CTA**: Cross-fade to branding screen
10. **Loop**: Fade back to demo, repeat

## Waveform Modes

The waveform animation has two distinct modes:

### Speaking Mode
- Particles actively fly outward from the orbit
- Faster spin speed
- Higher energy, more dynamic
- Used during voice input phase

### Thinking Mode
- Particles stay in gentle pulsing orbit
- Slower, contemplative animation
- No particles flying out
- Used during AI processing phase

The waveform controller supports:
```javascript
waveform.setSpeaking()  // Switch to speaking mode
waveform.setThinking()  // Switch to thinking mode
waveform.setMode('speaking' | 'thinking')  // Set mode directly
```

## TTS Integration

The `timing.voiceStart` and `timing.voiceEnd` fields are reserved for TTS audio synchronization:

```javascript
// In the animation loop, you can trigger TTS like this:
showFrame('speaking');
// audioPlayer.play(variant.ttsAudioUrl);  // Future: play TTS
// audioPlayer.currentTime = t.voiceStart; // Seek to start
await new Promise(r => setTimeout(r, t.voiceDuration));
// audioPlayer.pause(); // Stop at voiceEnd
```

## Adding New Variants

1. Add a new object to the `adVariants` array in `ads.html`
2. Give it a unique `id`
3. Set all required fields
4. Adjust timing to match your TTS audio length

## Cycling Through Variants

To automatically cycle through all variants, uncomment this line in the `runAd()` function:

```javascript
currentVariantIndex = (currentVariantIndex + 1) % adVariants.length;
```

To show a specific variant, set:

```javascript
currentVariantIndex = 0;  // First variant
currentVariantIndex = 1;  // Second variant
// etc.
```

## Instagram Story Safe Zones

The template respects Instagram's safe zones:
- **Top 14%**: Reserved for notch + Instagram UI overlay
- **Bottom 20%**: Reserved for CTA and swipe-up area
- **Content**: Centered in the safe middle zone

---

## Character Limits

Based on the phone frame (280×580px), safe zones, and font metrics, here are the constraints for each component:

### Quick Reference

| Component | Target | Max | Notes |
|-----------|--------|-----|-------|
| **Tagline** | 15-20 chars | 25 | Optional, uppercase |
| **Editor Text** | 80-100 chars | 130* | 4-5 lines max |
| **Highlight** | 15-25 chars | 40 | Complete semantic unit |
| **Transcription** | 20-35 chars | 50 | Include quotes |
| **Suggestion** | 10-20 chars | 30 | Must be ≤ highlight length |
| **CTA Description** | 40-50 chars | 60 | Above "Ada" headline |

*130 chars with tagline, 156 chars without tagline

### Spatial Budget

```
Phone Frame:        280px × 580px
Usable Height:      367px (after safe zones)
Usable Width:       224px (after padding)

Editor Text Width:  184px (~26 chars/line at 15.2px Literata)
Max Lines:          5-6 depending on tagline
```

### Validation Formula

```javascript
function validateAdCopy(variant) {
  const errors = [];
  const match = variant.editorText.match(/\{\{(.+?)\}\}/);
  const highlightText = match ? match[1] : '';
  const plainText = variant.editorText.replace(/\{\{|\}\}/g, '');

  if (plainText.length > 156) errors.push(`Editor: ${plainText.length}/156`);
  if (variant.tagline && plainText.length > 130) errors.push(`Editor+tagline: ${plainText.length}/130`);
  if (highlightText.length > 40) errors.push(`Highlight: ${highlightText.length}/40`);
  if (highlightText.length < 3) errors.push(`Highlight too short: ${highlightText.length}`);
  if (variant.transcription.length > 50) errors.push(`Transcription: ${variant.transcription.length}/50`);
  if (variant.suggestion.length > 30) errors.push(`Suggestion: ${variant.suggestion.length}/30`);
  if (variant.suggestion.length > highlightText.length + 10) errors.push(`Suggestion > highlight`);

  return errors;
}
```

See `AD_CHARACTER_LIMITS.md` for full spatial analysis and formulas.

---

## Copy Rules

The ad must show a **realistic editing moment**. Everything must be internally consistent.

### Core Principle

```
editorText → highlight → transcription → suggestion
     ↓            ↓            ↓              ↓
  Context    Target      User's doubt    Resolution
```

### Rule 1: Editor Text

Must be something the **user plausibly wrote themselves**:
- Business writing, emails, reports, drafts
- Text with a weakness the user might recognize
- NOT random placeholder text or AI-generated content

The `{{highlight}}` must be:
- A complete, selectable unit (not partial phrases)
- Something that can be directly replaced
- Self-contained grammatically

**Bad:** `The deadline is {{next}} Tuesday` (partial)
**Good:** `The deadline is {{next Tuesday}}` (complete unit)

### Rule 2: Socratic Mode Questions

User asks **about their own writing** (not external knowledge):

| Valid | Invalid |
|-------|---------|
| "Too formal?" | "What's the date?" |
| "Is this vague?" | "How much did sales increase?" |
| "Is 'love' too strong?" | "What should I say here?" |

**Key insight:** User knows what they want to express. They're questioning *how* they expressed it.

### Rule 3: Suggestions

Must be a **direct replacement** for the highlighted text:
1. Fits grammatically in place of highlight
2. Addresses the user's specific question
3. Could have been written by the user
4. Cannot introduce new factual information
5. Similar length or shorter than highlight

**Invalid:**
```javascript
editorText: 'Sales increased {{significantly}}'
transcription: '"How much?"'
suggestion: 'by 34%'  // ❌ Ada doesn't know your data
```

**Valid:**
```javascript
editorText: 'Sales increased {{significantly}}'
transcription: '"Too vague?"'
suggestion: 'noticeably'  // ✓ Style change, no new data
```

### Rule 4: Didactic Mode

User **speaks the replacement directly**. No AI analysis needed:

```javascript
editorText: 'The deadline is {{next Tuesday}}'
mode: 'Didactic'
transcription: '"January 14th"'
suggestion: 'January 14th'  // Identical or near-identical
```

Use shorter `thinkingDuration` (600-1000ms) vs Socratic (1400-1800ms).

### Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Magic Data | Ada provides facts it can't know | User states the info, or style change only |
| Broken Grammar | Suggestion doesn't fit | Test: `before + suggestion + after` |
| Unrealistic Highlights | Single letters, partial words | Highlight complete semantic units |
| Open-Ended Questions | "What should I say?" | Specific: "Is this too formal?" |

### Consistency Checklist

Before finalizing any ad:
- [ ] Would a real person have written this sentence?
- [ ] Would they highlight this specific phrase?
- [ ] Would they ask this question about it?
- [ ] Does suggestion directly answer the question?
- [ ] Does suggestion fit grammatically?
- [ ] Could the user have written the suggestion themselves?

See `AD_COPY_RULES.md` for full rules and templates.

---

## Example Variants

### Socratic Mode - Vague Text
```javascript
{
  id: 'socratic-vague',
  tagline: 'Edit with your voice',
  editorText: 'The new policy will {{significantly impact}} our quarterly projections.',
  mode: 'Socratic',
  transcription: '"Is this too vague?"',
  suggestion: 'boost by 15%',
  timing: {
    initialPause: 1000,
    highlightDuration: 1200,
    voiceStart: 0,
    voiceDuration: 2000,
    voiceEnd: 2000,
    transcriptionDuration: 1500,
    thinkingDuration: 1800,      // Longer thinking for Socratic analysis
    suggestionDuration: 1500,
    acceptDelay: 400,
    appliedDuration: 2000,
    ctaDuration: 3000
  },
  cta: {
    description: 'Discuss your ideas, refine your prose, or dictate replacements with',
    headline: 'Ada',
    buttonText: 'Download Free',
    note: 'macOS only'
  }
}
```

### Socratic Mode - Formal Text
```javascript
{
  id: 'socratic-formal',
  tagline: 'Your voice, amplified',
  editorText: 'We are {{pleased to inform you}} that your application has been received.',
  mode: 'Socratic',
  transcription: '"Too formal?"',
  suggestion: 'happy to share',
  timing: {
    // ... similar timing with thinkingDuration: 1600
  },
  cta: { /* ... */ }
}
```

### Didactic Mode - Direct Replacement
```javascript
{
  id: 'didactic-replace',
  tagline: 'Speak your edits',
  editorText: 'The project deadline is {{next month}} and we need to prepare.',
  mode: 'Didactic',
  transcription: '"March 15th"',
  suggestion: 'March 15th',
  timing: {
    // ... similar timing with thinkingDuration: 1000 (shorter for direct replacement)
  },
  cta: { /* ... */ }
}
```

**Note**: Didactic mode typically uses shorter `thinkingDuration` since it's a direct replacement rather than AI analysis.

## Customization

### Styling
All styles are in the `<style>` block of `ads.html`. Key classes:
- `.ad-tagline` - Demo screen tagline
- `.ad-editor` - White editor card
- `.ad-frames` - Voice interaction container
- `.ad-cta-frame` - End screen overlay

### Phone Frame
The mockup uses a 280x580px frame with Dynamic Island notch. Adjust in `.phone-frame` CSS.
