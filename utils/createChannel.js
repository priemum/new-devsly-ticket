const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js')
const fs = require('fs')
const {getConfig,updateConfig} = require("./config.js")
const mongo = require("../Mongo/DB")

function orderCreated(channel){
    return new MessageEmbed()
        .setTitle("Order Created")
        .setDescription(`Your order is successfully created\nYou can check at <#${channel}>`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function updateCount(){
    fs.readFile("../config.json",(err,res)=>{
        if(err){
            console.error(err)
        } else{
            let data = JSON.parse(res.toString())
            data.count += 1
            fs.writeFile("./config.json", JSON.stringify(data,null,4), err => {
                if (err) throw err;
            });
        }
    })
}

function projectName(){
    return new MessageEmbed()
        .setTitle('**Project Name**')
        .setDescription(`Please specify your project name\nType \`stop\` to stop the order creation`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function projectDetails(){
    return new MessageEmbed()
        .setTitle('**Project Details**')
        .setDescription(`Please add your project details\nType \`stop\` to stop the order creation`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function forumProfile(){
    return new MessageEmbed()
        .setTitle('**Forum Profile Link**')
        .setDescription(`Please specify any of your forum profile link\nType \`stop\` to stop the order creation`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function budget(){
    return new MessageEmbed()
        .setTitle('**Budget**')
        .setDescription(`Please specify your budget\nType \`stop\` to stop the order creation`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function paymentMethod(){
    return new MessageEmbed()
        .setTitle('**Payment Method**')
        .setDescription(`Please specify your payment method\nType \`stop\` to stop the order creation`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function deadline(){
    return new MessageEmbed()
        .setTitle('**Deadline**')
        .setDescription(`In how many days you need this project to be completed?\nType \`stop\` to stop the order creation`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function outOfTime(){
    return new MessageEmbed()
        .setTitle('**Stopped**')
        .setDescription(`Order Creation Stopped`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function dmClosed(user){
    return new MessageEmbed()
        .setDescription(`<@${user}> It Seems Your DMs are Closed. I can't Message you with that setting.`)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function projectResponse(data){
    return new MessageEmbed()
        .setTitle("Order Details")
        .setDescription(`**Project Name - **\`${data[0]}\`\n\n**Project Details - **\`${data[1]}\`\n\n**Forum Profile Link - **\`${data[2]}\`\n\n**Budget - **\`${data[3]}\`\n\n**Payment Method - **\`${data[4]}\`\n\n**DeadLine - **\`${data[5]}\``)
        .setTimestamp(Date.now())
        .setFooter("Devsly", "https://cdn.discordapp.com/avatars/750585310873649282/79870cc941ed9ea06085795cf232f27a.png?size=64")
}

function replaceAll(data){
    for(let i =0; i< data.length; i++){
        data[i] = data[i].replace(/\*\*/g,'').replace(/_/g,'').replace(/`/g,'')
    }
    return data
}

async function gatherProjectDetails(message, user){
    let data = []
    let filter = m => m.author.id === user.id
    try{
        // Project Name
        await user.send({embeds: [projectName()]}).then(async msg=>{
            await msg.channel.awaitMessages({filter, max: 1, time: 300000, errors: ['time'] }).then(collected=>{
                data[0] =`${collected.first().content}`
                if(data[0] === "stop"){
                    throw("stop")
                }
            })
        })

        // Project Details
        await user.send({embeds: [projectDetails()]}).then(async msg => {
            await msg.channel.awaitMessages({filter,  max: 1, time: 300000, errors: ['time'] }).then(collected => {
                data[1] =`${collected.first().content}`
                if(data[1] === "stop"){
                    throw("stop")
                }
            })
        })

        // Forum profile Link
        await user.send({embeds: [forumProfile()]}).then(async msg => {
            await msg.channel.awaitMessages({filter,  max: 1, time: 300000, errors: ['time'] }).then(collected => {
                data[2] =`${collected.first().content}`
                if(data[2] === "stop"){
                    throw("stop")
                }
            })
        })

        // Budget
        await user.send({embeds: [budget()]}).then(async msg => {
            await msg.channel.awaitMessages({filter,  max: 1, time: 300000, errors: ['time'] }).then(collected => {
                data[3] =`${collected.first().content}`
                if(data[3] === "stop"){
                    throw("stop")
                }
            })
        })

        // Payment Method
        await user.send({embeds: [paymentMethod()]}).then(async msg => {
            await msg.channel.awaitMessages({filter,  max: 1, time: 300000, errors: ['time'] }).then(collected => {
                data[4] =`${collected.first().content}`
                if(data[4] === "stop"){
                    throw("stop")
                }
            })
        })

        // DeadLine
        await user.send({embeds: [deadline()]}).then(async msg => {
            await msg.channel.awaitMessages({filter,  max: 1, time: 300000, errors: ['time'] }).then(collected => {
                data[5] =`${collected.first().content}`
                if(data[5] === "stop"){
                    throw("stop")
                }
            })
        })
        data = replaceAll(data)
        return data
    }
    catch(err){
        user.send({embeds: [outOfTime()]}).catch(err=>{
            return message.channel.send({embeds: [dmClosed(user.id)]}).then(m=>{
                m.delete({ timeout: 15000 })
            })
        })
        return null
    }
}

async function createCategory(message){
    return new Promise((resolve,reject)=>{
        getConfig(async (err,data)=>{
            if(err){
                console.error(err)
                reject(err)
            } else{
                message.guild.channels.create(`Tickets-${data.categoryCount}`,{type: "GUILD_CATEGORY"}).then(category=>{
                    console.log(category)
                    data.category = category.id
                    data.categoryCount += 1
                    updateConfig(data)
                    resolve(null)
                })
            }
        })
    })
}

async function createChannel(message, user, roles){
    return new Promise((resolve,reject)=>{
        getConfig((err,data)=>{
            if(err){
                reject(err)
            } else{
                let permission = []
                permission.push({
                    id: message.guild.id,
                    deny: ["VIEW_CHANNEL"]
                })
                permission.push({
                    id: user.id,
                    allow: ['VIEW_CHANNEL'],
                })

                // Roles Permission
                for(let role of roles){
                    permission.push({
                        id: role,
                        allow: ["VIEW_CHANNEL"]
                    })
                }
                message.guild.channels.create(`Order-${data.count.toLocaleString('en-US', {minimumIntegerDigits: 4, useGrouping:false})}`,{
                    type: "GUILD_TEXT",
                    parent: data.category,
                    permissionOverwrites: permission
                }).then(channel=>{
                    data.count += 1
                    updateConfig(data)
                    resolve(channel)
                }).catch(async err=>{
                    console.error(err)
                    reject(err)
                })
            }
        })
    })
}

function createTicket(data, message, user){
    getConfig(async (err,res)=>{
        if(err){
            console.error(err)
        } else{
            if(res.category.length > 0){
                createChannel(message,user,res.supportRoles.split(",")).then(async channel=>{
                    mongo.addTicket(channel.id,user.id,async (err,_)=>{
                        if(err){
                            console.error(err)
                        } else{
                            let pings = `<@${user.id}>`
                            // for(let role of res.supportRoles.split(",")){
                            //     pings += ` <@&${role}> `
                            // }
                            const close = new MessageActionRow()
                                .addComponents(
                                    [
                                        new MessageButton()
                                            .setCustomId('close')
                                            .setLabel('Close')
                                            .setStyle('PRIMARY')
                                            .setEmoji("🔒"),
                                        new MessageButton()
                                            .setCustomId('claim')
                                            .setLabel('Claim')
                                            .setStyle('SUCCESS')
                                            .setEmoji("🛄"),
                                        new MessageButton()
                                            .setCustomId('delete')
                                            .setLabel('Delete')
                                            .setStyle('DANGER')
                                            .setEmoji("<:trashcan:886140911770271774>")
                                    ]
                                );
                            await channel.send({content: pings, embeds: [projectResponse(data)], components: [close]})
                            await user.send({embeds: [orderCreated(channel.id)]})
                        }
                    })
                }).catch(async err=>{
                    await createCategory(message)
                    createTicket(data,message,user)
                })
            } else{
                await createCategory(message)
                createTicket(data,message,user)
            }
        }
    })
}

module.exports = {
    gatherProjectDetails, createTicket
}