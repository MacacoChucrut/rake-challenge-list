import { getYouTubeEmbedUrl, getLevelPoints } from "../utils.js";

export async function renderLevel(content, listName = "demonlist", id) {
    try {
        const [levelResponse, listResponse] = await Promise.all([
            fetch(`./_${listName}/${id}.json`),
            fetch(`./_${listName}/_list.json`)
        ]);

        const level = await levelResponse.json();
        const levelNames = await listResponse.json();
        const rank = levelNames.indexOf(id) + 1;
        const levelPoints = getLevelPoints(rank, levelNames.length);
        const embedUrl = getYouTubeEmbedUrl(level.verification);

        content.innerHTML = `
            <div class="level-page">

                <div class="level-main">
                    <div class="level-title">
                        <h1>${level.name}</h1>
                        <p>by ${level.creator}</p>
                        <p>published by ${level.publisher}</p>
                    </div>

                    <div class="level-media">
                        ${embedUrl
                            ? `<div class="video-responsive">
                                <iframe 
                                    src="${embedUrl}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                    allowfullscreen>
                                </iframe>
                            </div>`: `<p class="no-video">No video available for this level.</p>`
                        }
                    </div>

                    <div class="level-info">
                        <div class="level-id">
                            <h3>ID</h3>
                            <p>${level.id}</p>
                        </div>
                        <div class="level-points">
                            <h3>Points</h3>
                            <p>${levelPoints}</p>
                        </div>
                    </div>
                </div>

                <div class="level-records">
                    <h2>Records</h2>
                    <hr>
                    <div class="records-list">
                        ${level.records && level.records.length > 0
                            ? level.records.map(record => `
                                <a href="${record.link}" target="_blank">${record.user}</a>
                            `).join('')
                            : `<p>No records yet! Be the first to achieve one!</p>`
                        }
                    </div>
                </div>
            </div>
        `;

    } catch (error) {
        console.error(error);
        content.innerHTML = `
            <div class="level-page">
                <p>Failed to load this level.</p>
            </div>
        `;
    }
}