export function getThumbnailFromId(urlOrId) {

    if (!urlOrId) return '';

    const input = String(urlOrId).trim();

    if (!input.includes("youtube") && !input.includes("youtu.be")) {
        return `https://img.youtube.com/vi/${input}/mqdefault.jpg`;
    }

    const match = input.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/ 
    );

    if (!match) return '';

    return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
}

export function getYouTubeEmbedUrl(url) {
    if (!url) return "";
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
        return `https://www.youtube.com/embed/${match[2]}`;
    }

    return null;
}

export function getLevelPoints(rank, totalLevels, maxPoints = 300, minPoints = 10) {
    if (rank <= 0 || totalLevels <= 0) return "0.0";
    
    const decay = totalLevels > 1 
        ? Math.log(maxPoints / minPoints) / (totalLevels - 1) 
        : 0;

    const rawPoints = maxPoints * Math.exp(-decay * (rank - 1));
    return (Math.round(rawPoints * 100) / 100).toFixed(1);
}