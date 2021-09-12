const mongo = require("../Mongo/DB")
const {MessageEmbed, Permissions} = require("discord.js")
const {getConfig} = require("../utils/config.js");
const {SlashCommandBuilder} = require("@discordjs/builders");

function unclaimEmbed(user, dev){
    return new MessageEmbed()
        .setColor("#ff2626")
        .setTitle("Order Unclaimed")
        .setDescription(`Admins Reset - <@${user}> Your order will not be handled by <@${dev}>`)
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
                                message.channel.permissionOverwrites.delete(res.claimDev)
                                for(let role of data.supportRoles.split(",")){
                                    message.channel.permissionOverwrites.edit(role, {SEND_MESSAGES: true})
                                }
                                mongo.unclaimTicket(message.channel.id,(err,_)=>{
                                    if(err){
                                        console.error(err)
                                        message.reply({content: "Something went wrong while updating DB..", ephemeral: true})
                                    } else{
                                        message.reply({content: "Successfully unclaimed this ticket", ephemeral: true})
                                        message.channel.send({embeds: [unclaimEmbed(res.user,res.claimDev)]})
                                    }
                                })
                            } else{
                                message.reply({content: "No one claimed this ticket yet?", ephemeral: true})
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
    data: new SlashCommandBuilder()
        .setName('unclaim')
        .setDescription(`Force unclaims the order. Done only by Admins`),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            claimTicket(interaction)
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};