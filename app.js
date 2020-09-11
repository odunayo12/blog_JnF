const express = require("express");
const sendMail = require('./mail');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const moment = require('moment');

const app = express();
const port = 3000

app.set('view engine', 'ejs');
app.use(express.static('css'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
// for nodemailer
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/cresourceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

//comment Data Model
const commentSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        trim: true,
    },
    commentText: String,
    comment_date_posted: {
        type: Date,
        default: Date.now(),
    },
});
//commentSchema.index({ commentText: 1 }, { unique: true });
const Comment = mongoose.model("Comment", commentSchema);


//Compose Post Data Model
const composeSchema = new mongoose.Schema({
    compiled_by: {
        _title: String,
        _FName: String,
        _LName: String,
        _email: {
            type: String,
            trim: true,
        },
    },
    section: String,
    author: {
        _title: String,
        _FName: String,
        _LName: String,
    },
    tags: [String],
    date_posted: {
        type: Date,
        default: Date.now(),
    },
    post_body: {
        _title: String,
        _intro: String,
        link: String,
        _body: String,
        _cover_page_url: {
            type: String,
            trim: true,
        },
    },
    commentGenerated: [commentSchema]
});

composeSchema.index({ post_body: 1 }, { unique: true });

const Blogpost = mongoose.model("Blogpost", composeSchema);


// home route
app.get('/', (req, res) => {
    // res.sendFile(`${__dirname}/index.copy.html`);
    Blogpost.find({}, function(err, posts) {
        const currentDate = moment();
        const todaysMonth = (currentDate.month());
        // posts.date_posted.forEach(element => {
        //     console.log(moment.utc(element).format("h:mm"));
        // });



        res.render("home", {
            posts: posts,
            todaysMonth: todaysMonth,
        });
    });
});


// compose page route
app.get('/compose', (req, res) => {
    res.render('compose');

}).post('/compose', (req, res) => {

    const postentry = new Blogpost({
        compiled_by: {
            _title: req.body.composerTitle,
            _FName: req.body.composerFName,
            _LName: req.body.composerLName,
            _email: req.body.composerEmail
        },
        section: req.body.sectionRadios,
        author: {
            _title: req.body.authorTitle,
            _FName: req.body.authorFName,
            _LName: req.body.authorLName
        },
        date_posted: new Date,
        tags: req.body.inputTag,
        post_body: {
            _title: req.body.postTitle,
            _intro: req.body.introTextArea,
            link: req.body.linkTextAtrea,
            _body: req.body.postTextAtrea,
            _cover_page_url: req.body.imageLinkText
        }
    });


    postentry.save(function(err) {
        if (!err) {
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});

//post-page route

app.get("/posts/:postID/:tags", (req, res) => {
    const requestedPostId = req.params.postID;
    const requestedTags = req.params.tags;
    console.log(requestedPostId, requestedTags);

    Blogpost.findOne({ _id: requestedPostId }, function(err, postContent) {
        if (!err) {
            res.render("post", {
                postContent: postContent,
            });

        } else {
            console.log(`Here is the error: ${err}`);
        }
    });
    // res.sendFile(`${__dirname}/post-page.html`)
}).post("/posts/:postID/:tags", (req, res) => {
    const commentEntry = new Comment({
        name: req.body.senderName,
        email: req.body.senderEMail,
        commentText: req.body.senderComment,
        comment_date_posted: new Date(),
    });

    commentEntry.save(function(err) {
        if (!err) {
            res.redirect("/posts");
        } else {
            console.log(err);
        }
    });
    console.log("Data: ", req.body, commentEntry);
    // set it to sendMail.js
    const { senderName, senderEMail, senderComment } = req.body;
    // FIXME  res.redirect('/');
    sendMail(senderEMail, senderName, senderComment, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Message sent");
            res.redirect("/");
        }
    });
});


// TODO: Create parameter route that take the app id and displays it on a templated post Page
// create about and contact routes
// app.get('/posts', (req, res) => {
//     res.render('post');
// });
app.listen(port, function() {
    console.log(`Server Starts on ${port}`);
});