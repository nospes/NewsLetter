const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");
const { dirname } = require("path");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")
});

app.post("/", function (req, res) {
    var FirstName = req.body.firstName
    var LastName = req.body.lastName
    var eMail = req.body.email

    var data = {
        members: [{
            email_address: eMail,
            status: "subscribed",
            merge_fields: {
                FNAME: FirstName,
                LNAME: LastName
            }
        }]
    }

    var jsonData = JSON.stringify(data);

    const url = "https://us20.api.mailchimp.com/3.0/lists/1087fd43a2"

    const options = {
        method: "POST",
        auth: "jose1:fa3607edb2048ccaee00fbf0e06ec8d0-us20"
    }
    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else
        {
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
            console.log(response.statusCode)
        })
    })

    request.write(jsonData);
    request.end();
})


app.post("/failure", function(req,res) {
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});


//api key:fa3607edb2048ccaee00fbf0e06ec8d0-us20

//audiance ID:1087fd43a2