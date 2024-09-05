< !DOCTYPE html >
    <html lang="en">

        <head>
            <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Infinite Asteroids</title>
                    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
                        <link rel="stylesheet" href="styles.css">
                        </head>

                        <body>
                            <!-- Top bar for tech count and login -->
                            <div id="topBar">
                                <div id="loginInfo" class="top-left">User: Guest | <a href="#" id="login-link">Login</a></div>
                                <div id="technologiesCount" class="top-right">Technologies: 5/10</div>
                            </div>

                            <!-- Main game layout -->
                            <div id="gameContainer">
                                <!-- Left Column for Ship, Weapon, Game Mode -->
                                <div id="leftColumn">
                                    <div class="option-group">
                                        <p>Select Ship:</p>
                                        <div class="selector">
                                            <span>Basic</span>
                                            <button>></button>
                                        </div>
                                    </div>

                                    <div class="option-group">
                                        <p>Select Weapon:</p>
                                        <div class="selector">
                                            <span>Bomb</span>
                                            <button>></button>
                                        </div>
                                    </div>

                                    <div class="option-group">
                                        <p>Select Game Mode:</p>
                                        <div class="selector">
                                            <span>Deep Space</span>
                                            <button>></button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Center Column for Game title and buttons -->
                                <div id="centerColumn">
                                    <h1>Infinite Asteroids</h1>
                                    <p>Unlock next level when you reach wave 30.</p>
                                    <div id="gameControls">
                                        <button id="startGameButton" class="large-btn">Start Game</button>
                                        <button>How To Play</button>
                                        <button>Settings</button>
                                        <button>Unlocks</button>
                                        <button>Achievements</button>
                                    </div>
                                </div>

                                <!-- Right Column for Leaderboard -->
                                <div id="rightColumn">
                                    <div id="leaderboard-container">
                                        <h2>Leaderboard</h2>
                                        <ol>
                                            <li>1. PlayerOne - 20000</li>
                                            <li>2. PlayerTwo - 18000</li>
                                            <li>3. PlayerThree - 16000</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>

                            <script src="game.js"></script>
                        </body>

                    </html>
