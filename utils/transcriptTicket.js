const mongo = require("../Mongo/DB")
const {transcript} = require("../config.json")
const {MessageEmbed} = require("discord.js")
const {chatExport} = require("./cmd")
const fs = require("fs")

function saving(){
    return new MessageEmbed()
        .setColor("#FFFEB7")
        .setDescription("Saving the Transcript!")
}

function saved(){
    return new MessageEmbed()
        .setColor("#95DAC1")
        .setDescription("Successfully saved the transcipt!")
}

function transcriptEmbed(ticketName, ticketID, user, dev, claim){
    return new MessageEmbed()
        .setColor("#B1FFFD")
        .setTitle(`Transcript for ${user.username + "#" + user.discriminator}`)
        .addField("Order Channel",ticketName,true)
        .addField("Order Channel ID", ticketID,true)
        .addField("Executed by", `<@${dev.id}>`, true)
        .addField(`User`,`<@${user.id}>`,true)
        .addField(`Claimed`, `${claim.length > 0 ? `<@${claim}>`: `No one claimed`}`,true)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function transcriptEmbedForce(ticketName, ticketID, user){
    return new MessageEmbed()
        .setColor("#B1FFFD")
        .setTitle(`Transcript for ${user.username + "#" + user.discriminator}`)
        .addField("Order Channel",ticketName,true)
        .addField("Order Channel ID", ticketID,true)
        .addField("Executed by", `<@${user.id}>`, true)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function transcriptTicket(message, force){
    if(force){
        message.reply({embeds: [saving()]})
        chatExport(message.channelId,message.user.id).then(file=>{
            message.channel.client.channels.fetch(transcript).then(channel=>{
                channel.send({embeds: [transcriptEmbedForce(message.channel.name,message.channel.id,message.user)], files: [file]}).then(()=>{
                    message.editReply({embeds: [saved()]})
                    fs.unlink(file,(err)=>{
                        if(err){
                            console.error(err)
                        }
                    })
                })
            })
        }).catch(err=>{
            console.error(err)
            message.editReply({content: "Something went wrong while transcription"})
        })
    } else{
        mongo.getTicket(message.channelId,(err,res)=>{
            if(err){
                console.error(err)
                message.reply({content: "Unable to fetch from DB, please try again", ephemeral: true})
            } else{
                if(res){
                    message.reply({embeds: [saving()]})
                    chatExport(message.channelId,message.user.id).then(file=>{
                        message.channel.client.channels.fetch(transcript).then(channel=>{
                            message.channel.client.users.fetch(res.user).then(user=>{
                                channel.send({embeds: [transcriptEmbed(message.channel.name,message.channel.id,user,message.user,res.claimDev)], files: [file]}).then(()=>{
                                    message.editReply({embeds: [saved()]})
                                    fs.unlink(file,(err)=>{
                                        if(err){
                                            console.error(err)
                                        }
                                    })
                                })
                            })
                        })
                    }).catch(err=>{
                        console.error(err)
                        message.editReply({content: "Something went wrong while transcription"})
                    })
                } else{
                    message.reply({content: "This is not a ticket! you sure?", ephemeral: true})
                }
            }
        })
    }
}

module.exports = {
    transcriptTicket
}