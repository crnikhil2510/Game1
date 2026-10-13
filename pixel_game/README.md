# Walkable Episode 1

Open index.html in your browser. No installation is needed. Keep engine.js, game.js, and the repository's art folder in their current relative locations. VS Code Live Server also works.

Move with arrows or WASD, hold Shift to run, and press E/Enter to talk or examine an adjacent object. Space advances dialogue and kicks the ball during the passing drill. Touch buttons are provided.

Walk onto a gold doorway to change maps. Begin in Hachiman's bedroom, go downstairs, leave home, cross the city, and meet Kaito in the school courtyard. The objective bar guides Episode 1.

13 connected maps: bedroom, living room, neighbourhood, city square, cafe, shop, courtyard, corridor, classroom, cafeteria, library, football pitch, and clubroom. Walls, furniture and people block movement. Story choices build rapport and trust. Trial membership unlocks passing training; finishing the first drill ends Episode 1 with Gun's message.

Save/load uses this browser's local storage. Switching browser or URL may use a different save. This is a pixel prototype with procedural art and existing portrait references, not a finished commercial RPG. NPCs stay at scripted locations; full schedules, later chapters, commercial-quality tiles, actual GBA ROM output, and full 11v11 football physics remain future work.

Run logic tests from the repository root: node pixel_game/test_engine.js

The starting bedroom now uses the illustrated room background, with a movable Hachiman sprite and collision cells aligned to the furniture. Other areas retain the original procedural graphics.
