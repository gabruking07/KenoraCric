import type {Server as HttpServer} from "node:http";
import {Server} from "socket.io";

export function configureSockets(server:HttpServer,allowedOrigin:string[]){
  const io=new Server(server,{cors:{origin:allowedOrigin}});
  io.on("connection",socket=>{
    socket.on("match:join",(matchId:string)=>socket.join(`match:${matchId}`));
    socket.on("match:leave",(matchId:string)=>socket.leave(`match:${matchId}`));
  });
  return io;
}
