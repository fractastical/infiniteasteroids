/* Simple modal controller – expand as you add features */
(() => {
    const modal = document.getElementById('shipCustomizationModal');
    const openBtn = document.getElementById('customizeShipButton');
    const saveBtn = document.getElementById('saveCustomization');

    // Re‑use the existing preview canvas instead of creating a duplicate.
    const previewCan = document.getElementById('shipPreviewCanvas');
    const originalParent = previewCan.parentElement;
    const originalSize = { w: previewCan.width, h: previewCan.height };
    const modalPreviewContainer = document.getElementById('shipPreview');
    const modalSize = { w: 160, h: 160 };

    // --- data structure safeguards --------------------------------------
    // Ensure a global inventory object exists so that the modal logic never
    // hits a ReferenceError when the game hasn’t created one yet.
    window.playerInventory = window.playerInventory || { upgrades: [] };
    // Likewise, guarantee that the ship has an equippedUpgrades array so all
    // later logic can push / splice safely.
    if (typeof ship !== 'undefined' && !ship.equippedUpgrades) {
        ship.equippedUpgrades = [];
    }

    // open
    openBtn.addEventListener('click', () => {
        pauseGame?.();                 // if your game exposes this
        populateCustomization();       // fills in current data
        // Move the canvas into the modal and enlarge it
        modalPreviewContainer.appendChild(previewCan);
        previewCan.width = modalSize.w;
        previewCan.height = modalSize.h;
        modal.style.display = 'block';
        updateShipPreview(currentShip); // already exists in ships.js
    });

    // close/save
    saveBtn.addEventListener('click', () => {
        applyCustomization();          // TODO: write this (equip logic)
        modal.style.display = 'none';
        // Move the canvas back to its original spot and restore size
        originalParent.appendChild(previewCan);
        previewCan.width = originalSize.w;
        previewCan.height = originalSize.h;
        resumeGame?.();
    });

    // ESC key to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            saveBtn.click();
        }
    });

    /* --- helpers ---------------------------------------------------- */
    function populateCustomization() {
        // Re‑check in case the objects were reset by a game restart
        if (!ship.equippedUpgrades) ship.equippedUpgrades = [];
        if (!playerInventory.upgrades) playerInventory.upgrades = [];

        // Example: list up to ship.upgradeSlots items the player owns
        const equippedDiv = document.getElementById('equippedUpgrades');
        const availableDiv = document.getElementById('availableUpgrades');
        equippedDiv.querySelectorAll('.upgrade-item').forEach(n => n.remove());
        availableDiv.querySelectorAll('.upgrade-item').forEach(n => n.remove());

        (ship.equippedUpgrades || []).forEach(u => equippedDiv.appendChild(makeItem(u, true)));
        (playerInventory.upgrades || []).forEach(u => availableDiv.appendChild(makeItem(u, false)));
    }

    function makeItem(upgrade, equipped) {
        const el = document.createElement('div');
        el.className = 'upgrade-item';
        el.textContent = upgrade.name;
        el.onclick = () => toggleEquip(upgrade, equipped);
        return el;
    }

    function toggleEquip(up, wasEquipped) {
        // very rough; you’ll refine this
        if (wasEquipped) {
            ship.equippedUpgrades = ship.equippedUpgrades.filter(u => u !== up);
            playerInventory.upgrades.push(up);
        } else if (ship.equippedUpgrades.length < ship.upgradeSlots) {
            playerInventory.upgrades = playerInventory.upgrades.filter(u => u !== up);
            ship.equippedUpgrades.push(up);
        }
        populateCustomization();
    }

    function applyCustomization() {
        // sync ship stats with equippedUpgrades, if needed
        // e.g. recalc laserLevel etc.
    }
})();