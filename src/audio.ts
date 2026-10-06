// Synthesized Retro Arcade Sounds using the Web Audio API
// No external assets required, ensuring fast offline loading and 100% reliability in classroom environments.

let audioCtx: AudioContext | null = null;
let isMuted = false;

// Initialize or resume the Audio Context
function getAudioContext(): AudioContext | null {
  if (isMuted) return null;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch (e) {
    console.warn("Web Audio API not supported or blocked in this context:", e);
    return null;
  }
}

export const toggleMute = (muted: boolean) => {
  isMuted = muted;
  if (muted && audioCtx) {
    audioCtx.close().then(() => {
      audioCtx = null;
    }).catch(() => {});
  }
};

export const playSound = (type: 'coin' | 'pop' | 'correct' | 'wrong' | 'streak' | 'levelComplete' | 'click' | 'bossHit') => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  switch (type) {
    case 'click': {
      // Short wood block/click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      break;
    }

    case 'pop': {
      // Organic mole pop-up sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
      break;
    }

    case 'coin': {
      // Classic 8-bit coin sound: high note followed by a higher note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
      break;
    }

    case 'correct': {
      // Uplifting arpeggio / musical major chord
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.06);
        
        gain.gain.setValueAtTime(0.1, now + index * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.06 + 0.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + index * 0.06);
        osc.stop(now + index * 0.06 + 0.2);
      });
      break;
    }

    case 'wrong': {
      // Low dual-oscillator discord buzz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      
      osc1.frequency.setValueAtTime(130, now);
      osc1.frequency.linearRampToValueAtTime(90, now + 0.4);
      
      osc2.frequency.setValueAtTime(133, now);
      osc2.frequency.linearRampToValueAtTime(93, now + 0.4);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now);
      
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
      break;
    }

    case 'streak': {
      // High-pitched slide up for perfect streaks
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.3);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
    }

    case 'levelComplete': {
      // Glorious 8-bit victory fanfare: C4 -> E4 -> G4 -> C5 (sustained)
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 1046.50];
      const durations = [0.1, 0.1, 0.1, 0.15, 0.15, 0.5];
      let cumulativeTime = 0;
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + cumulativeTime);
        
        gain.gain.setValueAtTime(0.06, now + cumulativeTime);
        gain.gain.exponentialRampToValueAtTime(0.005, now + cumulativeTime + durations[idx]);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + cumulativeTime);
        osc.stop(now + cumulativeTime + durations[idx]);
        
        cumulativeTime += durations[idx] * 0.75;
      });
      break;
    }

    case 'bossHit': {
      // Heavy explosion noise using synthesized bandpass filter
      const osc = ctx.createOscillator();
      const noise = ctx.createOscillator(); // Or a low square wave
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      
      noise.type = 'square';
      noise.frequency.setValueAtTime(60, now);
      noise.frequency.linearRampToValueAtTime(10, now + 0.5);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      
      osc.connect(gain);
      noise.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      noise.start(now);
      osc.stop(now + 0.6);
      noise.stop(now + 0.6);
      break;
    }
  }
};
