const axios = require("axios");

async function unsplash(query) {
    try {
        const url = `https://bk9.fun/search/unsplash?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (response.data && response.data.BK9 && response.data.BK9.length > 0) {
            return response.data.BK9.slice(0, 5); // Return first 5 images
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
}




async function fetchPinterestImages(query) {
    try {
        const url = `https://bk9.fun/pinterest/search?q=${encodeURIComponent(query)}`;
        const response = await axios.get(url);
        
        if (response.data.status && response.data.BK9.length > 0) {
            return response.data.BK9.slice(0, 5); // Return the first 5 images
        } else {
            return [];
        }
    } catch (error) {
        console.error("Pinterest API Error:", error);
        return null;
    }
}



async function fetchPixabay(query) {
    try {
        const response = await axios.get(`https://bk9.fun/search/pixabay?q=${encodeURIComponent(query)}`);
        if (response.data && response.data.status && response.data.BK9) {
            return response.data.BK9.slice(0, 5); // Return only the first 5 images
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching images from Pixabay:", error);
        return [];
    }
}




async function wiki(query) {
    try {
        const response = await axios.get(`https://bk9.fun/search/wiki?q=${encodeURIComponent(query)}`);
        
        if (response.data && response.data.status && response.data.BK9.length > 0) {
            const data = response.data.BK9[0]; // Get the first result
            return {
                text: data.BK9.trim(),
                image: data.thumb
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching Wiki data:", error);
        return null;
    }
}




module.exports = { unsplash, fetchPinterestImages, fetchPixabay, wiki };
