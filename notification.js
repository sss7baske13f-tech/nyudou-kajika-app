// --- Visual Notification System ---

function showNewFriendNotification(friend) {
    // Play Sound if BGM logic allows (Simple chime)
    if (audioCtx && audioCtx.state === 'running') {
        playTone(523.25, 100); // C5
        setTimeout(() => playTone(659.25, 100), 100); // E5
        setTimeout(() => playTone(783.99, 400), 200); // G5
    }

    // Create Modal Elements
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay glass-panel pop-anim';

    overlay.innerHTML = `
        <div style="text-align: center;">
            <h2 class="neon-text" style="color:#ff79c6; margin-bottom:10px;">✨ NEW FRIEND! ✨</h2>
            <div class="polaroid" style="transform: rotate(-3deg); margin: 10px auto; width: 120px;">
                <img src="${friend.backgroundImage}" style="width:100%; display:block;">
            </div>
            <h3 style="font-family: var(--font-hand); font-size: 1.5rem;">
                ${friend.name}
            </h3>
            <p style="font-size: 0.9rem; color: #555;">
                が友達帳に追加されたよ！
            </p>
            <button class="btn-primary" id="closeNotifBtn" style="margin-top:15px;">OK!</button>
        </div>
    `;

    document.body.appendChild(overlay);

    // Event
    document.getElementById('closeNotifBtn').onclick = () => {
        overlay.classList.remove('pop-anim');
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 300);
    };

    // Confetti Effect (Simple CSS or JS)
    createConfetti(overlay);
}

function createConfetti(parent) {
    for (let i = 0; i < 20; i++) {
        const c = document.createElement('div');
        c.innerText = ['🎉', '✨', '🐟', '💖'][Math.floor(Math.random() * 4)];
        c.style.position = 'absolute';
        c.style.left = Math.random() * 100 + '%';
        c.style.top = Math.random() * 100 + '%';
        c.style.fontSize = (Math.random() * 20 + 10) + 'px';
        c.style.animation = `float ${Math.random() * 2 + 1}s infinite`;
        parent.appendChild(c);
    }
}
