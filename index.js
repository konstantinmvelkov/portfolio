var io   = require('socket.io'),
    url  = require('url'),
    express = require('express'),
    http = require('http'),
    path = require('path');
var config = require("./private/config.js");
let fs = require('fs');
let nodemailer = require('nodemailer');
var bodyParser = require('body-parser')
var app = express();
var server = http.createServer(app);
var socket = io.listen(server);
app.use(express.static(path.join(__dirname, '/public')));
app.engine('.html', require('ejs').__express);
app.set('/views', __dirname + 'views');
app.set('view engine', 'html');
app.use(express.json({ limit: '1mb' }));
app.get('/', function(req, res){
    res.render('index');
});
var sent;
app.post('/submit', function (req, res) {
    var maillist = [
        'konstantinmvelkov@gmail.com'
      ];
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.MAIL_ADDRESS,
            pass: process.env.MAIL_SECRET
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: maillist,
        subject: 'Contact from Portfolio from ' + req.body.name,
        text: req.body.comments + ' from ' + req.body.eMail,
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("failed sending an email" + err);
            res.status(201);
            res.end();
        } else {
            console.log("email sent")
            res.status(200);
            res.end();
        }  
    })
})
app.get('/request-cv', function (req, res) {
    var filePath = "./public/Konstantin_Velkov_CV.pdf"; // Or format the path using the `id` rest param
    var fileName = "Konstantin_Velkov.pdf";
    res.download(filePath,fileName);
})
try {
    app.listen(process.env.PORT || 3000)
} catch {
    console.log('an error occured starting the server')
}

