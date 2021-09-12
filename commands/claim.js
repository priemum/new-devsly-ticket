const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const { claimTicket } = require("../utils/claimTicket")
const mongo = require("../Mongo/DB")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('claim')
        .setDescription(`Claims the order, also it works as unclaim. You've to use claim again`),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
            claimTicket(interaction)
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};
