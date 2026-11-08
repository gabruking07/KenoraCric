import {Router, type Router as ExpressRouter} from "express";
import {createMatchSchema} from "@kenoracric/contracts";
import {Match} from "./match.model.js";
import {requireAuth,requireRole,type AuthenticatedRequest} from "../../middleware/auth.js";
import {asyncHandler} from "../../utils/async-handler.js";

export const matchesRouter:ExpressRouter=Router();
matchesRouter.get("/",asyncHandler(async(_req,res)=>{
  const matches=await Match.find().sort({startAt:1}).lean();res.json(matches);
}));

matchesRouter.get("/:id",asyncHandler(async(req,res)=>{
  const match=await Match.findById(req.params.id);
  if(!match){res.status(404).json({error:"Match not found"});return;}
  res.json(match);
}));

matchesRouter.post("/",requireAuth,requireRole("admin","scorer"),asyncHandler(async(req:AuthenticatedRequest,res)=>{
  const input=createMatchSchema.parse(req.body);
  const match=await Match.create({...input,scorerId:req.user?.id});
  res.status(201).json(match);
}));
