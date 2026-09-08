import { getThumbnailFromId, getLevelPoints } from "../utils.js";

export async function renderList(content, listName = "demonlist") {
    content.innerHTML = `
    <div class="list-page">
        <div id="list"></div>
    </div>
    `;

    const list = document.getElementById("list");

    try {
        const listResponse = await fetch(`./_${listName}/_list.json`);
        const levelNames = await listResponse.json();

        const responses = await Promise.all(
            levelNames.map(id => fetch(`./_${listName}/${id}.json`))
        );

        const data = await Promise.all(
            responses.map(r => r.json())
        );

        data.forEach((item, index) => {
            const fileName = levelNames[index];
            const card = document.createElement("div");

            card.className = "card";

            card.onclick = () => {
                location.hash = `#/${listName}/level/${fileName}`;
            };

            card.innerHTML = `
                <a href="${item.verification}" target="_blank">
                    <img src="${getThumbnailFromId(item.verification)}">
                </a>

                <div class="card-text">
                    <h3>#${index + 1} - ${item.name}</h3>
                    <h4>${item.publisher}</h4>
                </div>
            `;

            const link = card.querySelector("a");
            link.addEventListener("click", (event) => {
                event.stopPropagation();
            });

            list.appendChild(card);
        });
    } catch (error) {
        console.error(error);
        list.innerHTML = `<p>Error loading ${listName}.</p>`;
    }
}
