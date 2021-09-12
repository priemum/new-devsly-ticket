const fs = require('fs');
const { Client, Collection, Intents, Permissions} = require('discord.js');
const {token} = require('./config.json')
const {gatherProjectDetails, createTicket} = require("./utils/createChannel")
const {closeTicket} = require("./utils/closeTicket")
const { claimTicket } = require("./utils/claimTicket")
const { deleteTicket } = require("./utils/deleteTicket")
const { transcriptTicket } = require("./utils/transcriptTicket")
const { reopenTicket } = require("./utils/reopenTicket")
const mongo = require("./Mongo/DB")

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES]})

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready',()=>{
    console.log("Bot is up and running!")
})

client.on('interactionCreate',async interaction => {
    if(interaction.isCommand()){
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    } else if(interaction.isButton()){
        if(interaction.customId === "order"){
            mongo.getUser(interaction.user.id,(err,user)=>{
                if(err){
                    console.error(err)
                    interaction.reply({content: "Unable to fetch from DB. Please try again", ephemeral: true})
                } else{
                    if(user){
                        interaction.reply({content: `You already have a ticket opened at <#${user.channel}>`, ephemeral: true})
                    } else{
                        interaction.reply({content: `Please check your DM <@${interaction.user.id}>`, ephemeral: true})
                        gatherProjectDetails(interaction, interaction.user).then(data=>{
                            if(data){
                                createTicket(data, interaction, interaction.user)
                            }
                        })
                    }
                }
            })
        } else if(interaction.customId === "close"){
            if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
                closeTicket(interaction)
            } else{
                interaction.reply({content: "Orders can be closed only by Mods. Please contact any Mods to close this order", ephemeral: true})
            }
        } else if(interaction.customId === "claim"){
            if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)){
                claimTicket(interaction)
            } else{
                interaction.reply({content: "Sorry, this is not for you sir!", ephemeral: true})
            }
        } else if(interaction.customId === "delete"){
            if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
                deleteTicket(interaction,false)
            } else{
                interaction.reply({content: "Sorry, this is not for you sir!", ephemeral: true})
            }
        } else if(interaction.customId === "transcript"){
            if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
                transcriptTicket(interaction,false)
            } else{
                interaction.reply({content: "Sorry, this is not for you sir!", ephemeral: true})
            }
        } else if(interaction.customId === "reopen"){
            if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
                reopenTicket(interaction)
            } else{
                interaction.reply({content: "Sorry, this is not for you sir!", ephemeral: true})
            }
        }
    }
})

client.login(token);