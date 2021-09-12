const mongo = require("../Mongo/DB")
const {MessageEmbed} = require("discord.js")

function reopenEmbed(user){
    return new MessageEmbed()
        .setColor("#28FFBF")
        .setTitle("Order Reopen")
        .setDescription(`This order reopened by <@${user}>`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function reopenTicket(message){
    mongo.getTicket(message.channelId,async (err,res)=>{
      if(err){
          console.error(err)
          message.reply({content: "Unable to fetch from DB, please try again", ephemeral: true})
      } else{
          if(res){
              if(res.isClosed){
                  let pings = ``
                  message.channel.permissionOverwrites.edit(res.user, {VIEW_CHANNEL: true})
                  pings += `<@${res.user}> `
                  if(res.isAdditionalUsers){
                      for(let i=0; i<res.additionalUsers.length; i++){
                          const user = await message.client.users.fetch(res.additionalUsers[i])
                          message.channel.permissionOverwrites.edit(user, {VIEW_CHANNEL: true})
                          pings += ` <@${res.additionalUsers[i]}>`
                      }
                  }
                  message.reply({content: "Successfully Reopened", ephemeral: true})
                  message.channel.send({content: pings, embeds: [reopenEmbed(message.user.id)]})
                  mongo.reopenTicket(message.channelId,(err,_)=>{
                      if(err){
                          console.error(err)
                      }
                  })
              } else{
                  message.reply({content: "This ticket is still active!", ephemeral: true})
              }
          } else{
              message.reply({content: "This is not a ticket! you sure?", ephemeral: true})
          }
      }
    })
}

module.exports = {
    reopenTicket
}