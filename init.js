const mongoose = require("mongoose");
const Chat = require("./models/chat");

main()
 .then (() => {
    console.log("connection sucessful");
 })
.catch((err) => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let chats= [
    {
        from: " shiva",
        to:"preeti",
        msg:"send me notes for the exam",
        created_at: new Date(),
    },
    {
        from:"rohit",
        to:"mohit",
        msg:" teach me js callbacks",
        created_at:new Date(),
    },
    {
        from:"sunil",
        to:"kunal",
        msg:"all the best",
        created_at:new Date(),
    },
    {
        from:"anita",
        to:"ramesh",
        msg:"bring me some fruits",
        created_at:new Date(),
    },
    {
        from:"tony",
        to:"peter",
        msg:"love you 3000",
        created_at:new Date(),
    },

];

Chat.insertMany(chats);

