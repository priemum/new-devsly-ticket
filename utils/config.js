const fs = require('fs')

function getConfig(callback){
    fs.readFile("./config.json",(err,data)=>{
        if(err){
            callback(err,null)
        } else{
            callback(null,JSON.parse(data.toString()))
        }
    })
}

function updateConfig(data){
    fs.writeFileSync("./config.json",Buffer.from(JSON.stringify(data,null,4)))
}

module.exports = {
    getConfig,
    updateConfig
}