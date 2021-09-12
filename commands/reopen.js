const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { reopenTicket } = require("../utils/reopenTicket")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reopen')
        .setDescription(`reopens the closed order`),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
            reopenTicket(interaction)
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};
