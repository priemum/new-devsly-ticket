const MongoClient = require('mongodb').MongoClient;
const {dbName, dbURL} = require('../config.json')
var connection;

MongoClient.connect(dbURL, { useUnifiedTopology: true }, function(err, client) {
    if(err)throw err
    console.log("Connected successfully to server");
    connection = client
})

function addTicket(channel, user, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.insertOne(
        {
            channel : `${channel}`,
            user: `${user}`,
            claim: false,
            claimDev: ``,
            isClosed: false,
            isAdditionalUsers: false,
            additionalUsers: [""]
        },
        async function(err, result) {
            if(err) {
                await callback(err,null)
            } else{
                await callback(null,result)
            }
        })
}

function claimTicket(channel, user, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.updateOne({
        channel: channel,
    },{
        $set: {
            claim: true,
            claimDev: user
        }
    }, async (err,result)=>{
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function unclaimTicket(channel, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.updateOne({
        channel: channel,
    },{
        $set: {
            claim: false,
            claimDev: ``
        }
    }, async (err,result)=>{
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function closeTicket(channel, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.updateOne({
        channel: channel,
    },{
        $set: {
            isClosed: true,
        }
    }, async (err,result)=>{
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function reopenTicket(channel, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.updateOne({
        channel: channel,
    },{
        $set: {
            isClosed: false,
        }
    }, async (err,result)=>{
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function deleteTicket(channel, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.deleteOne({
        channel: channel,
    }, async (err,result)=>{
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function getClaimsOfUser(user, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.find({
        claimDev: user,
        claim: true,
        isClosed: false,
    }).toArray(async function(err,result){
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function getTicket(channel, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.findOne({
        channel: channel,
    }, async (err,result)=>{
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function getUser(user, callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.findOne({
        user: user,
        isClosed: false,
    }, async (err,result)=>{
        if(err){
            await callback(err,null)
        } else{
            await callback(null,result)
        }
    })
}

function addNewUser(channel, user, callback){
    getTicket(channel,(err,res)=>{
        if(err){

            callback(err,null)
        } else{
            const db = connection.db(dbName)
            const collection = db.collection('tickets')
            if(res.isAdditionalUsers){
                collection.updateOne(
                    {
                        channel: channel,
                    },
                    {
                        $push: {
                            additionalUsers: user
                        },
                    },(err,res)=>{
                        if(err){
                            callback(err,null)
                        } else{
                            callback(null,res)
                        }
                    }
                )
            } else{
                collection.updateOne(
                    {
                        channel: channel,
                    },
                    {
                        $set: {
                            isAdditionalUsers: true,
                            additionalUsers: [user]
                        },
                    },(err,res)=>{
                        if(err){
                            callback(err,null)
                        } else{
                            callback(null,res)
                        }
                    }
                )
            }
        }
    })
}

function getClaimsOfAllUsersWithTickets(callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.find({
        claim: true,
        isClosed: false,
    }).toArray(async function(err, result) {
        if(err){
            await callback(err,null)
        } else{
            const data = []
            for(let ticket of result){
                let found = false
                if(data.length > 0){
                    for(let user of data){
                        if(user.user.id === ticket.claimDev){
                            user.user.channels.push(ticket.channel)
                            found = true
                        }
                    }
                }
                if(found === false){
                    data.push({
                        user: {
                            id: ticket.claimDev,
                            channels: [ticket.channel],
                        }
                    })
                }
            }
            await callback(null,data)
        }
    })
}

function getOpenOrders(callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.find({
       isClosed: false,
        claim: false,
    }).toArray(async function(err, result) {
        if(err){
            await callback(err,null)
        } else{
            const data = []
            for(let ticket of result){
                data.push(ticket.channel)
            }
            await callback(null,data)
        }
    })
}

function getClosedOrders(callback){
    const db = connection.db(dbName)
    const collection = db.collection('tickets')
    collection.find({
        isClosed: true,
    }).toArray(async function(err, result) {
        if(err){
            await callback(err,null)
        } else{
            const data = []
            for(let ticket of result){
                data.push(ticket.channel)
            }
            await callback(null,data)
        }
    })
}

module.exports = {
    addTicket,
    claimTicket,
    unclaimTicket,
    closeTicket,
    reopenTicket,
    deleteTicket,
    getClaimsOfUser,
    getClaimsOfAllUsersWithTickets,
    getTicket,
    addNewUser,
    getOpenOrders,
    getClosedOrders,
    getUser
}