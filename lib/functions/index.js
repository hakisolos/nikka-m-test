const axios = require("axios");

async function gemini(query) {
    try {
        const response = await axios.get(
            `https://nikka-api.us.kg/ai/gemini?q=${encodeURIComponent(query)}&apiKey=nikka`
        );
        const res = response.data.response;
        return res;
    } catch (error) {
        console.error("Error fetching Gemini API response:", error.message);
        return "An error occurred while fetching the response.";
    }
}

async function groq(query){
    try{
        const response = await axios.get(
            `https://nikka-api.us.kg/ai/groq?q=${encodeURIComponent(query)}&apiKey=nikka`
        );
        const res = response.data.data
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}

async function llama(query){
    try{
        const response = await axios.get(
            `https://bk9.fun/ai/llama?q=${encodeURIComponent(query)}`
        );
        const res = response.data.BK9
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}

async function meta(query) {
    try{
        const response = await axios.get(`https://apii.ambalzz.biz.id/api/openai/meta-ai?ask=${encodeURIComponent(query)}`);
        const res = response.data.r.meta;
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}

async function dalle(prompt) {
    try{
        const response = `https://bk9.fun/ai/magicstudio?prompt=${encodeURIComponent(prompt)}`;
        return response;
    }catch(error){
        console.log(error)
        return error;
    }
}

async function gpt(query, userId) {
    try{
        const response = await axios.get(`https://bk9.fun/ai/GPT4o?q=${encodeURIComponent(query)}&userId=${userId}`);
        const res = response.data.BK9;
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}

async function claude(query, userId) {
    try{
        const response = await axios.get(`https://bk9.fun/ai/Claude-Opus?q=${encodeURIComponent(query)}&userId=${userId}`);
        const res = response.data.BK9;
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}

async function hakiu(query, userId) {
    try{
        const response = await axios.get(`https://bk9.fun/ai/Claude-Haiku?q=${encodeURIComponent(query)}&userId=${userId}`);
        const res = response.data.BK9;
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}

async function nikka(query) {
    try{
        const response = await axios.get(`https://bk9.fun/ai/chataibot?q=${encodeURIComponent(query)}`);
        const res = response.data.BK9;
        return res;
    }catch(error){
        console.log(error)
        return error;
    }
}

module.exports = { gemini, groq, meta, llama, dalle, gpt, claude, hakiu, nikka };