const mongo = require("../Mongo/DB")
const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js")

function ticketClosed(user){
    return new MessageEmbed()
        .setTitle("Order Closed")
        .setDescription(`Order closed by <@${user}>`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function closeTicket(message){
    mongo.getTicket(message.channelId,async (err,res)=>{
        if(err){
            console.error(err)
            message.reply({content: "Unable to fetch from DB, please try again", ephemeral: true})
        } else{
            if(res){
                if(!res.isClosed){
                    message.channel.permissionOverwrites.edit(res.user, {VIEW_CHANNEL: false})
                    if(res.isAdditionalUsers){
                        for(let i=0; i<res.additionalUsers.length; i++){
                            const user = await message.client.users.fetch(res.additionalUsers[i])
                            message.channel.permissionOverwrites.edit(user, {VIEW_CHANNEL: false})
                        }
                    }
                    mongo.closeTicket(message.channelId,(err,res)=>{
                        if(err){
                            console.error(err)
                        } else{
                            const close = new MessageActionRow()
                                .addComponents(
                                    [
                                        new MessageButton()
                                            .setCustomId('transcript')
                                            .setLabel('Transcript')
                                            .setStyle('PRIMARY')
                                            .setEmoji("📰"),
                                        new MessageButton()
                                            .setCustomId('reopen')
                                            .setLabel('Reopen')
                                            .setStyle('SUCCESS')
                                            .setEmoji("🔓"),
                                        new MessageButton()
                                            .setCustomId('delete')
                                            .setLabel('Delete')
                                            .setStyle('DANGER')
                                            .setEmoji("<:trashcan:886140911770271774>")
                                    ]
                                );
                            message.reply({content: "This order is successfully closed!", ephemeral: true})
                            message.channel.send({embeds: [ticketClosed(message.user.id)], components: [close]})
                        }
                    })
                } else{
                    message.reply({content: "This ticket is already closed!", ephemeral: true})
                }
            } else{
                message.reply({content: "This is not a ticket! you sure?", ephemeral: true})
            }
        }
    })
}

module.exports = {
    closeTicket
}