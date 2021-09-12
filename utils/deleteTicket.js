const mongo = require("../Mongo/DB")
const {MessageEmbed} = require("discord.js")
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function deleteEmbed(){
    return new MessageEmbed()
        .setColor("#28FFBF")
        .setTitle("Order Delete")
        .setDescription(`This order will be deleted in 5 seconds`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function deleteTicket(message, force){
    if(force){
        message.reply({embeds: [deleteEmbed()]}).then(async ()=>{
            await delay(5000)
            message.channel.delete()
        })
    } else{
        mongo.getTicket(message.channelId,(err,res)=>{
            if(err){
                console.error(err)
                message.reply({content: "Unable to fetch from DB, please try again", ephemeral: true})
            } else{
                if(res){

                    message.reply({embeds: [deleteEmbed()]}).then(async ()=>{
                        await delay(5000)
                        message.channel.delete()
                        mongo.deleteTicket(message.channel.id,(err,_)=>{
                            if(err){
                                console.error(err)
                            }
                        })
                    })
                } else{
                    message.reply({content: "This is not a ticket! you sure?", ephemeral: true})
                }
            }
        })
    }
}

module.exports = {
    deleteTicket
}