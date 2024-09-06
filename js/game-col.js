// Define available game modes
const gameModes = [
    { id: 'Deep Space', displayName: 'Deep Space' },
    { id: 'Meteor Shower', displayName: 'Meteor Shower' },
    { id: 'Planet', displayName: 'Planet' }
];

// Track the current game mode index
let currentGameModeIndex = 0;

// Event listener for game mode button
document.getElementById('gameModeButton').addEventListener('click', function () {
    // Update current game mode index and cycle through the game modes
    currentGameModeIndex = (currentGameModeIndex + 1) % gameModes.length;

    // Update the displayed game mode text in the selector
    const selectedGameMode = gameModes[currentGameModeIndex].displayName;
    document.getElementById('selectedGameMode').textContent = selectedGameMode;

    // Load the corresponding leaderboard for the new game mode
    loadLeaderboardForMode(selectedGameMode);
});

// Function to load leaderboard based on game mode
function loadLeaderboardForMode(gameMode) {
    const leaderboardList = document.getElementById('leaderboard-list');
    const leaderboardTitle = document.querySelector('#leaderboard-container h2');
    leaderboardTitle.textContent = `${gameMode} Leaderboard`;  // Update title

    leaderboardList.innerHTML = ''; // Clear the current leaderboard

    // Fetch leaderboard data based on the selected game mode
    loadAllLeaderboards('InfiniteAsteroids').then(allScores => {
        const scores = allScores[gameMode] || [];

        if (scores.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No scores available';
            leaderboardList.appendChild(li);
        } else {
            scores.forEach((score, index) => {
                const li = document.createElement('li');
                li.textContent = `${index + 1}. ${score.nickname} - ${score.score}`;
                leaderboardList.appendChild(li);
            });
        }
    });
}

// Actual logic to populate all leaderboards
async function loadAllLeaderboards(gameName) {
    const db = getFirestore();
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const allScores = {};

    // Define the different game modes available
    const gameModes = [
        { id: GameModes.EASY, name: "Deep Space Easy" },
        { id: GameModes.NORMAL, name: "Deep Space Normal" },
        { id: GameModes.HARD, name: "Deep Space Hard" },
        { id: GameModes.HERO, name: "Deep Space Hero" },
        { id: GameModes.METEORSHOWEREASY, name: "Meteor Shower Easy" },
        { id: GameModes.METEORSHOWERNORMAL, name: "Meteor Shower Normal" },
        { id: GameModes.METEORSHOWERHARD, name: "Meteor Shower Hard" },
        { id: GameModes.METEORSHOWERHERO, name: "Meteor Shower Hero" },
        { id: GameModes.PLANETEASY, name: "Planet Easy" },
        { id: GameModes.PLANETNORMAL, name: "Planet Normal" },
        { id: GameModes.PLANETHARD, name: "Planet Hard" },
        { id: GameModes.PLANETHERO, name: "Planet Hero" },
        { id: GameModes.ENDLESS_SLOW, name: "Endless Slow" }
    ];

    // Process each user and their scores
    usersSnapshot.forEach(doc => {
        const userData = doc.data();
        gameModes.forEach(mode => {
            const gameScores = userData.games?.[gameName]?.scores || [];
            gameScores.forEach(session => {
                if (session.score && isFinite(session.score) && session.score <= 100000000 && session.gameMode === mode.id) {
                    if (!allScores[mode.name]) {
                        allScores[mode.name] = [];
                    }
                    allScores[mode.name].push({
                        nickname: userData.nickname || 'Unnamed',
                        score: session.score,
                        wave: session.wave  // Assuming wave number is tracked
                    });
                }
            });
        });
    });

    // Sort and limit scores for each mode
    for (let mode in allScores) {
        allScores[mode].sort((a, b) => b.score - a.score);

        const playerCounts = {};
        allScores[mode] = allScores[mode].filter(score => {
            if (!playerCounts[score.nickname]) {
                playerCounts[score.nickname] = 0;
            }
            if (playerCounts[score.nickname] < 3) {
                playerCounts[score.nickname]++;
                return true;
            }
            return false;
        }).slice(0, 12);  // Limit to top 12 scores
    }

    return allScores;
}

// Initial call to load leaderboard for default game mode
loadLeaderboardForMode('Deep Space');

// Achievements logic remains unchanged
