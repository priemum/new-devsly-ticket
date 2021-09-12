const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageActionRow, MessageButton, Permissions, MessageEmbed} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Creates a new order panel'),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)){
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('order')
                        .setLabel('Create Order')
                        .setStyle('SUCCESS')
                        .setEmoji("🎟️")
                );
            const embed = new MessageEmbed()
                .setTitle("Devsly Order Creation")
                .setDescription(`Hi,\nWe're Excited to work with you.\nClick the below Button\nAnd I'll meet you in your DM`)
                .setTimestamp(Date.now())
                .setFooter("Devsly","https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
            await interaction.channel.send({components: [row], embeds: [embed]});
            await interaction.reply({content: "Panel Created Successfully", ephemeral: true})
        } else{
            await interaction.reply({content: "You're not a admin", ephemeral: true})
        }
    },
};
