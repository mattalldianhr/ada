# Ada - Product Overview

> **Edit with your voice.**

Ada is a voice-driven content editor for macOS with built-in AI agents that watch as you write. Designed for writers who think out loud, Ada transforms spoken input into refined written edits through natural conversation.

## Core Value Proposition

- **Voice-First Editing**: Speak your edits instead of typing them
- **Conversational Refinement**: Discuss ideas with AI, don't just command it
- **Privacy-Conscious**: Local speech recognition, minimal cloud data
- **AI Writing Agents**: Background monitors that catch issues as you write

---

## Two Editing Modes

### Socratic Mode (Cmd+Shift+S)
Conversational editing through discussion. Highlight text, ask a question, and Ada suggests improvements based on the dialogue.

**Workflow:**
1. Highlight text
2. Press Cmd+Shift+S and speak (e.g., "Is this too formal?")
3. Ada shows transcription: "You said..."
4. AI thinking phase (analyzes context)
5. Suggestion appears with Accept/Reject options
6. Accept applies the edit inline

**Example:**
- Original: "We are pleased to inform you"
- Question: "Too formal?"
- Suggestion: "happy to share"

### Didactic Mode (Cmd+Shift+D)
Direct replacement through dictation. Highlight text, speak the replacement, and Ada transcribes and cleans it up.

**Workflow:**
1. Highlight text
2. Press Cmd+Shift+D and speak the replacement
3. Ada transcribes and removes filler words
4. Shows diff preview
5. Accept applies the replacement

**Example:**
- Original: "next month"
- Speak: "March 15th"
- Result: Direct replacement with cleaned transcription

---

## Built-In Agents

"A second set of eyes. Always."

Agents monitor your writing in the background and surface suggestions in the margin. You can accept, dismiss, or discuss any suggestion.

### Clarity Check Agent
Flags vague language and unclear statements. Suggests concrete alternatives with data.

### Voice Consistency Agent
Monitors for tone/style drift against your Voice Guide. Catches passive voice, jargon, and style violations.

### Argument Flow Agent
Detects weak transitions, unsupported claims, and missing context.

**Agent Customization:**
- Write rules in plain English
- "Flag jargon", "Question unsupported claims", "Watch for hedging"
- Toggle agents on/off (Cmd+Shift+A)

---

## Privacy Architecture

```
Your Voice → Raw Audio → Whisper (Local Mac) → Text Only → Claude API
                              ↓                              ↓
                    Never leaves device           Only highlighted text sent
```

- **Local Transcription**: Whisper runs entirely on your Mac
- **Cloud Intelligence**: Only highlighted text sent to Claude API
- **No Audio Transmission**: Raw audio never leaves your machine
- **Drafts Stay Local**: Full documents never sent to servers

---

## Voice Guide

Point Ada to a markdown style guide and it learns your tone—direct, warm, technical, or custom. The Voice Consistency Agent then enforces your personal writing style across all edits.

---

## Technical Details

### Platform
- **macOS 11+** (Sonoma or later)
- Apple Silicon (native) and Intel builds available

### Current Version
- **v0.1.6** (Beta)
- Free during beta

### Technology Stack
- **Desktop**: Electron
- **Speech Recognition**: OpenAI Whisper (local)
- **AI**: Claude API (Anthropic)
- **Supported Models**: Claude Opus 4.5 (recommended), Sonnet 4, Haiku 3.5

### Download
- [Apple Silicon (.dmg)](https://github.com/mattalldianhr/ada/releases/download/v0.1.6/Ada-0.1.6-arm64.dmg)
- [Intel (.dmg)](https://github.com/mattalldianhr/ada/releases/download/v0.1.6/Ada-0.1.6.dmg)

---

## Pricing (Coming Soon)

| Plan | Price | Details |
|------|-------|---------|
| **BYOK** | Free | Bring your own Anthropic API key, pay-as-you-go |
| **Starter** | $5/mo | Included credits, daily limits |
| **Pro** | $19/mo | Higher limits, priority throughput |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+Shift+S | Socratic Mode |
| Cmd+Shift+D | Didactic Mode |
| Cmd+Return | Accept suggestion |
| Esc | Reject suggestion |
| Cmd+Shift+A | Toggle agents |
| Cmd+S | Save |
| Cmd+O | Open file |
| Cmd+, | Settings |

---

## Brand Identity

### Colors
- **Background**: #FDFCFA (warm off-white, paper-like)
- **Accent**: #B45309 (warm amber)
- **Text**: #2D2D2D (primary), #78716C (muted)
- **Success**: #059669 (green)

### Typography
- **UI**: Inter (sans-serif)
- **Content**: Literata (serif, variable weight)
- **Logo**: "Ada" in Literata, 600 weight, italic

### Voice & Tone
- Direct but warm
- Intelligent but unpretentious
- Short, punchy sentences
- Active voice, no jargon
- "Like talking to a smart friend over coffee"

---

## Target Audience

- Professional writers and journalists
- Content creators and bloggers
- Business writers and marketers
- Academic writers and researchers
- Anyone who thinks out loud while writing

---

## Key Differentiators

1. **Voice-first, not voice-added**: Built around speech from the ground up
2. **Conversation, not commands**: Discuss edits rather than dictate them
3. **Privacy by design**: Local transcription, minimal cloud footprint
4. **Agent intelligence**: Background monitors that learn your style
5. **Writer-centric**: Built by writers, for writers who think out loud
