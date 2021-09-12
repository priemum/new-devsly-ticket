const mongo = require("../Mongo/DB")
const {getConfig} = require("./config.js")
const {MessageEmbed} = require("discord.js")

function claimEmbed(user, dev){
    return new MessageEmbed()
        .setColor("#28FFBF")
        .setTitle("Order Claimed")
        .setDescription(`<@${user}> Your order will be handled by <@${dev}>`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function unclaimEmbed(user, dev){
    return new MessageEmbed()
        .setColor("#ff2626")
        .setTitle("Order Unclaimed")
        .setDescription(`<@${user}> Your order will not be handled by <@${dev}>`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function claimTicket(message){
    mongo.getTicket(message.channelId,(err,res)=>{
        if(err){
            console.error(err)
            message.reply({content: "Unable to fetch from DB, please try again", ephemeral: true})
        } else{
            if(res){
                if(!res.isClosed){
                    getConfig((err,data)=>{
                        if(err){
                            console.error(err)
                            message.reply({content: "Something went wrong while reading config..", ephemeral: true})
                        } else{
                            if(res.claim){
                                if(res.claimDev === message.user.id){
                                    message.channel.permissionOverwrites.delete(message.user.id)
                                    for(let role of data.supportRoles.split(",")){
                                        message.channel.permissionOverwrites.edit(role, {SEND_MESSAGES: true})
                                    }
                                    mongo.unclaimTicket(message.channel.id,(err,_)=>{
                                        if(err){
                                            console.error(err)
                                            message.reply({content: "Something went wrong while updating DB..", ephemeral: true})
                                        } else{
                                            message.reply({content: "Successfully unclaimed this ticket", ephemeral: true})
                                            message.channel.send({embeds: [unclaimEmbed(res.user,message.user.id)]})
                                        }
                                    })
                                } else{
                                    message.reply({content: `This order is already claimed by <@${res.claimDev}>`, ephemeral: true})
                                }
                            } else{
                                mongo.getClaimsOfUser(message.user.id,(err,res1)=> {
                                    if (err) {
                                        console.error(err)
                                        message.reply({
                                            content: "Unable to fetch from DB. Please try again",
                                            ephemeral: true
                                        })
                                    } else {
                                        if (res1.length > 4) {
                                            message.reply({
                                                content: "You've more than 4 Claims. unclaim any one order and try again.",
                                                ephemeral: true
                                            })
                                        } else {
                                            message.channel.permissionOverwrites.edit(message.user.id, {SEND_MESSAGES: true})
                                            for(let role of data.supportRoles.split(",")){
                                                message.channel.permissionOverwrites.edit(role, {SEND_MESSAGES: false})
                                            }
                                            mongo.claimTicket(message.channel.id,message.user.id,(err,_)=>{
                                                if(err){
                                                    console.error(err)
                                                    message.reply({content: "Something went wrong while updating DB..", ephemeral: true})
                                                } else{
                                                    message.reply({content: "Successfully claimed this ticket", ephemeral: true})
                                                    message.channel.send({embeds: [claimEmbed(res.user,message.user.id)]})
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else{
                    message.reply({content: "This ticket is closed sir! IDK what you're trying to do", ephemeral: true})
                }
            } else{
                message.reply({content: "This is not a ticket! you sure?", ephemeral: true})
            }
        }
    })
}

module.exports = {
    claimTicket
}