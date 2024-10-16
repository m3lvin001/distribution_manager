const request = require("request");
const prettyjson = require('prettyjson');

function stkPush(req, res, next) {
    console.log(req.body);
    let phone = req.body.phone;
    let amount = req.body.amount;
    let businessNumber = req.body.businessNumber;

    //trims phone in the format of 254799623291
    if (String(phone).length === 13) {
        phone = String(phone).slice(1);
    } else if (String(phone).length === 10) {
        phone = "254" + String(phone).slice(1);
    } else {
        phone = phone;
    }

    const endpoint =
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    //outputs timestamp in the required format
    let t = new Date();
    let formattedMonth = `${Number(t.getMonth() + 1 < 10) ? "0" + (t.getMonth() + 1) : "" + Number(t.getMonth() + 1)
        }`;
    let formattedDate = `${t.getDate() < 10 ? "0" + t.getDate() : "" + t.getDate()
        }`;
    let formattedHours = `${t.getHours() < 10 ? "0" + t.getHours() : "" + t.getHours()
        }`;
    let formattedMinutes = `${t.getMinutes() < 10 ? "0" + t.getMinutes() : "" + t.getMinutes()
        }`;
    let formattedSeconds = `${t.getSeconds() < 10 ? "0" + t.getSeconds() : "" + t.getSeconds()
        }`;

    let timestamp = `${t.getFullYear()}${formattedMonth}${formattedDate}${formattedHours}${formattedMinutes}${formattedSeconds}`;
    let password = new Buffer.from(
        "174379" +
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
        timestamp
    ).toString("base64");
    console.log(prettyjson.render({ Timestamp: timestamp }));

    request(
        {
            method: "POST",
            url: endpoint,
            headers: {
                Authorization: "Bearer " + req.access_token,
            },
            json: {
                BusinessShortCode: `${businessNumber}`,
                Password: password,
                Timestamp: timestamp,
                TransactionType: "CustomerPayBillOnline",
                Amount: `${amount}`,
                PartyA: `${phone}`,
                PartyB: `${businessNumber}`,
                PhoneNumber: `${phone}`,
                CallBackURL: "https://72c1-41-212-9-77.ngrok.io/stk_callback",
                AccountReference: "NEWSPAPER DISTRIBUTION",
                TransactionDesc: "FARE",
            },
        },
        function (error, response) {
            if (error) throw error;
            console.log(prettyjson.render(response.body));
            console.log("\n");
            console.log(prettyjson.render(req.body));
        }
    );
}

module.exports = {
    stkPush,
};
