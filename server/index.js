const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./routes/auth");
const documentRouter=require("./routes/document");
const cors=require("cors");
const PORT = process.env.PORT | 3001;
const app = express();
const http = require("http");
mongoose.set("strictQuery", false);
var server = http.createServer(app);
var io = require("socket.io")(server);
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(documentRouter);
const DB = "mongodb://shahzad:test123@ac-whzmyto-shard-00-00.fnuk1tc.mongodb.net:27017,ac-whzmyto-shard-00-01.fnuk1tc.mongodb.net:27017,ac-whzmyto-shard-00-02.fnuk1tc.mongodb.net:27017/?ssl=true&replicaSet=atlas-vahmdy-shard-0&authSource=admin&retryWrites=true&w=majority";

mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection successful!");
  })
  .catch((err) => {
    console.log(err);
  });
  io.on("connection", (socket) => {
    socket.on("join", (documentId) => {
      socket.join(documentId);
    });
  
    socket.on("typing", (data) => {
      socket.broadcast.to(data.room).emit("changes", data);
    });
  
    socket.on("save", (data) => {
      saveData(data);
    });
  });
  
  const saveData = async (data) => {
    let document = await Document.findById(data.room);
    document.content = data.delta;
    document = await document.save();
  };

app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
