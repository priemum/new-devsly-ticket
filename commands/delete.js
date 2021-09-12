const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { deleteTicket } = require("../utils/deleteTicket")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription(`deletes the order`)
        .addStringOption(option=>
            option.setName("force")
                .setDescription("To force delete a channel i.e., it doesn't check if its a ticket or not")
                .setRequired(true)
                .addChoice("true", "true")
                .addChoice("false", "false")
        ),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
            const force = interaction.options.getString("force")
            if(force === "true"){
                deleteTicket(interaction,true)
            } else{
                deleteTicket(interaction,false)
            }
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};
