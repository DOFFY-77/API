const express = require("express");
const bodyparser = require("body-parser");
const jsonfile = require("jsonfile");
const db = require("./db/db.json");
const app = express();
const port = process.env.PORT || 3000;

//APIs will be here ...

app.listen(port, () => {
console.log( `${port} is running ... `);
});

app.use(bodyparser.urlencoded({extended: true}));
app.use('/public',express.static(process.cwd() + '/public'));

app.get("/", (req, res) => {
    res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/posts", (req, res) => {
    res.json(db);
});

app.get('/posts/:id', (req, res)=>{
    let id = req.params.id;
    let post = db.find((post)=> post.id == id);
    if(!post){
        res.json({Message: 'Not Found Any Post Related to your ID'});
    } else {
        res.json(post);
    }
} );

app.post("/posts-author/:author", (req, res) => {
    let author = req.params.author;
    let posts = db.find((post)=> post.author == author);
    if(!posts){
        res.json({Message: `No Posts Found Against This Author ${author}`});
    } else {
        res.json(posts);
    }
});

app.get('/postform', (req, res ) => {
    res.sendFile(process.cwd() + "/views/postform.html")
});

app.get('/updateform', (req, res ) => {
    res.sendFile(process.cwd() + "/views/updateform.html")
});


app. post("/newpost", (req, res) => {
    const newPost = {
    id: db.length + 1,
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body. tags.split(","),
    };
    db.push(newPost);
    jsonfile.writeFile("./db/db.json", db, (err) => {
    if (err) {
    console.error(err);
    res. json({ message: "Error writing to database" });
    } else {
    res.json({
    message: `Post added successfully! Your Post Id is ${newPost.id}`,
    });
}
});
});

app.post("/updatepost", (req, res) => {
    let id = req.body.id;
    let post = db.find((post) => post.id == id);
    if (!post) {
    res.status(404).json({ message: "Not Found Any Post Related to Your ID" });
    } else {
    post.title = req.body.title;
    post.content = req.body. content;
    post.category = req.body. category;
    post.tags = req.body.tags.split(",");
    jsonfile.writeFile("./db/db.json", db, (err) => {
    if (err) {
    console.error(err);
    res.status(500). json({ message: "Error writing to database" });
    } else {
    res. json({
    message: `Post updated successfully! Your Post Id is ${id} `,
    });
    }
    });
    }
});


app.delete("/deletepost/:id", (req, res) => {
    const id = req.params.id;
    const post = db.find((post) => post.id == id);
    if (!post) {
    res.status(404).json({ message: "Not Found Any Post Related to Your ID" });
    } else {
    db.splice(db.indexOf(post), 1);
    jsonfile.writeFile("./db/db.json", db, (err) => {
    if (err) {
    console.error(err);
    res.status(500). json({ message: "Error writing to database" });
    } else {
    res. json({
    message: `Post deleted successfully! Your Post Id is ${id} `,
    });
    }
    });
    }
});