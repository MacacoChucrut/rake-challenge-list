import { getLevelPoints } from "../utils.js";

export async function renderStatsViewer(content, listName = "demonlist") {
    try {
        const listResponse = await fetch(`./_${listName}/_list.json`);
        const levelNames = await listResponse.json();

        const responses = await Promise.all(
            levelNames.map(name => fetch(`./_${listName}/${name}.json`))
        );
        const levelsData = await Promise.all(responses.map(r => r.json()));

        const players = {};

        const initPlayer = (name) => {
            if (!players[name]) {
                players[name] = {
                    name: name,
                    points: 0,
                    completed: []
                };
            }
        };

        initPlayer("graymatr");

        const totalLevels = levelsData.length;

        levelsData.forEach((level, index) => {
            const rank = index + 1;
            const levelPoints = parseFloat(getLevelPoints(rank, totalLevels));

            players["graymatr"].points += levelPoints;
            players["graymatr"].completed.push({
                name: level.name,
                rank: rank
            });

            if (level.records && level.records.length > 0) {
                level.records.forEach(record => {
                    const userName = record.user;
                    if (userName.toLowerCase() !== "graymatr") {
                        initPlayer(userName);
                        players[userName].points += levelPoints;
                        players[userName].completed.push({
                            name: level.name,
                            rank: rank
                        });
                    }
                });
            }
        });

        const leaderboard = Object.values(players).sort((a, b) => b.points - a.points);

        content.innerHTML = `
            <div class="stats-viewer-page">
                <div class="stats-players">
                    <div class="search-bar">
                        <input type="text" id="player-search" placeholder="Search Players...">
                    </div>
                    <ul id="players-list">
                        ${renderPlayerListItems(leaderboard)}
                    </ul>
                </div>
                <div class="stats-content" id="player-details"></div>
            </div>
        `;

        function renderPlayerListItems(list) {
            return list.map((player) => {
                const globalRank = leaderboard.findIndex(p => p.name === player.name) + 1;
                return `
                    <li class="player-item" data-name="${player.name}">
                        <span><strong>#${globalRank}</strong></span>
                        <span>${player.name}</span>
                        <span>${player.points.toFixed(2)}</span>
                    </li>
                `;
            }).join('');
        }

        function selectPlayer(player) {
            const globalRank = leaderboard.findIndex(p => p.name === player.name) + 1;
            
            const sortedCompleted = [...player.completed].sort((a, b) => a.rank - b.rank);
            const hardestDemon = sortedCompleted.length > 0 ? sortedCompleted[0].name : "None";

            const detailsContainer = document.getElementById("player-details");
            detailsContainer.innerHTML = `
                <h1>#${globalRank} - ${player.name}</h1>

                <div class="stats-top">
                    <div class="stats-points">
                        <h3>Points</h3>
                        <p>${player.points.toFixed(2)}</p>
                    </div>

                    <div class="stats-hardest">
                        <h3>Hardest</h3>
                        <p>${hardestDemon}</p>
                    </div>
                </div>

                <div class="stats-completed">
                    <h3>Completed demons</h3>
                    <p>
                        ${sortedCompleted.length > 0 
                            ? sortedCompleted.map(d => d.name).join(" - ")
                            : "None"}
                    </p>
                </div>
            `;

            document.querySelectorAll(".player-item").forEach(el => {
                el.classList.toggle("active", el.dataset.name === player.name);
            });
        }

        const playersListEl = document.getElementById("players-list");
        playersListEl.addEventListener("click", (e) => {
            const item = e.target.closest(".player-item");
            if (item) {
                const name = item.dataset.name;
                const player = leaderboard.find(p => p.name === name);
                if (player) selectPlayer(player);
            }
        });

        const searchInput = document.getElementById("player-search");
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = leaderboard.filter(p => p.name.toLowerCase().includes(query));
            playersListEl.innerHTML = renderPlayerListItems(filtered);
        });

        if (leaderboard.length > 0) {
            selectPlayer(leaderboard[0]);
        }

    } catch (error) {
        console.error(error);
        content.innerHTML = `<div class="stats-viewer-container"><p>Error loading ${listName}.</p></div>`;
    }
}