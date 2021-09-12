const mongo = require("../Mongo/DB")
const {Permissions} = require("discord.js")
const {SlashCommandBuilder} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('orders')
        .setDescription('Get info about the orders based on choice')
        .addStringOption(option=>
            option.setName("sort")
                .setDescription("It says which data need to show")
                .addChoice("Claimed Orders","claim")
                .addChoice("Open Orders","open")
                .addChoice("Closed Orders","close")
                .setRequired(true)
        )
        .addBooleanOption(option=>
            option.setName("ephemeral")
                .setDescription("It decides to be able to visible for everyone or only for you")
                .setRequired(true)
        ),
    async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            const type = interaction.options.getString("sort")
            const epheral = interaction.options.getBoolean("ephemeral")
            if(type === "claim"){
                mongo.getClaimsOfAllUsersWithTickets((err,res)=>{
                    if(err){
                        console.error(err)
                        interaction.reply({content: "Unable to fetch from DB. Try again", ephemeral: true})
                    } else{
                        let message = ``
                        for (let data of res){
                            message += `Claim Tickets of <@${data.user.id}>\n`
                            for(let channel of data.user.channels){
                                message += `<#${channel}>\n`
                            }
                            message += "\n"
                        }
                        interaction.reply({content: message.length > 0 ? message: "No claimed orders found", ephemeral: epheral})
                    }
                })
            } else if(type === "open"){
                mongo.getOpenOrders((err,res)=>{
                    if(err){
                        console.error(err)
                        interaction.reply({content: "Unable to fetch from DB. Try again", ephemeral: true})
                    } else{
                        let message = ``
                        for(let data of res){
                            message += `<#${data}>\n`
                        }
                        interaction.reply({content: message.length > 0 ? message: "No open orders found", ephemeral: epheral})
                    }
                })
            } else {
                mongo.getClosedOrders((err,res)=>{
                    if(err){
                        console.error(err)
                        interaction.reply({content: "Unable to fetch from DB. Try again", ephemeral: true})
                    } else{
                        let message = ``
                        for(let data of res){
                            message += `<#${data}>\n`
                        }
                        interaction.reply({content: message.length > 0 ? message: "No closed orders found", ephemeral: epheral})
                    }
                })
            }
        } else{
            await interaction.reply({content: "This is not for you sir!", ephemeral: true})
        }
    },
};