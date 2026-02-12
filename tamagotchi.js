// --- Deep Sea Tamagotchi System ---
// Manage hunger and affection for the partner character

const tamagotchiState = {
    hunger: 100, // 0 = Starving, 100 = Full
    affection: 50, // 0 = Hate, 100 = Love
    lastLogin: Date.now()
};

const HUNGER_DECAY_PER_HOUR = 5;
const AFFECTION_DECAY_PER_HOUR = 2;

function initTamagotchi() {
    console.log("Initializing Tamagotchi System...");
    loadTamagotchiState();
    calculateDecay();
    renderTamagotchiStatus();
    startTamagotchiLoop();
}

function loadTamagotchiState() {
    const saved = localStorage.getItem('deepSeaTamagotchi');
    if (saved) {
        Object.assign(tamagotchiState, JSON.parse(saved));
    }
}

function saveTamagotchiState() {
    tamagotchiState.lastLogin = Date.now();
    localStorage.setItem('deepSeaTamagotchi', JSON.stringify(tamagotchiState));
}

function calculateDecay() {
    const now = Date.now();
    const diffHours = (now - tamagotchiState.lastLogin) / (1000 * 60 * 60);

    if (diffHours > 0) {
        tamagotchiState.hunger = Math.max(0, tamagotchiState.hunger - (diffHours * HUNGER_DECAY_PER_HOUR));
        tamagotchiState.affection = Math.max(0, tamagotchiState.affection - (diffHours * AFFECTION_DECAY_PER_HOUR));
        console.log(`Tamagotchi updated: Decay for ${diffHours.toFixed(2)} hours.`);
        saveTamagotchiState();
    }
}

function feedTamagotchi() {
    if (tamagotchiState.hunger >= 100) {
        showBubbleMessage("お腹いっぱいだよ！");
        return;
    }
    tamagotchiState.hunger = Math.min(100, tamagotchiState.hunger + 20);
    tamagotchiState.affection = Math.min(100, tamagotchiState.affection + 5);
    showBubbleMessage("もぐもぐ...ありがとう！");
    animateReaction('❤️');
    saveTamagotchiState();
    renderTamagotchiStatus();
}

function playTamagotchi() {
    if (tamagotchiState.hunger < 20) {
        showBubbleMessage("お腹すいて動けない...");
        return;
    }
    tamagotchiState.affection = Math.min(100, tamagotchiState.affection + 10);
    tamagotchiState.hunger = Math.max(0, tamagotchiState.hunger - 10); // Playing makes them hungry
    showBubbleMessage("わーい！楽しい！");
    animateReaction('🎵');
    saveTamagotchiState();
    renderTamagotchiStatus();
}

// Rendering
function renderTamagotchiStatus() {
    const hungerBar = document.getElementById('tamaHungerBar');
    const affectionBar = document.getElementById('tamaAffectionBar');

    if (hungerBar) hungerBar.style.width = tamagotchiState.hunger + '%';
    if (affectionBar) affectionBar.style.width = tamagotchiState.affection + '%';

    // Update partner mood based on stats (Optional hook into main app)
    updateStatusIcon();
}

function updateStatusIcon() {
    const icon = document.getElementById('tamaStatusIcon');
    if (!icon) return;

    if (tamagotchiState.hunger < 30) icon.innerText = '😫';
    else if (tamagotchiState.affection > 80) icon.innerText = '🥰';
    else if (tamagotchiState.affection < 30) icon.innerText = '🥺';
    else icon.innerText = '🙂';
}

function showBubbleMessage(text) {
    // Reuse existing resMessage or create a popup
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble pop-anim';
    bubble.innerText = text;
    bubble.style.position = 'absolute';
    bubble.style.top = '40%';
    bubble.style.left = '50%';
    bubble.style.transform = 'translate(-50%, -50%)';
    bubble.style.zIndex = 200;
    document.body.appendChild(bubble);

    setTimeout(() => bubble.remove(), 2000);
}

function animateReaction(emoji) {
    const el = document.createElement('div');
    el.innerText = emoji;
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.top = '50%';
    el.style.fontSize = '4rem';
    el.style.zIndex = 300;
    el.style.pointerEvents = 'none';
    el.animate([
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
        { transform: 'translate(-50%, -150%) scale(1.5)', opacity: 1, offset: 0.5 },
        { transform: 'translate(-50%, -200%) scale(1)', opacity: 0 }
    ], { duration: 1000, easing: 'ease-out' });

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
}

function startTamagotchiLoop() {
    setInterval(() => {
        // Decrease slightly every minute for "live" feel? 
        // No, let's stick to update on load + actions to save battery/perf.
        // Maybe just update display if needed.
    }, 60000);
}
