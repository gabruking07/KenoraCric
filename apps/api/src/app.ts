import express,{type Express} from "express";
import cors from "cors";
import mongoose from "mongoose";
import type {Server} from "socket.io";
import {ZodError} from "zod";
import {authRouter} from "./modules/auth/auth.routes.js";
import {matchesRouter} from "./modules/matches/matches.routes.js";
import {createScoringRouter} from "./modules/scoring/scoring.routes.js";
import {env} from "./config/env.js";

export function configureApp(app:Express,io:Server){
  app.use(cors({origin:env.CLIENT_URL}));
  app.use(express.json({limit:"1mb"}));
  app.get("/health",(_req,res)=>res.json({status:"ok",database:mongoose.connection.readyState===1?"connected":"disconnected"}));
  app.use("/api/v1/auth",authRouter);
  app.use("/api/v1/matches",matchesRouter);
  app.use("/api/v1/matches",createScoringRouter(io));
  app.use((_req,res)=>res.status(404).json({error:"Route not found"}));
  app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
    if(error instanceof ZodError){res.status(400).json({error:error.flatten()});return;}
    if(error&&typeof error==="object"&&"code" in error&&error.code===11000){res.status(409).json({error:"A record with that value already exists"});return;}
    console.error(error);res.status(500).json({error:"Internal server error"});
  });
}
