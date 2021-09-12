const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { transcriptTicket } = require("../utils/transcriptTicket")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transcript')
        .setDescription(`transcripts the order`)
        .addStringOption(option=>
            option.setName("force")
                .setDescription("To force transcript a channel i.e., it doesn't check if its a ticket or not")
                .setRequired(true)
                .addChoice("true", "true")
                .addChoice("false", "false")
        ),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            const force = interaction.options.getString("force")
            if(force === "true"){
                transcriptTicket(interaction,true)
            } else{
                transcriptTicket(interaction,false)
            }
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};
