const mongo = require("../Mongo/DB")
const {MessageEmbed, Permissions} = require("discord.js")
const {SlashCommandBuilder} = require("@discordjs/builders");

function userEmbed(user,tickets){
    return new MessageEmbed()
        .setTitle(`User info for ${user.username}#${user.discriminator}`)
        .addField("Claim Tickets",tickets)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Get info about the user')
        .addUserOption(option=>
            option.setName("user")
                .setDescription("the user info you want")
        ),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS)) {
            const user = interaction.options.getUser("user")
            const param = !!user
            const id = user ? user.id : interaction.user.id
            mongo.getClaimsOfUser(id,(err,res)=>{
                if(err){
                    console.error(err)
                    interaction.reply({content: "Unable to fetch from DB. Try again", ephemeral: true})
                } else{
                    let claimTickets = ``
                    for(let doc of res){
                        claimTickets += `<#${doc.channel}>\n`
                    }
                    if(param){
                        interaction.reply({embeds: [userEmbed(user,claimTickets.length > 0 ? claimTickets : "No Tickets Claimed")]})
                    } else{
                        interaction.reply({embeds: [userEmbed(interaction.user,claimTickets.length > 0 ? claimTickets : "No Tickets Claimed")]})
                    }
                }
            })
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};