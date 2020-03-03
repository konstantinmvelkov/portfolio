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
app.post('/submit', function (req, res) {
    console.log(req.body.name);
    var maillist = [
        'konstantinmvelkov@gmail.com',
        req.body.eMail
      ];
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'studentlivingnl@gmail.com',
            pass: 'SLnetherlands'
        }
    });
    let mailOptions = {
        from: 'studentlivingnl@gmail.com',
        to: maillist,
        subject: 'Contact from Portfolio from ' + req.body.name,
        text: req.body.comments + ' from ' + req.body.eMail,
    };
    var sent;
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log("failed sending an email" + err);
            sent=false;
        } else {
            console.log("email sent")
            sent=true;
        }
        console.log(sent);
        res.end(sent);
    })

    //res.end(sent);
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

