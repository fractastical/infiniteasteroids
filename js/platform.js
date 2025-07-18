// js/platform.js
// Unified platform abstraction for Infinite Asteroids
// ---------------------------------------------------
// Detects whether the game is running on CrazyGames, Steam or plain web and
// provides a minimal shim so that calls to window.CrazyGames.* do not break
// when the CrazyGames SDK is absent (e.g. in a Steam build).
//
// Usage from other scripts:
//   Platform.gameplayStart();
//   Platform.rewardedAd({ onClose: () => {...} });
//   Platform.setAchievement("FIRST_BLOOD");
//
// If the real CrazyGames SDK is present it is used directly.
// If Steam is detected (via ?platform=steam URL param or a global Steamworks
// object) a lightweight stub is attached to window.CrazyGames so that all
// existing code keeps working. Extend createSteamBackend() to expose real
// Steam functionality once you have a binding such as Greenworks.
(function (global) {
  "use strict";

  // -------------------- helpers --------------------
  function noop() {}

  function createCrazyBackend() {
    // Assume CrazyGames SDK script already injected by the host frame.
    return global.CrazyGames || {};
  }

  function createSteamBackend() {
    // Attempt to use Greenworks if available; otherwise fall back to stub.
    const hasGreenworks = !!global.greenworks;
    let steamInitialized = false;

    if (hasGreenworks) {
      try {
        steamInitialized = global.greenworks.initAPI();
        console.log("[Platform] Greenworks initAPI =>", steamInitialized);
      } catch (e) {
        console.warn("[Platform] Greenworks initialization failed", e);
      }
    }

    const stubGame = {
      gameplayStart: noop,
      gameplayStop: noop,
      gameOver: noop,
      happytime: noop,
      requestAd: (placement, _cb) => {
        console.debug("[Steam] requestAd ignored", placement);
      },
    };

    const backend = {
      SDK: {
        init: async () => {},
        game: stubGame,
        ads: {
          rewardedAd: (callbacks) => {
            console.debug("[Steam] rewardedAd stub");
            callbacks?.onOpen?.();
            callbacks?.onClose?.();
          },
        },
        user: {
          getUserToken: async () => {
            if (steamInitialized) {
              return global.greenworks.getSteamId(); // SteamID object
            }
            return null;
          },
          addAuthListener: noop,
        },
      },
      _steamInitialized: steamInitialized,
      _hasGreenworks: hasGreenworks,
    };

    // Attach helpers for achievements / leaderboard / cloud save
    backend._setAchievement = function (id) {
      if (steamInitialized && global.greenworks.activateAchievement) {
        global.greenworks.activateAchievement(id);
      }
    };

    backend._saveText = function (filename, text) {
      if (steamInitialized && global.greenworks.saveTextOnFile) {
        global.greenworks.saveTextOnFile(filename, text);
      }
    };

    backend._loadText = function (filename, cb) {
      if (steamInitialized && global.greenworks.readTextFromFile) {
        global.greenworks.readTextFromFile(filename, cb);
      } else cb(null, null);
    };

    backend._uploadScore = function (leaderboardName, score, cb = noop) {
      if (steamInitialized && global.greenworks.getLeaderboard) {
        global.greenworks.getLeaderboard(leaderboardName, global.greenworks.LEADERBOARD_DISPLAY_TYPE.NUMERIC, global.greenworks.LEADERBOARD_SORT_METHOD.DESCENDING, (lb) => {
          lb.uploadScore(score, cb);
        });
      } else cb(false);
    };

    return backend;
  }

  function detectPlatform() {
    const urlParams = new URLSearchParams(global.location.search);
    if (urlParams.get("platform") === "steam") return "steam";
    if (global.Steamworks) return "steam"; // custom binding sets this
    if (global.CrazyGames && global.CrazyGames.SDK) return "crazy";
    return "web"; // plain web without partner SDKs
  }

  const platform = detectPlatform();
  let backend;

  switch (platform) {
    case "crazy":
      backend = createCrazyBackend();
      break;
    case "steam":
      backend = createSteamBackend();
      break;
    default:
      backend = {}; // bare web fallback
  }

  // Ensure window.CrazyGames exists so legacy calls don\'t crash
  if (!global.CrazyGames) {
    global.CrazyGames = backend;
  }

  // Public convenience API (keep minimal for now)
  const Platform = {
    get platform() {
      return platform;
    },
    gameplayStart() {
      backend.SDK?.game?.gameplayStart?.();
    },
    gameplayStop() {
      backend.SDK?.game?.gameplayStop?.();
    },
    gameOver() {
      backend.SDK?.game?.gameOver?.();
    },
    happytime() {
      backend.SDK?.game?.happytime?.();
    },
    rewardedAd(callbacks = {}) {
      backend.SDK?.ads?.rewardedAd?.(callbacks);
    },
    async getUserToken() {
      if (platform === "crazy") {
        return backend.SDK?.user?.getUserToken?.();
      }
      // Steam path would return player SteamID or similar in future
      return null;
    },
    setAchievement(id) {
      if (platform === "steam") {
        backend._setAchievement?.(id);
      }
      if (platform === "steam" && global.Steamworks?.setAchievement) {
        global.Steamworks.setAchievement(id);
      }
      // CrazyGames achievements handled via existing codebase
    },
  };

  // Expose
  global.Platform = Platform;
})(typeof window !== "undefined" ? window : this);
