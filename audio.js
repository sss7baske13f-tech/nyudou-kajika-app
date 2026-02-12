// --- Deep Sea BGM System ---
// Simple Oscillator-based synthesizer for retro sounds

const audioState = {
    isPlaying: false,
    volume: 0.1,
    osc: null,
    interval: null
};

// Retro Melodies (Notes: Frequency, Duration)
// Deep Sea Waltz (Slow, minor)
const SONG_DEEP_SEA = [
    { f: 392.00, d: 400 }, // G4
    { f: 311.13, d: 400 }, // Eb4
    { f: 261.63, d: 400 }, // C4
    { f: 196.00, d: 800 }, // G3
    { f: 261.63, d: 400 }, // C4
    { f: 311.13, d: 400 }, // Eb4
    { f: 392.00, d: 800 }, // G4
];

// Eurobeat (Fast, major)
const SONG_EUROBEAT = [
    { f: 523.25, d: 200 }, // C5
    { f: 523.25, d: 200 }, // C5
    { f: 587.33, d: 200 }, // D5
    { f: 659.25, d: 200 }, // E5
    { f: 523.25, d: 200 }, // C5
    { f: 659.25, d: 200 }, // E5
    { f: 783.99, d: 400 }, // G5
];

let audioCtx = null;

function initAudioSystem() {
    console.log("Initializing Audio System...");
    const btn = document.getElementById('toggleBgmBtn');
    if (btn) {
        btn.addEventListener('click', toggleBGM);
    }
}

function toggleBGM() {
    if (audioState.isPlaying) {
        stopBGM();
    } else {
        startBGM();
    }
}

function startBGM() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Resume context if suspended (browser policy)
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    audioState.isPlaying = true;
    updateBgmButton(true);
    playMelody(SONG_DEEP_SEA);
}

function stopBGM() {
    audioState.isPlaying = false;
    updateBgmButton(false);
    if (audioState.osc) {
        audioState.osc.stop();
        audioState.osc = null;
    }
    if (audioState.interval) {
        clearTimeout(audioState.interval);
        audioState.interval = null;
    }
}

function playMelody(notes) {
    if (!audioState.isPlaying) return;

    let index = 0;

    const playNext = () => {
        if (!audioState.isPlaying) return;

        const note = notes[index];
        playTone(note.f, note.d);

        index = (index + 1) % notes.length;
        audioState.interval = setTimeout(playNext, note.d + 50); // slight gap
    };

    playNext();
}

function playTone(freq, duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'square'; // Retro game sound
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(audioState.volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + (duration / 1000));

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + (duration / 1000));
}

function updateBgmButton(isPlaying) {
    const btn = document.getElementById('toggleBgmBtn');
    if (btn) {
        btn.innerText = isPlaying ? "🎵 ON" : "🔇 OFF";
        btn.classList.toggle('pulse-anim', isPlaying);
    }
}
