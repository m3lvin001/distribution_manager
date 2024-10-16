const request = require('request');
const prettyjson = require('prettyjson');


function accessTokenGenerator(req, res, next) {
    let auth = new Buffer.from("i4o58PYkQDfbKjvh9aG6mF50S4mgg7IG:ZaF80wsrJqNF7n2j").toString('base64');
    let url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    request(
        {
            url: url,
            headers: {
                "Authorization": "Basic " + auth
            }
        },
        (error, response) => {
            if (error) throw error;
            console.log(prettyjson.render(response.body))
            req.access_token = JSON.parse(response.body).access_token;
            next();
        }
    )

}
module.exports = {
    accessTokenGenerator
}