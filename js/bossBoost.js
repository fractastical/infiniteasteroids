// Boss Boost (Rewarded Ad) logic injected as a standalone module
// Author: Cascade AI helper
// This script dynamically adds a rewarded‑ad modal when the player reaches wave 15.
// When the ad is watched, the player gains +1 life (shield) and +25% damage
// until the next boss dies or after a timeout.
//
// Integrates with existing globals: wave, lives, damageBooster, pauseGame, resumeGame,
// CrazyGames SDK. Requires this script to be loaded *after* game.js.

(function () {
  // --- configuration
  const OFFER_WAVE = 15;      // wave on which to trigger the ad offer
  const DAMAGE_BONUS = 0.25;  // +25% damage
  const TIMEOUT_MS   = 120000; // failsafe: 2 min after activation

  // --- internal state
  let bossAdOffered = false;
  let bossBoostActive = false;
  let bossBoostTimer = null;

  // Utility wrappers (guard against undefined)
  function safe(fn) {
    if (typeof fn === 'function') fn();
  }

  // Create and insert the modal into the DOM once
  function buildModal() {
    if (document.getElementById('bossBoostModal')) return; // already present

    const modal = document.createElement('div');
    modal.id = 'bossBoostModal';
    modal.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;`+
      `background:rgba(0,0,0,.6);display:none;align-items:center;justify-content:center;z-index:9999;`;

    const box = document.createElement('div');
    box.style.cssText = 'background:#111;padding:24px;border-radius:8px;text-align:center;max-width:360px;width:90%;color:#fff;font-family:sans-serif;';
    box.innerHTML = `
      <h2>Boss Boost</h2>
      <p>Watch a short ad to gain <strong>+1 Shield</strong> and <strong>+25% Damage</strong> until the next boss is defeated.</p>
    `;

    const btnWatch = document.createElement('button');
    btnWatch.textContent = 'Watch Ad';
    btnWatch.style.cssText = 'margin:8px;padding:8px 16px;font-size:16px;';
    btnWatch.onclick = () => {
      showRewardedAd().finally(() => modal.style.display = 'none');
    };

    const btnSkip = document.createElement('button');
    btnSkip.textContent = 'Skip';
    btnSkip.style.cssText = 'margin:8px;padding:8px 16px;font-size:16px;';
    btnSkip.onclick = () => {
      modal.style.display = 'none';
      safe(window.resumeGame);
    };

    box.appendChild(btnWatch);
    box.appendChild(btnSkip);
    modal.appendChild(box);
    document.body.appendChild(modal);
  }

  function showModal() {
    buildModal();
    const modal = document.getElementById('bossBoostModal');
    if (modal) {
      modal.style.display = 'flex';
      safe(window.pauseGame);
    }
  }

  // Call CrazyGames rewarded ad if available, else instantly grant boost
  function showRewardedAd() {
    return new Promise((resolve) => {
      if (window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.ads && window.CrazyGames.SDK.ads.rewardedAd) {
        window.CrazyGames.SDK.ads.rewardedAd()
          .then(() => {
            activateBossBoost();
            resolve();
          })
          .catch(() => {
            // Ad failed / closed – resume game without boost
            safe(window.resumeGame);
            resolve();
          });
      } else {
        // No SDK – grant boost immediately (useful for local testing)
        activateBossBoost();
        resolve();
      }
    });
  }

  function activateBossBoost() {
    if (bossBoostActive) return;

    bossBoostActive = true;
    if (typeof lives !== 'undefined') lives += 1;
    if (typeof damageBooster !== 'undefined') damageBooster += DAMAGE_BONUS;

    safe(window.resumeGame);

    // Failsafe timer: auto‑disable after TIMEOUT_MS
    bossBoostTimer = setTimeout(deactivateBossBoost, TIMEOUT_MS);
  }

  function deactivateBossBoost() {
    if (!bossBoostActive) return;
    bossBoostActive = false;

    if (typeof damageBooster !== 'undefined') damageBooster -= DAMAGE_BONUS;
    if (bossBoostTimer) {
      clearTimeout(bossBoostTimer);
      bossBoostTimer = null;
    }
  }

  // Attempt to detect boss death to end the boost early
  function monitorBossStatus() {
    if (!bossBoostActive) return;
    // First boss is miniBossAlien (defined globally). Deactivate once it disappears.
    if (typeof miniBossAlien !== 'undefined' && miniBossAlien === null) {
      deactivateBossBoost();
    }
    // Also covers superboss/mega/octo if the boost lasted longer
    if (typeof superbossAlien !== 'undefined' && superbossAlien === null && bossBoostActive) deactivateBossBoost();
  }

  // Poll wave progression every second to launch the offer
  function checkWaveForOffer() {
    if (bossAdOffered || bossBoostActive) return;
    if (typeof wave !== 'undefined' && wave >= OFFER_WAVE) {
      bossAdOffered = true;
      showModal();
    }
  }

  // Main interval ticker (1 s)
  setInterval(() => {
    checkWaveForOffer();
    monitorBossStatus();
  }, 1000);
})();
