const { json } = require("body-parser");
const express = require(`express`);
const request = require(`request`);
const app = express();

// routes
app.get(`/`,(req, res) => {
    res.send("Whatsup Brian!")
})

// access token
app.get(`/access_token`, accesss, (req, res) => {
    res.status(200).json({access_token: req.access_token })
})
function accesss(req, res, next) {
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    let auth = Buffer.from("9rMCDZ0Voejz8NSqiFNbnPVpBPbNm9KOsUhyqztIjegJfzE7:6CRV3txAVmQPmFvs4cOYME7cGXpiE1DiGAVhhaNbUIOZsOwhY2psA8AC93YPlRKt").toString(`base64`);
    
    request(
        {
             url: url,
            headers: {
                 "Authorization": "Basic " + auth
             }
        },
        (error, response, body) => {
             if(error){
                console.log(error)
            }
            else{
                req.access_token = JSON.parse(body).access_token
                next()
            }
        }
    ) 
}

// Register URL
app.get(`/register`, accesss, (req, resp) => {
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    let auth = "Bearer " + req.access_token

    request(
        {
            url: url,
            method: "POST",
            headers: {
                "Authorization": auth
            },
            json: { 
                "ShortCode": "601426",
                "ResponseType": "Completed",
                "ConfirmationURL": "https://flashnet.publicvm.com/confirm",
                "ValidationURL": "https://flashnet.publicvm.com/validate"
            },
            function(error, response, body){
                if(error){ console.log(error)}
                resp.status(200).json(body)
               }
       }
    )
})


// calling my local server url
app.listen(8000, (err, live) => {
    if(err){
        console.error(err)
    }
    else{
        console.log("server running on port 8000")
    }
});

