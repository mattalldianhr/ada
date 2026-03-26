#!/usr/bin/env node
// Generate TTS audio for all ad variants using OpenAI gpt-4o-mini-tts
// Usage: OPENAI_API_KEY=sk-... node generate-voices.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) { console.error('Set OPENAI_API_KEY'); process.exit(1); }

const VOICES = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer', 'verse'];
const OUT_DIR = path.join(__dirname, 'ad-audio');

function pickVoice(seed) {
  return VOICES[seed % VOICES.length];
}

function generateTTS(text, voice, instructions, outPath) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'gpt-4o-mini-tts',
      input: text,
      voice: voice,
      instructions: instructions,
      response_format: 'mp3'
    });

    const req = https.request({
      hostname: 'api.openai.com',
      path: '/v1/audio/speech',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        let err = '';
        res.on('data', d => err += d);
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${err}`)));
        return;
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        fs.writeFileSync(outPath, buf);
        resolve(buf.length);
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// =====================================================
// SOCRATIC AD VARIANTS (transcription lines)
// =====================================================
const socraticAds = [
  // Famous Edits
  { id: 'famous-jfk-ask-not', text: 'Should I flip this around?', mood: 'curious, thoughtful, like pondering a structural change' },
  { id: 'famous-mlk-dream', text: "Is 'idea' too weak?", mood: 'questioning, searching for the right word' },
  { id: 'famous-declaration', text: 'Too religious?', mood: 'brief, direct, slightly concerned about tone' },
  { id: 'famous-apple', text: 'Too proper?', mood: 'quick, casual observation' },
  { id: 'famous-gettysburg', text: 'Too plain?', mood: 'short, looking for more impact' },
  { id: 'famous-hemingway', text: 'Too much explaining?', mood: 'noticing over-explanation, wanting brevity' },
  // Small Changes
  { id: 'confuse-affect', text: 'Wait, affect or effect?', mood: 'genuinely confused, thinking out loud, slightly anxious' },
  { id: 'confuse-complement', text: 'Is that the right one?', mood: 'uncertain, double-checking' },
  { id: 'confuse-discrete', text: 'Discrete or discreet?', mood: 'puzzled, asking for help distinguishing' },
  { id: 'confuse-principal', text: 'Wait, which spelling?', mood: 'confused, pausing mid-writing' },
  { id: 'confuse-stationary', text: 'Is that the paper one?', mood: 'casual question, slightly amused' },
  { id: 'confuse-whos', text: "Who's or whose?", mood: 'quick question, common confusion' },
  // Killing Office Speak
  { id: 'jargon-synergy', text: 'Does anyone know what this means?', mood: 'exasperated, slightly amused at corporate jargon' },
  { id: 'jargon-circle-back', text: 'Too corporate?', mood: 'quick realization' },
  { id: 'jargon-going-forward', text: 'Do I need this?', mood: 'questioning if a phrase adds anything' },
  { id: 'jargon-end-of-day', text: 'Ugh, everyone says this', mood: 'mild disgust at cliché, casual' },
  { id: 'jargon-per-my-last', text: 'Too passive-aggressive?', mood: 'self-aware, slightly worried' },
  { id: 'jargon-low-hanging', text: 'Too buzzwordy?', mood: 'noticing corporate speak in own writing' },
  // Thinking Partners
  { id: 'reframe-passive', text: 'Am I hiding who did it?', mood: 'self-reflective, realizing passive voice is evasive' },
  { id: 'reframe-hedging', text: 'Am I just hedging?', mood: 'honest self-examination' },
  { id: 'reframe-burying', text: 'Should I lead with this?', mood: 'questioning document structure' },
  { id: 'reframe-over-apologizing', text: 'Why am I apologizing?', mood: 'sudden realization, slightly frustrated with self' },
  { id: 'reframe-vague', text: 'Am I being too vague?', mood: 'self-critical, wanting clarity' },
  { id: 'reframe-softening', text: 'Should I just say it?', mood: 'building courage to be direct' },
  // Generational Code-Switching
  { id: 'gen-millennial', text: 'Too millennial for the CEO?', mood: 'worried about audience mismatch' },
  { id: 'gen-boomer', text: 'Does this sound like a boomer?', mood: 'cringing slightly, self-aware' },
  { id: 'gen-professional', text: 'This is just for Slack', mood: 'realizing tone doesn\'t match channel' },
  { id: 'gen-slack', text: 'This is for the board memo', mood: 'sudden awareness of audience' },
  { id: 'gen-internet', text: 'Too casual for investors?', mood: 'second-guessing register' },
  { id: 'gen-formal', text: 'How do I explain this to mom?', mood: 'trying to simplify, slightly amused' },
  // Apology Spectrum
  { id: 'apology-over', text: 'Am I over-apologizing?', mood: 'self-aware about excessive apologizing' },
  { id: 'apology-under', text: 'Should I apologize here?', mood: 'genuine question about social norms' },
  { id: 'apology-thanks', text: 'Gratitude not guilt?', mood: 'reframing, lightbulb moment' },
  { id: 'apology-performative', text: 'Do I need to apologize?', mood: 'questioning unnecessary apology' },
  { id: 'apology-calibrating', text: 'Too dramatic for a typo?', mood: 'amused at own overreaction' },
  { id: 'apology-sincerity', text: 'This sounds robotic', mood: 'dissatisfied with corporate tone' },
  // Confidence Edit
  { id: 'confidence-hedge', text: 'Too much hedging?', mood: 'recognizing weak language' },
  { id: 'confidence-just', text: 'Why am I shrinking myself?', mood: 'frustrated self-awareness' },
  { id: 'confidence-belief', text: "Why 'believe'? I know it.", mood: 'empowered realization' },
  { id: 'confidence-permission', text: "I don't need permission", mood: 'confident, assertive' },
  { id: 'confidence-weak', text: "The data doesn't 'seem'", mood: 'correcting wishy-washy language, firm' },
  { id: 'confidence-doubt', text: 'Not a dumb question', mood: 'self-affirming, rejecting self-deprecation' },
  // Finding Your Voice
  { id: 'voice-passive', text: 'Who decided? I did.', mood: 'claiming ownership, empowered' },
  { id: 'voice-native', text: 'More natural in English?', mood: 'seeking fluency, thoughtful' },
  { id: 'voice-introvert', text: 'I earned this', mood: 'quiet confidence, claiming credit' },
  { id: 'voice-deferential', text: 'I deserve a review', mood: 'assertive, standing up for self' },
  { id: 'voice-credit', text: 'I designed most of it', mood: 'claiming credit, matter-of-fact' },
  { id: 'voice-conditional', text: 'Why so conditional?', mood: 'questioning own hedging' },
  // Brevity Challenge
  { id: 'brevity-email', text: 'Way too long', mood: 'impatient with wordiness' },
  { id: 'brevity-schedule', text: 'Just ask directly', mood: 'cutting through padding' },
  { id: 'brevity-status', text: 'Half of this is filler', mood: 'critical, wanting conciseness' },
  { id: 'brevity-thanks', text: 'Too wordy for a thanks', mood: 'noticing overthinking a simple message' },
  { id: 'brevity-follow', text: 'Can I just say checking in?', mood: 'looking for simpler phrasing' },
  { id: 'brevity-request', text: 'So much padding', mood: 'exasperated at unnecessary words' },
  // Tone Ladder
  { id: 'tone-formal', text: "This isn't a law firm", mood: 'amused at over-formality' },
  { id: 'tone-stiff', text: 'Too formal for Slack', mood: 'realizing tone mismatch' },
  { id: 'tone-casual', text: 'Too casual for a client', mood: 'worried about professionalism' },
  { id: 'tone-board', text: 'Too casual for the board', mood: 'needing to level up register' },
  { id: 'tone-friendly', text: "She's my friend, not a vendor", mood: 'wanting warmer tone for a friend' },
  { id: 'tone-text', text: 'This is for the exec team', mood: 'awareness of audience' },
  // Actually What I Mean
  { id: 'mean-interesting', text: 'I mean I disagree', mood: 'honest admission beneath polite words' },
  { id: 'mean-table', text: 'This is never happening', mood: 'blunt inner thought' },
  { id: 'mean-forward', text: "I mean don't do that again", mood: 'real meaning behind corporate phrasing' },
  { id: 'mean-opportunity', text: "It's a setback, be honest", mood: 'cutting through spin' },
  { id: 'mean-challenging', text: "It's basically impossible", mood: 'honest assessment' },
  { id: 'mean-misaligned', text: 'We totally disagree', mood: 'blunt truth' },
  // Stakes Spectrum
  { id: 'stakes-urgent', text: "Calendar updates aren't urgent", mood: 'pointing out false urgency' },
  { id: 'stakes-downplay', text: 'This is actually urgent', mood: 'correcting understatement' },
  { id: 'stakes-asap', text: 'ASAP for next week?', mood: 'amused at mismatched urgency' },
  { id: 'stakes-critical', text: "This is critical, not optional", mood: 'serious, correcting weak language' },
  { id: 'stakes-exclaim', text: 'Too many exclamation points', mood: 'noticing excessive punctuation' },
  { id: 'stakes-time', text: "It's not optional, we'll miss payment", mood: 'urgent correction' },
  // Delete Key
  { id: 'delete-think', text: 'Too hesitant?', mood: 'brief self-check' },
  { id: 'delete-just', text: 'Why am I minimizing this?', mood: 'frustrated at self-undermining' },
  { id: 'delete-very', text: 'Weak. Just say it.', mood: 'decisive, cutting filler' },
  { id: 'delete-basically', text: 'This adds nothing.', mood: 'blunt editorial judgment' },
  { id: 'delete-honestly', text: "Sounds like I'm lying.", mood: 'self-aware about filler words' },
  { id: 'delete-order', text: 'Three words for one?', mood: 'amused at redundancy' },
  // Context Collapse
  { id: 'context-tiger', text: "Board won't know this term.", mood: 'realizing audience gap' },
  { id: 'context-hey', text: 'Too casual for this client?', mood: 'second-guessing greeting' },
  { id: 'context-sync', text: "They're not in tech.", mood: 'awareness of jargon barrier' },
  { id: 'context-crush', text: 'This is going to legal.', mood: 'alarmed realization of audience' },
  { id: 'context-api', text: "CEO doesn't care how.", mood: 'simplifying for audience' },
  { id: 'context-inquire', text: 'This is a startup founder.', mood: 'matching tone to recipient' },
  // Time Capsule
  { id: 'time-synergies', text: 'Did I write this in 1999?', mood: 'amused at dated language' },
  { id: 'time-unprecedented', text: 'This sounds exhausting now.', mood: 'tired of overused pandemic phrase' },
  { id: 'time-gendered', text: 'This feels old.', mood: 'noticing outdated gendered language' },
  { id: 'time-pivot', text: 'This word is tired.', mood: 'recognizing overused buzzword' },
  { id: 'time-faithfully', text: 'What century is this?', mood: 'amused at archaic sign-off' },
  { id: 'time-park', text: 'Everyone uses this.', mood: 'noticing cliché' },
  // Feedback Sandwich
  { id: 'feedback-buried', text: "They'll miss this.", mood: 'worried feedback is too buried' },
  { id: 'feedback-soft', text: 'Just tell them.', mood: 'pushing self to be direct' },
  { id: 'feedback-passive', text: 'Beneficial to whom?', mood: 'questioning vague passive feedback' },
  { id: 'feedback-question', text: 'I should just say it.', mood: 'building courage for directness' },
  { id: 'feedback-hedge', text: 'I am sure actually.', mood: 'correcting own false uncertainty' },
  { id: 'feedback-compliment', text: "It's not tiny.", mood: 'recognizing minimized feedback' },
  // Autocorrect Disasters (Didactic mode - short corrections)
  { id: 'autocorrect-regards', text: 'Regards', mood: 'quick, clear correction' },
  { id: 'autocorrect-asses', text: 'Assessment', mood: 'quick, clear correction' },
  { id: 'autocorrect-pubic', text: 'Public', mood: 'quick, clear correction' },
  { id: 'autocorrect-manger', text: 'Manager', mood: 'quick, clear correction' },
  { id: 'autocorrect-shift', text: 'Shift', mood: 'quick, clear correction' },
  { id: 'autocorrect-count', text: 'Wait, this is spelled right?', mood: 'confused, double-checking' },
];

// Build the full manifest
const manifest = [];
let voiceIdx = 0;

for (const ad of socraticAds) {
  const voice = pickVoice(voiceIdx++);
  manifest.push({
    id: ad.id,
    type: 'socratic',
    text: ad.text,
    voice: voice,
    instructions: `Speak in a warm, conversational tone. You're thinking out loud while editing your writing. Mood: ${ad.mood}. Keep it natural and brief — this is an inner thought, not a performance. No dramatic pauses.`,
    outFile: `socratic/${ad.id}.mp3`
  });
}

// Save manifest for reference
fs.mkdirSync(path.join(OUT_DIR, 'socratic'), { recursive: true });

async function run() {
  console.log(`Generating ${manifest.length} audio clips...`);
  const results = {};

  for (let i = 0; i < manifest.length; i++) {
    const item = manifest[i];
    const outPath = path.join(OUT_DIR, item.outFile);

    try {
      const size = await generateTTS(item.text, item.voice, item.instructions, outPath);
      console.log(`[${i + 1}/${manifest.length}] ${item.id} (${item.voice}) — ${(size / 1024).toFixed(1)}KB`);
      results[item.id] = { voice: item.voice, file: item.outFile, size };
    } catch (err) {
      console.error(`[${i + 1}/${manifest.length}] FAILED ${item.id}: ${err.message}`);
      results[item.id] = { error: err.message };
    }

    // Small delay to avoid rate limits
    if (i % 10 === 9) await new Promise(r => setTimeout(r, 1000));
  }

  // Save results manifest
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(results, null, 2));
  console.log(`\nDone! Manifest saved to ${path.join(OUT_DIR, 'manifest.json')}`);
}

run().catch(console.error);
