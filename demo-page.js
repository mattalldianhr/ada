/**
 * Demo Page Animations
 * Each section has its own demo that plays when visible
 */

// Utility: Type text with animation
function typeText(element, text, speed = 30) {
  return new Promise(resolve => {
    let i = 0;
    element.innerHTML = '<span class="typing-cursor"></span>';
    element.style.display = 'block';

    function type() {
      if (i < text.length) {
        element.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor"></span>';
        i++;
        setTimeout(type, speed + Math.random() * 20);
      } else {
        element.innerHTML = text;
        resolve();
      }
    }
    type();
  });
}

// Utility: Draw waveform
function createWaveformAnimator(canvas) {
  const ctx = canvas.getContext('2d');
  let time = 0;
  let animationId;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.beginPath();

    const centerY = canvas.height / 2;
    const segments = 40;
    const segmentWidth = canvas.width / segments;

    for (let i = 0; i <= segments; i++) {
      const x = i * segmentWidth;
      const wave1 = Math.sin(time * 3 + i * 0.3) * 8;
      const wave2 = Math.sin(time * 5 + i * 0.5) * 4;
      const wave3 = Math.sin(time * 2 + i * 0.2) * 3;
      const amplitude = (wave1 + wave2 + wave3) * (0.5 + Math.random() * 0.3);
      const y = centerY + amplitude;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    time += 0.05;
  }

  return {
    start() {
      const animate = () => {
        draw();
        animationId = requestAnimationFrame(animate);
      };
      animate();
    },
    stop() {
      cancelAnimationFrame(animationId);
    }
  };
}

// ============================================================================
// SOCRATIC MODE DEMO
// ============================================================================
(function() {
  const canvas = document.getElementById('socratic-waveform');
  if (!canvas) return;

  const waveform = createWaveformAnimator(canvas);
  const recording = document.getElementById('socratic-recording');
  const conversation = document.getElementById('socratic-conversation');
  const suggestion = document.getElementById('socratic-suggestion');
  const questionEl = document.getElementById('socratic-question');
  const answerEl = document.getElementById('socratic-answer');
  const suggestionText = document.getElementById('socratic-suggestion-text');
  const acceptBtn = document.getElementById('socratic-accept');
  const selectionEl = document.getElementById('socratic-selection');

  const demo = {
    question: "Is 'fundamentally broken' too dramatic for a blog opener?",
    answer: "The phrase grabs attention but might alienate skeptical readers. Consider 'ready for a rethink' for a softer entry that still signals change.",
    suggestion: "The way we create content is ready for a rethink.",
    original: "The way we create content is fundamentally broken."
  };

  let isRunning = false;

  function reset() {
    recording.classList.remove('hidden');
    conversation.classList.remove('visible');
    suggestion.classList.remove('visible');
    questionEl.innerHTML = '';
    answerEl.innerHTML = '';
    answerEl.style.display = 'none';
    suggestionText.innerHTML = '';
    acceptBtn.classList.remove('clicked');
    selectionEl.textContent = demo.original;
    selectionEl.classList.remove('accepted');
  }

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;
    reset();

    // Phase 1: Waveform (2.5s)
    waveform.start();
    await new Promise(r => setTimeout(r, 2500));
    waveform.stop();

    // Phase 2: Show conversation
    recording.classList.add('hidden');
    conversation.classList.add('visible');

    await typeText(questionEl, demo.question, 25);
    await new Promise(r => setTimeout(r, 400));

    answerEl.style.display = 'block';
    await typeText(answerEl, demo.answer, 18);
    await new Promise(r => setTimeout(r, 600));

    // Phase 3: Show suggestion
    suggestion.classList.add('visible');
    await typeText(suggestionText, demo.suggestion, 15);
    await new Promise(r => setTimeout(r, 1500));

    // Phase 4: Accept
    acceptBtn.classList.add('clicked');
    await new Promise(r => setTimeout(r, 300));

    selectionEl.textContent = demo.suggestion;
    selectionEl.classList.add('accepted');

    // Wait then loop
    await new Promise(r => setTimeout(r, 4000));
    isRunning = false;
    runDemo();
  }

  // Start when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.getElementById('socratic-demo'));
})();

// ============================================================================
// DIDACTIC MODE DEMO
// ============================================================================
(function() {
  const canvas = document.getElementById('didactic-waveform');
  if (!canvas) return;

  const waveform = createWaveformAnimator(canvas);
  const recording = document.getElementById('didactic-recording');
  const transcription = document.getElementById('didactic-transcription');
  const suggestion = document.getElementById('didactic-suggestion');
  const spokenEl = document.getElementById('didactic-spoken');
  const suggestionText = document.getElementById('didactic-suggestion-text');
  const acceptBtn = document.getElementById('didactic-accept');
  const selectionEl = document.getElementById('didactic-selection');

  const demo = {
    spoken: '"Here\'s an update on our Q4 planning."',
    suggestion: "Here's an update on our Q4 planning.",
    original: "I wanted to reach out and touch base regarding our Q4 planning initiatives and synergize our efforts moving forward."
  };

  let isRunning = false;

  function reset() {
    recording.classList.remove('hidden');
    transcription.classList.remove('visible');
    suggestion.classList.remove('visible');
    spokenEl.innerHTML = '';
    suggestionText.innerHTML = '';
    acceptBtn.classList.remove('clicked');
    selectionEl.textContent = demo.original;
    selectionEl.classList.remove('accepted');
  }

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;
    reset();

    // Phase 1: Waveform (2s)
    waveform.start();
    await new Promise(r => setTimeout(r, 2000));
    waveform.stop();

    // Phase 2: Show transcription
    recording.classList.add('hidden');
    transcription.classList.add('visible');

    await typeText(spokenEl, demo.spoken, 30);
    await new Promise(r => setTimeout(r, 500));

    // Phase 3: Show suggestion
    suggestion.classList.add('visible');
    await typeText(suggestionText, demo.suggestion, 20);
    await new Promise(r => setTimeout(r, 1200));

    // Phase 4: Accept
    acceptBtn.classList.add('clicked');
    await new Promise(r => setTimeout(r, 300));

    selectionEl.textContent = demo.suggestion;
    selectionEl.classList.add('accepted');

    // Wait then loop
    await new Promise(r => setTimeout(r, 4000));
    isRunning = false;
    runDemo();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.getElementById('didactic-demo'));
})();

// ============================================================================
// AGENTS DEMO
// ============================================================================
(function() {
  const emptyState = document.getElementById('agents-empty');
  if (!emptyState) return;

  const agents = [
    {
      id: 1,
      name: 'Clarity Check',
      color: 'clarity',
      quote: '"a groundbreaking paradigm shift"',
      issue: 'Vague buzzwords. What specifically changed?',
      revision: '"a major update to how voice editing works"',
      highlightId: 'agents-highlight-1'
    },
    {
      id: 2,
      name: 'Jargon Detector',
      color: 'jargon',
      quote: '"leverages cutting-edge AI to synergize"',
      issue: '"Leverage" and "synergize" are corporate clichés.',
      revision: '"uses AI to improve"',
      highlightId: 'agents-highlight-2'
    },
    {
      id: 3,
      name: 'Voice Check',
      color: 'voice',
      quote: '"It is recommended that users familiarize"',
      issue: 'Passive and formal. Your style guide says: "Direct but warm."',
      revision: '"Take a few minutes to explore"',
      highlightId: 'agents-highlight-3'
    }
  ];

  let isRunning = false;
  let currentIndex = 0;

  function getElements(agent) {
    return {
      card: document.getElementById(`agent-card-${agent.id}`),
      quote: document.getElementById(`agent-quote-${agent.id}`),
      issue: document.getElementById(`agent-issue-${agent.id}`),
      revision: document.getElementById(`agent-revision-${agent.id}`),
      revisionText: document.getElementById(`agent-revision-text-${agent.id}`),
      accept: document.getElementById(`agent-accept-${agent.id}`),
      highlight: document.getElementById(agent.highlightId),
      row: document.getElementById(`agent-row-${agent.color}`)
    };
  }

  function reset() {
    emptyState.classList.remove('hidden');
    agents.forEach(agent => {
      const els = getElements(agent);
      els.card.classList.add('hidden');
      els.quote.textContent = '';
      els.issue.textContent = '';
      els.revisionText.textContent = '';
      els.revision.classList.add('hidden');
      els.accept.classList.remove('clicked');
      // Reset highlight to original style
      els.highlight.classList.remove('accepted');
    });
  }

  async function showAgent(agent) {
    const els = getElements(agent);

    // Show agent "thinking" (dot pulses)
    els.row.querySelector('.dot').classList.add('running');
    await new Promise(r => setTimeout(r, 1000));
    els.row.querySelector('.dot').classList.remove('running');

    // Hide empty state, show card
    emptyState.classList.add('hidden');
    els.card.classList.remove('hidden');

    // Fill in content
    els.quote.textContent = agent.quote;
    await new Promise(r => setTimeout(r, 300));

    await typeText(els.issue, agent.issue, 15);
    await new Promise(r => setTimeout(r, 400));

    els.revision.classList.remove('hidden');
    await typeText(els.revisionText, agent.revision, 20);
    await new Promise(r => setTimeout(r, 1200));

    // Accept
    els.accept.classList.add('clicked');
    await new Promise(r => setTimeout(r, 300));

    els.highlight.classList.add('accepted');
    els.highlight.textContent = agent.revision.replace(/"/g, '');

    await new Promise(r => setTimeout(r, 1500));
  }

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;
    reset();

    await new Promise(r => setTimeout(r, 1500));

    // Show each agent sequentially
    for (const agent of agents) {
      await showAgent(agent);
    }

    // Wait then loop
    await new Promise(r => setTimeout(r, 3000));
    isRunning = false;
    runDemo();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.getElementById('agents-demo'));
})();

// ============================================================================
// CONVERSATIONS DEMO
// ============================================================================
(function() {
  const answerEl = document.getElementById('conv-answer-2');
  if (!answerEl) return;

  const card1 = document.getElementById('conv-card-1');
  const card2 = document.getElementById('conv-card-2');
  const card3 = document.getElementById('conv-card-3');
  const highlight2 = document.getElementById('conv-highlight-2');

  let isRunning = false;

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;

    // Reset
    answerEl.textContent = '';
    card2.classList.add('active');
    highlight2.classList.remove('accepted');

    await new Promise(r => setTimeout(r, 1000));

    // Type the AI response in card 2
    await typeText(
      answerEl,
      "Yes, citing a source would strengthen this claim. Try: 'A Stanford study found productivity rose 13% for remote workers.'",
      15
    );

    await new Promise(r => setTimeout(r, 3000));

    // Simulate clicking to accept
    highlight2.classList.add('accepted');
    highlight2.textContent = 'a Stanford study found productivity rose 13% for remote workers';

    await new Promise(r => setTimeout(r, 5000));

    isRunning = false;
    runDemo();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.getElementById('conversations-demo'));
})();

// ============================================================================
// VOICE GUIDE DEMO
// ============================================================================
(function() {
  const afterEl = document.getElementById('voice-after');
  if (!afterEl) return;

  const codeEl = document.getElementById('voice-code');
  const beforeEl = document.getElementById('voice-before');

  const transformations = [
    {
      before: "It is recommended that users familiarize themselves with the documentation prior to implementation.",
      after: "Read the docs before you start. It'll save you time."
    },
    {
      before: "We are pleased to announce the launch of our new product offering.",
      after: "We just launched something new. Here's what it does."
    },
    {
      before: "In order to optimize efficiency, it is advisable to leverage existing resources.",
      after: "Use what you have. It's faster."
    }
  ];

  let isRunning = false;
  let currentIndex = 0;

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;

    const transform = transformations[currentIndex];
    beforeEl.textContent = transform.before;
    afterEl.textContent = '';

    await new Promise(r => setTimeout(r, 1500));

    // Highlight relevant parts of the voice guide
    // (Animation: pulse the code block)
    codeEl.style.transition = 'box-shadow 0.3s ease';
    codeEl.style.boxShadow = '0 0 0 2px rgba(5, 150, 105, 0.3)';
    await new Promise(r => setTimeout(r, 500));
    codeEl.style.boxShadow = 'none';

    // Type the transformed version
    await typeText(afterEl, transform.after, 20);

    await new Promise(r => setTimeout(r, 4000));

    currentIndex = (currentIndex + 1) % transformations.length;
    isRunning = false;
    runDemo();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.getElementById('voice-demo'));
})();

// ============================================================================
// PRIVACY DEMO
// ============================================================================
(function() {
  const voiceNode = document.getElementById('privacy-voice');
  if (!voiceNode) return;

  const whisperNode = document.getElementById('privacy-whisper');
  const claudeNode = document.getElementById('privacy-claude');
  const arrow1 = document.getElementById('privacy-arrow-1');
  const arrow2 = document.getElementById('privacy-arrow-2');

  let isRunning = false;

  async function runDemo() {
    if (isRunning) return;
    isRunning = true;

    // Reset
    [voiceNode, whisperNode, claudeNode].forEach(n => n.classList.remove('active'));
    [arrow1, arrow2].forEach(a => a.classList.remove('active'));

    await new Promise(r => setTimeout(r, 500));

    // Step 1: Voice activates
    voiceNode.classList.add('active');
    await new Promise(r => setTimeout(r, 800));

    // Step 2: Arrow 1 activates, voice deactivates
    arrow1.classList.add('active');
    voiceNode.classList.remove('active');
    await new Promise(r => setTimeout(r, 600));

    // Step 3: Whisper activates
    whisperNode.classList.add('active');
    arrow1.classList.remove('active');
    await new Promise(r => setTimeout(r, 1000));

    // Step 4: Arrow 2 activates
    arrow2.classList.add('active');
    whisperNode.classList.remove('active');
    await new Promise(r => setTimeout(r, 600));

    // Step 5: Claude activates
    claudeNode.classList.add('active');
    arrow2.classList.remove('active');
    await new Promise(r => setTimeout(r, 1500));

    // Reset and loop
    claudeNode.classList.remove('active');
    await new Promise(r => setTimeout(r, 2000));

    isRunning = false;
    runDemo();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isRunning) {
        runDemo();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(document.getElementById('privacy-demo'));
})();

// ============================================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
