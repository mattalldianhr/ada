# Ada Ad Character Limits

Calculating the maximum characters for each component based on the template layout.

---

## Phone Frame Dimensions

```
Phone Frame:     280px × 580px
Frame Padding:   12px (each side)
Screen Size:     256px × 556px
```

## Safe Zones (Instagram Story)

```
Top Safe:        78px  (14% - notch + IG overlay)
Bottom Safe:     111px (20% - CTA swipe area)
Side Padding:    16px  (each side)

Usable Height:   556 - 78 - 111 = 367px
Usable Width:    256 - 32 = 224px
```

---

## Vertical Space Budget

```
Total Usable:                367px
├── Tagline (optional):       32px (text + margin)
├── Editor Card:             ???px (variable)
│   ├── Padding:              32px (16px top + bottom)
│   ├── Editor Text:         ???px (variable, depends on lines)
│   ├── Frames Margin:        16px (when visible)
│   └── Frames Container:    140px (when expanded)
│       ├── Waveform:         60px
│       ├── Labels/spacing:   20px
│       ├── Transcription:    24px
│       └── Buttons/padding:  36px
└── Buffer:                   ~20px
```

### Without Tagline
```
Available for Editor Text = 367 - 32 (padding) - 16 (margin) - 140 (frames) - 20 (buffer)
                          = 159px for text
```

### With Tagline
```
Available for Editor Text = 367 - 32 (tagline) - 32 (padding) - 16 (margin) - 140 (frames) - 20 (buffer)
                          = 127px for text
```

---

## Text Metrics

### Editor Text
```
Font:            Literata, 0.95rem (~15.2px)
Line Height:     1.7 (~25.8px per line)
Text Width:      224px - 8px (editor margin) - 32px (editor padding) = 184px
```

**Characters per line** (serif font, ~7px average char width):
```
184px ÷ 7px ≈ 26 characters per line
```

**Lines available:**
```
Without tagline: 159px ÷ 25.8px ≈ 6 lines
With tagline:    127px ÷ 25.8px ≈ 4-5 lines
```

### Editor Text Limits

| Scenario | Lines | Chars/Line | Total Chars |
|----------|-------|------------|-------------|
| No tagline | 6 | 26 | **~156 chars** |
| With tagline | 5 | 26 | **~130 chars** |
| Safe max | 4 | 26 | **~104 chars** |

---

## Transcription Text

```
Font:            Literata, 0.9rem (~14.4px), italic
Container:       184px width (same as editor)
Max Lines:       1-2 (should be short, spoken phrase)
```

**Limit:** ~50-55 characters (including quotes)

Natural speech is short. If it's longer than ~8 words, it feels unrealistic.

---

## Suggestion Text

```
Font:            Literata, 0.9rem (~14.4px)
Container:       184px width
Max Lines:       1 (should be shorter than highlight)
```

**Limit:** ~25-30 characters

The suggestion replaces the highlight, so it should be ≤ highlight length.

---

## Component Character Limits Summary

| Component | Max Characters | Notes |
|-----------|---------------|-------|
| **Tagline** | 25 chars | Optional, uppercase, short |
| **Editor Text** | 100-130 chars | 4-5 lines, leave room for frames |
| **Highlight** | 20-40 chars | Must be selectable unit |
| **Transcription** | 50 chars | Short spoken phrase with quotes |
| **Suggestion** | 30 chars | ≤ highlight length |
| **CTA Description** | 60 chars | Above "Ada" headline |

---

## The Formula

Total content must satisfy:

```
Editor_Lines = ceil(Editor_Chars / 26)
Editor_Height = Editor_Lines × 25.8px

Constraint:
Editor_Height + Frames_Height(140) + Padding(48) + Tagline?(32) ≤ 367px

Solving for Editor_Chars (no tagline):
Editor_Height ≤ 367 - 140 - 48 = 179px
Editor_Lines ≤ 179 / 25.8 ≈ 6.9 → 6 lines
Editor_Chars ≤ 6 × 26 = 156 chars

Solving for Editor_Chars (with tagline):
Editor_Height ≤ 367 - 140 - 48 - 32 = 147px
Editor_Lines ≤ 147 / 25.8 ≈ 5.7 → 5 lines
Editor_Chars ≤ 5 × 26 = 130 chars
```

---

## Practical Recommendations

### Editor Text
- **Target:** 80-100 characters (3-4 lines)
- **Max:** 130 characters (5 lines, with tagline)
- **Never exceed:** 156 characters

### Highlight Portion
- **Target:** 15-25 characters (2-4 words)
- **Max:** 40 characters
- **Min:** 5 characters (avoid single words when possible)

### Transcription
- **Target:** 20-35 characters
- **Max:** 50 characters
- **Format:** `"Quoted speech"` (include quotes)

### Suggestion
- **Target:** 10-20 characters
- **Max:** 30 characters
- **Rule:** Should be ≤ highlight length (it's a replacement)

---

## Validation Formula (JavaScript)

```javascript
function validateAdCopy(variant) {
  const errors = [];

  // Extract highlight from editorText
  const match = variant.editorText.match(/\{\{(.+?)\}\}/);
  const highlightText = match ? match[1] : '';
  const plainText = variant.editorText.replace(/\{\{|\}\}/g, '');

  // Check limits
  if (plainText.length > 156) {
    errors.push(`Editor text too long: ${plainText.length}/156 chars`);
  }

  if (variant.tagline && plainText.length > 130) {
    errors.push(`Editor text too long with tagline: ${plainText.length}/130 chars`);
  }

  if (highlightText.length > 40) {
    errors.push(`Highlight too long: ${highlightText.length}/40 chars`);
  }

  if (highlightText.length < 3) {
    errors.push(`Highlight too short: ${highlightText.length} chars`);
  }

  if (variant.transcription.length > 50) {
    errors.push(`Transcription too long: ${variant.transcription.length}/50 chars`);
  }

  if (variant.suggestion.length > 30) {
    errors.push(`Suggestion too long: ${variant.suggestion.length}/30 chars`);
  }

  if (variant.suggestion.length > highlightText.length + 10) {
    errors.push(`Suggestion longer than highlight by ${variant.suggestion.length - highlightText.length} chars`);
  }

  if (variant.cta?.description && variant.cta.description.length > 60) {
    errors.push(`CTA description too long: ${variant.cta.description.length}/60 chars`);
  }

  return errors;
}
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│            CHARACTER LIMITS             │
├─────────────────────────────────────────┤
│  Tagline:        25 chars (optional)    │
│  Editor Text:    100-130 chars (target) │
│  Highlight:      15-40 chars            │
│  Transcription:  20-50 chars            │
│  Suggestion:     10-30 chars            │
│  CTA Desc:       40-60 chars            │
├─────────────────────────────────────────┤
│  TOTAL SAFE:     ~250 chars combined    │
└─────────────────────────────────────────┘
```

---

## Example: Validated Copy

```javascript
{
  // Tagline: 17 chars ✓
  tagline: 'Edit with your voice',

  // Editor: 73 chars ✓ (well under 130)
  editorText: 'I hope this email {{finds you well}} and that you are having a good week.',

  // Highlight: 14 chars ✓
  // (extracted: "finds you well")

  // Transcription: 28 chars ✓
  transcription: '"Ugh, everyone hates this"',

  // Suggestion: 10 chars ✓ (shorter than highlight)
  suggestion: 'Hi Sarah,',

  // CTA Desc: 24 chars ✓
  cta: {
    description: 'Kill your clichés with',
    headline: 'Ada',
    buttonText: 'Download Free',
    note: 'macOS only'
  }
}
```
