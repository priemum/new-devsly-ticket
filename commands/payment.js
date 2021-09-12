const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageActionRow, MessageButton } = require('discord.js')
const {generateLink} = require("../utils/paymentLink")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('payment')
        .setDescription('Creates a payment link for the card payments')
        .addStringOption(option=>
            option.setName("amount")
                .setDescription("the amount (in USD) you want the user to pay")
                .setRequired(true)
        ),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
            const amount = interaction.options.getString("amount")
            generateLink(amount,(err,link)=>{
                if(err){
                    console.error(err)
                    interaction.reply({content: "Unable to fetch from the API", ephemeral: true})
                } else{
                    const buttonLink = new MessageActionRow()
                        .addComponents(
                            [
                                new MessageButton()
                                    .setURL(link)
                                    .setLabel('Make Payment')
                                    .setStyle('LINK')
                                    .setEmoji("💰"),
                            ]
                        )
                    interaction.reply({content: "Success!", ephemeral: true})
                    interaction.channel.send({components: [buttonLink],content: `Click the below button to make the payment!`})
                }
            })
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};