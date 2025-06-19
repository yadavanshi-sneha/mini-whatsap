const express = require("express"); // mongoose for mongodb connection.
const app = express();
const mongoose = require('mongoose'); 
//const chatId = req.params.id;  // or 
// wherever you're getting the ID
//const objectId = new
//mongoose.Types.ObjectId(chatId);
// Use objectId in your Mongoose query 
//const chat = await 
//Chat.findById(objectId);
const path = require("path");  // path module for working with file paths
const Chat = require("./models/chat.js");   // importing a chat model
const methodOverride = require("method-override");// middleware to override HTTP methods.
const ExpressError = require("./ExpressError");


app.set("views", path.join(__dirname, "views"));   // setting the views diretory
app.set("view engine","ejs");   // setting ejs as the templating engine
app.use(express.static(path.join( __dirname,"public"))); // serve static files
app.use(express.urlencoded({extended: true})); // parsing url - encoded data .
app.use(methodOverride("_method")); // Enabling method override.

main()
 .then (() => {
    console.log("connection sucessful");
 })
.catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}
  
// using wrap async for errors
 function asyncWrap(fn) {
     return function( req, res,next) {
       fn(req,res,next).catch((err)=> next(err));
     };
 }

// NEW = show route
app.get("/chats/:id",asyncWrap(async ( req,res,next)  =>   {
    let { id} = req.params;
    let chat = await Chat.findById(id); // find chat from the database.
     if ( !chat){
      next(new ExpressError(500, " Chat not found"));
  }
    res.render( "edit.ejs", { chat});

}));


// Index Route
app.get("/chats", async (req,res) => {
   let chats = await Chat.find();
  // console.log(chats);
   //nores.send("working");
   res.render("index.ejs" , {chats});
});

//NEW ROUTE
app.get("/chats/new", (req,res) => {
  // throw new ExpressError( 404, " Page not found");
    res.render("new.ejs");
});

//CREATE ROUTE
app.post("/chats", asyncWrap(async(req,res, next)  => {
   console.log(req);
   let { from, to, message } = req.body;
   let newChat =  new Chat({
       from: from,
       to: to,
       message: message,
       created_at: new Date(),
   });
   await newChat.save();
   res.redirect("/chats");
}));


// Edit Route
 app.get("/chats/:id/edit", async (req,res)  => {
   try{
   let { id } =req.params;
    let chat = await Chat.findById(id);
    console.log(chat);
    res.render("edit.ejs", {chat});
}  catch(err) {
   next(err);
} 
 });

//Update Route

app.put("/chats/:id", async  (req,res)  => {
   try{
       let { id } = req.params;
   let { msg: newMsg} = req.body;
   console.log(newMsg);
   let updatedChat = await  Chat.findByIdAndUpdate(
      id, 
      { msg: newMsg },
      { runValidators: true, new:true }           
);

console.log(updatedChat);
res.redirect("/chats");
   } catch(err) {
     next(err);
   }
});

//Destroy Route
app.delete("/chats/:id",asyncWrap(async (req,res) => {
       let { id } = req.params;
   let deletedChat =  await Chat.findByIdAndDelete(id);
   console.log(`deleted : ${chat}`);
   res.redirect("/chats");
}));



app.get("/",(req,res) => {
    res.send("root is working");
});

// 
app.use(( err,req,res,next)  => {
   console.log( err.name);
   next(err);
});
   
// validation error
const handleValidationErr = (err) => {
     console.log("this was a Validation error. Please follow rules");
     return err;
    }


// for errors  ......<>.....
app.use((err,req,res,next) =>  {
   console.log(err.name);
   if(err.name === "ValidationError") {
       console.log("This was a Validation error . please follow rules");
   }
   next(err);
});

// error - handling middleware
app.use(( err,req,res,next) => {
   let { status = 500,message = " Some Error Occured" } = err;
   res.status( status).send( message);
});

app.listen(8080,()  => {
    console.log("server is listening on port 8080");
});