const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js')
const {MessageEmbed} = require("discord.js")
const {calculateAmount} = require("../utils/payment")
const address = require("../address.json")

function sendEmbed(address, amount){
    return new MessageEmbed()
        .setTitle("Payment")
        .setDescription(`Scan the QR Code below or pay to the below address with exact amount\n\n**Address**\n\`\`\`${address}\`\`\`\n\n**Amount**\`\`\`${amount}\`\`\``)
        .setImage(`https://chart.googleapis.com/chart?chs=200x200&chld=L|2&cht=qr&chl=${address}`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription(`sends the crypto payment qr with payment info`)
        .addStringOption(option=>
            option.setName("currency")
                .setDescription("the crypto currency which you want to create")
                .setRequired(true)
                .addChoice("BTC", "BTC")
                .addChoice("LTC", "LTC")
                .addChoice("ETH","ETH")
                .addChoice("USDT","USDT")
                .addChoice("USDC","USDC")
                .addChoice("BNB","BNB")
                .addChoice("ADA","ADA")
                .addChoice("XMR","XMR")
                .addChoice("XRP","XRP")
        )
        .addStringOption(option=>
            option.setName("amount")
                .setDescription("Amount you want the user to pay ( in USD )")
                .setRequired(true)
        ),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)){
            const currency = interaction.options.getString("currency")
            const amount = interaction.options.getString("amount")
            calculateAmount(currency,amount,(err,price)=>{
                if(err){
                    console.error(err)
                    interaction.reply({content: "Error while fetching currency data!", ephemeral: true})
                } else{
                    interaction.reply({content: "Success!", ephemeral: true})
                    interaction.channel.send({embeds: [sendEmbed(address[currency],price)]})
                }
            })
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};
