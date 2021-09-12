const cmd = require('node-cmd');
const { token } = require('../config.json')

function chatExport(channel,user){
    return new Promise((resolve,reject)=>{
        const cmdPrepare = `DiscordChatExporter.Cli.exe export -c ${channel} -t "${token}" -b True -o "${__dirname}\\Docs\\${user}-${channel}.html"`;
        cmd.run(`cd .\\Chat\\ && ${cmdPrepare}`,(err,data,stderr)=>{
            if(data.indexOf('Successfully exported') !== -1){
                resolve(__dirname + `\\Docs\\${user}-${channel}.html`)
            }
            else{
                const data = {
                    err: err,
                    stderr: stderr
                }
                reject(data)
            }
        })
    })
}

module.exports = { chatExport }