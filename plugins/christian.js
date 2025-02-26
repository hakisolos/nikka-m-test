const { command, isPrivate, getJson } = require("../lib")
const { tiny } = require("../lib/fancy_font/fancy");
command(
    {
        pattern: "bible",
        desc: "for us from the lord",
        type: "christian",
        fromMe: isPrivate,
    },
    async(message, match) => {
        try{
            if(!match){
                return m.send("give me a bible vercel in the format .bible John,3:16")

            }
            else if(!match.includes(",")){
                return m.send(`incorrect format !!!,\n please use the format .bible John,3:16 `)
            }
            const m1 = match.split(",")[0]
            const m2 = match.split(",")[1]
            const response = await getJson(`https://api.giftedtech.my.id/api/tools/bible?apikey=gifted&verse=${m1} ${m2}`)
            const res = response.result
            const verse = await tiny(res.verse)
            const word = await tiny(res.data)
            await message.haki(`${verse}:\n ${word}`)
       }catch(e){
            await m.send(e)
       }
        
    }
)
