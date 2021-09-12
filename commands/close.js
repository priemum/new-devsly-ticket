const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { closeTicket } = require("../utils/closeTicket")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close')
        .setDescription('Closes the order'),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
            closeTicket(interaction)
        } else{
            await interaction.reply({content: "Orders can be closed only by Mods. Please contact any Mods to close this order", ephemeral: true})
        }
    },
};
