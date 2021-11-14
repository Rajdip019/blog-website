const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Hey this is Rajdeep Sengupta, this is blog website you can use it in your own projects and can improve it and can give a pull request or you can just report a bug. That would be very much helpful.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/post');

const postSchema = {
  postTitle: String,
  postBody: String
}

const Post = mongoose.model("post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, foundPostList) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("home", { homeStartingContent: homeStartingContent, foundPostList: foundPostList });
    }
  })
});



app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent })
})
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent })
})
app.get("/compose", function (req, res) {
  Post.find({}, function (err, foundPostList) {
    if (err) {
      console.log(err);
    }
    else {
      res.render("compose", {foundPostList: foundPostList });
    }
  })
})

app.post("/compose", function (req, res) {
  const postData = new Post({
    postTitle: req.body.postTitle,
    postBody: req.body.postBody
  })
  
  postData.save(function (err) {
    if (!err) {
      console.log("New Post is added.")
      res.redirect("/");
    }
  });
})
app.get('/post/:postName', function (req, res) {
  const postName = req.params.postName;
  Post.findOne({ postTitle: postName }, function (err, foundPostName) {
    const postId = foundPostName._id;
    if(!err){
      Post.findOne({ _id: postId }, function (err, foundPostList) {
        if (err) {
          console.log(err);
        }
        else {
          res.render("post", { title: foundPostList.postTitle, content: foundPostList.postBody })
        }
      })
    }
  })

})
app.post("/delete", function(req,res){
  const deletedPostId = req.body.DeletePostButton;
  Post.findOneAndDelete({_id: deletedPostId}, function(err){
    if(!err){
      console.log("Post is deleted Succesfully")
      res.redirect("/compose");
    }
  });

})



app.listen(3000, function () {
  console.log("Server started on port 3000");
});
