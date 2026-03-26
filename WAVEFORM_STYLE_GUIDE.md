# Ada Waveform Style Guide

This document defines the visual specifications for Ada's particle orbit waveform visualization across all contexts.

## Overview

The waveform is a particle-based orbit visualization that responds to voice input. Particles orbit a central point and detach when the user speaks, flying outward and fading. The visualization has two modes:

- **Speaking Mode**: Particles orbit at a fixed radius, spinning faster with voice intensity. Particles detach at the horizon and fly outward.
- **Thinking Mode**: Particles pulse between min/max radius in a breathing pattern. No detachment occurs.

## Responsive Sizing

The waveform uses percentage-based sizing relative to its container for responsive behavior.

| Breakpoint | Container Size | Actual Canvas | Use Case |
|------------|---------------|---------------|----------|
| Hero | 200px | 200×160px | Marketing hero sections |
| Desktop | 160px | 160×128px | Standard desktop component |
| Tablet | 140px | 140×112px | Tablet layouts |
| Mobile | 120px | 120×96px | Mobile interfaces |
| Compact | 100px | 100×80px | Toolbars, inline use |

### Sizing Rules

```
Canvas Width  = 100% of container
Canvas Height = 80% of container
```

For retina displays, multiply canvas dimensions by `devicePixelRatio` and scale context accordingly.

## Particle Configuration

| Property | Value | Description |
|----------|-------|-------------|
| `count` | 10 | Number of detachable particles |
| `permanent` | 3 | Particles that never detach (always orbit) |
| `size` | 1.5px | Base particle radius |
| `spread` | 0 | Radial variation from orbit path (0 = tight) |
| `grouping` | 0 | Angular clustering (0 = evenly distributed) |

**Total particles**: 13 (10 detachable + 3 permanent)

## Orbit Configuration

| Property | Value | Description |
|----------|-------|-------------|
| `speakRadius` | 0.35 | Orbit radius when speaking (35% of canvas) |
| `thinkMin` | 0.15 | Minimum pulse radius when thinking (15%) |
| `thinkMax` | 0.35 | Maximum pulse radius when thinking (35%) |
| `spinSpeed` | 0.03 | Base angular velocity (radians/frame) |
| `pulseSpeed` | 0.03 | Breathing animation speed in thinking mode |

### Mode Detection

```javascript
const isSpeaking = boostedLevel > 0.18;
```

- **Speaking**: `boostedLevel > 0.18` — orbit at fixed `speakRadius`
- **Thinking**: `boostedLevel <= 0.18` — pulse between `thinkMin` and `thinkMax`

## Detachment Configuration

| Property | Value | Description |
|----------|-------|-------------|
| `probability` | 0.4 | Chance of detaching at horizon (40%) |
| `flySpeed` | 0.4 | Base horizontal velocity when flying |
| `fadeRate` | 0.05 | Life decay per frame (1/20 = ~20 frames to fade) |

### Detachment Logic

Particles detach when ALL conditions are met:
1. Particle is not permanent
2. User is speaking (`isSpeaking = true`)
3. Particle is at the horizon (`|y - centerY| < threshold`)
4. Random check passes (`Math.random() < boostedLevel * probability`)

### Flying Particle Behavior

```javascript
// Direction based on which side of center
p.vx = (x < centerX ? -1 : 1) * (flySpeed + boostedLevel * flySpeed);
p.vy = (Math.random() - 0.5) * 0.2;  // slight vertical drift
p.vy *= 0.96;  // vertical damping
p.life -= fadeRate;  // fade out
```

## Color Palette

| Element | Hex | RGB | Usage |
|---------|-----|-----|-------|
| Orbit | `#b45309` | rgb(180, 83, 9) | Orbiting particles |
| Fly Left | `#dc6414` | rgb(220, 100, 20) | Particles flying left |
| Fly Right | `#fbbf24` | rgb(251, 191, 36) | Particles flying right |
| Background | transparent | rgba(255,255,255,0) | Canvas background |

### Opacity Rules

| State | Opacity |
|-------|---------|
| Orbiting (speaking) | 0.8 |
| Orbiting (thinking) | 0.5 |
| Flying | `life * 0.9` (fades with life) |
| Refilling | `fadeIn * 0.8` or `fadeIn * 0.5` |

## Animation Timing

| Animation | Speed | Notes |
|-----------|-------|-------|
| Spin (speaking) | `0.03 + boostedLevel * 0.02` | Faster with voice intensity |
| Spin (thinking) | `0.015` | Half speed, meditative |
| Thinking pulse | `0.03` | Smooth breathing rhythm |
| Refill lerp | `0.08` | Particle returns to orbit |
| Frame delta | `0.05` | Main animation time increment |

## Implementation Reference

### Particle State Machine

```
┌──────────┐     detach      ┌─────────┐     life <= 0    ┌───────────┐
│ orbiting │ ──────────────► │ flying  │ ───────────────► │ refilling │
└──────────┘                 └─────────┘                  └───────────┘
     ▲                                                          │
     └──────────────────────────────────────────────────────────┘
                         radius > 90% of target
```

### Audio Level Processing

```javascript
// Simulate or use real audio level (0-1 range)
const simulatedLevel = 0.5 + Math.sin(time * 4) * 0.3 + Math.sin(time * 7) * 0.15;

// Boost for visual impact
const boostedLevel = Math.pow(Math.max(0, audioLevel), 0.5) * 1.6;
```

### Canvas Setup (Retina Support)

```javascript
const dpr = window.devicePixelRatio || 1;
const containerSize = 120;  // varies by breakpoint
const width = containerSize * 1.0;   // 100%
const height = containerSize * 0.8;  // 80%

canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
ctx.scale(dpr, dpr);
```

## JSON Configuration

```json
{
  "widthPct": 100,
  "heightPct": 80,
  "containerSize": 120,
  "particles": {
    "count": 10,
    "permanent": 3,
    "size": 1.5,
    "spread": 0,
    "grouping": 0
  },
  "orbit": {
    "speakRadius": 0.35,
    "thinkMin": 0.15,
    "thinkMax": 0.35,
    "spinSpeed": 0.03,
    "pulseSpeed": 0.03
  },
  "detach": {
    "probability": 0.4,
    "flySpeed": 0.4,
    "fadeRate": 0.05
  },
  "colors": {
    "orbit": "#b45309",
    "flyLeft": "#dc6414",
    "flyRight": "#fbbf24",
    "bg": "#ffffff",
    "bgOpacity": 0
  }
}
```

## Files

| File | Purpose |
|------|---------|
| `waveform-config.json` | Machine-readable config for all breakpoints |
| `explorer.html` | Interactive tool for testing/tuning parameters |
| `WAVEFORM_STYLE_GUIDE.md` | This document |

---

*Last updated: February 2026*
