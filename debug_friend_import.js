
// Simulate Friend Import
async function testFriendImport() {
    console.log("Starting Friend Import Test...");

    // 1. Define Dummy Friend Data
    const dummyFriend = {
        name: "TestFriend",
        mbti: "ENFP",
        message: "Hello from Debug!",
        font: "sans-serif",
        id: "debug-" + Date.now()
    };
    const jsonString = JSON.stringify(dummyFriend);

    // 2. Open Exchange Modal
    const openExchangeBtn = document.getElementById('openExchangeBtn');
    if (openExchangeBtn) {
        openExchangeBtn.click();
        console.log("Clicked Open Exchange Button");
    } else {
        console.error("Open Exchange Button not found!");
        return;
    }

    await new Promise(r => setTimeout(r, 500));

    // 3. Switch to Import Tab
    const tabImport = document.getElementById('tabImport');
    if (tabImport) {
        tabImport.click();
        console.log("Clicked Import Tab");
    } else {
        console.error("Import Tab not found!");
        return;
    }

    await new Promise(r => setTimeout(r, 500));

    // 4. Paste Data
    const importInput = document.getElementById('importDataInput');
    if (importInput) {
        importInput.value = jsonString;
        console.log("Pasted JSON Data");
    } else {
        console.error("Import Input not found!");
        return;
    }

    // 5. Click Import Button
    const importBtn = document.getElementById('importProfileBtn');
    if (importBtn) {
        importBtn.click();
        console.log("Clicked Import Button");
    } else {
        console.error("Import Button not found!");
        return;
    }

    // 6. Verify Result
    await new Promise(r => setTimeout(r, 2000)); // Wait for animation/process

    // Check local storage state
    // We can't easily access 'state' variable directly from here if it's not global window.state
    // But we can check UI or try to access it if app.js exposed it.
    // Assuming app.js runs in global scope or we can check DOM.

    // Check if notification overlay exists
    const overlay = document.querySelector('.notification-overlay');
    console.log("Notification Overlay found:", !!overlay);

    // Check if friend count increased (hard to verify without base count, but we can check if renderFriendBook update)
    // Let's check if the new friend name appears in the friend list (hidden book pages?)
    // Actually, let's just check if it threw an error.
}

testFriendImport();
