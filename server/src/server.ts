import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import {createServer} from "node:http";
import {configureApp} from "./app.js";
import {env} from "./config/env.js";
import {connectDatabase} from "./database/connect.js";
import {configureSockets} from "./sockets/index.js";

await connectDatabase(env.MONGODB_URI);
const app=express();
const httpServer=createServer(app);
const io=configureSockets(httpServer,env.CLIENT_URL);
configureApp(app,io);
httpServer.listen(env.PORT,()=>console.info(`KenoraCric API listening on port ${env.PORT}`));

async function shutdown(){
  io.close(async()=>{
    await mongoose.disconnect();
    process.exit(0);
  });
}
process.once("SIGINT",shutdown);
process.once("SIGTERM",shutdown);
