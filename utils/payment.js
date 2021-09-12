const axios = require("axios")

function getPrice(currency,callback){
    axios({
        method: "GET",
        url: `https://api.coinbase.com/v2/prices/${currency}-USD/spot`
    }).then(res=>{
        callback(null,res.data.data.amount)
    }).catch(err=>{
        callback(err,null)
    })
}

function calculateAmount(currency,amount,callback){
    getPrice(currency,(err,price)=>{
        if(err){
            callback(err,null)
        } else{
            callback(null,(parseFloat(amount)/price).toFixed(6))
        }
    })
}

module.exports = {
    calculateAmount
}