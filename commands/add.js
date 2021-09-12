const mongo = require("../Mongo/DB")
const {MessageEmbed, Permissions} = require("discord.js")
const {SlashCommandBuilder} = require("@discordjs/builders");

function addedUser(user){
    return new MessageEmbed()
        .setTitle("User added")
        .setDescription(`<@${user}> Added to the order`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('adds a new user to the ticket')
        .addUserOption(option=>
            option.setName("user")
                .setDescription("The user you wanna add in")
                .setRequired(true)
        ),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
            mongo.getTicket(interaction.channelId,(err,res)=>{
                if(err){
                    console.error(err)
                    interaction.reply({content: "Unable to fetch the ticket from DB", ephemeral: true})
                } else{
                    if(res){
                        if(!res.isClosed){
                            const user = interaction.options.getUser("user")
                            interaction.channel.permissionOverwrites.create(user.id,{VIEW_CHANNEL: true})
                            mongo.addNewUser(interaction.channelId,user.id,(err,_)=>{
                                if(err){
                                    console.error(err)
                                } else{
                                    interaction.reply({content: "Success!", ephemeral: true})
                                    interaction.channel.send({embeds: [addedUser(user.id)]})
                                }
                            })
                        } else{
                            interaction.reply({content: "This ticket is closed sir, IDK what you're trying to do", ephemeral: true})
                        }
                    } else{
                        interaction.reply({content: "This is not a ticket. You sure?", ephemeral: true})
                    }
                }
            })
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};