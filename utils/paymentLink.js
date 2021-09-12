const axios = require("axios")

function generateLink(amount,callback){
    axios({
        method: "POST",
        url: "https://paydash.co.uk/api/merchant/create",
        data: {
            "apiKey": "83d49804-cd59-48d7-aaea-b79a36815591",
            "email": "dogzombieyt@gmail.com",
            "amount": parseFloat(amount),
            "webhookURL": "https://google.com",
            "returnURL": "https://fluxhceats.cc",
            "metadata": "none"
        }
    }).then(res=>{
        callback(null,`https://paydash.co.uk/checkout/${res.data.response}`)
    }).catch(err=>{
        callback(err,null)
    })
}

module.exports = {
    generateLink
}