const axios = require("axios");
async function gojo() {
    try{
        const response = await axios.get(`https://api.nexoracle.com/anime/gojo?apikey=free_key@maher_apis`);
        const res = response.data.result;
        console.log(res)
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}


async function goku() {
    try{
        const response = await axios.get(`https://api.nexoracle.com/anime/goku?apikey=free_key@maher_apis`);
        const res = response.data.result;
        console.log(res)
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}


async function animeChar(char) {
    try {
        const response = await axios.get(`https://api.nexoracle.com/anime/mal-character?apikey=free_key@maher_apis&q=${char}`);
        const res = response.data.result[0];
       
        const result = {
            name: res.name,
            alias: res.alias_name,
            url: res.url,
            thumb: res.thumbnail,
            anime: res.anime,
            manga: res.manga
        };

        return result;  // Return the result object here
    } catch (error) {
        console.log(error);
        return { error: "Failed to fetch data" };  // Return an error message
    }
}


module.exports = { gojo, goku, animeChar } 

