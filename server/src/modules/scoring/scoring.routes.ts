import {Router, type Router as ExpressRouter} from "express";
import type {Server} from "socket.io";
import {scoreSubmissionSchema} from "@kenoracric/contracts";
import {applyDelivery,newInnings} from "@kenoracric/cricket-engine";
import {Match} from "../matches/match.model.js";
import {ScoreEvent} from "./score-event.model.js";
import {requireAuth,requireRole,type AuthenticatedRequest} from "../../middleware/auth.js";
import {asyncHandler} from "../../utils/async-handler.js";

export function createScoringRouter(io:Server):ExpressRouter{
  const router=Router();
  router.post("/:id/events",requireAuth,requireRole("admin","scorer"),asyncHandler(async(req:AuthenticatedRequest,res)=>{
    const input=scoreSubmissionSchema.parse(req.body);
    const match=await Match.findById(req.params.id);
    if(!match){res.status(404).json({error:"Match not found"});return;}
    if(match.scorerId&&match.scorerId.toString()!==req.user?.id&&req.user?.role!=="admin"){
      res.status(403).json({error:"You are not assigned as scorer"});return;
    }
    if(await ScoreEvent.exists({matchId:match.id,eventId:input.eventId})){
      res.json(match);return;
    }
    if(input.sequence!==match.sequence+1){
      res.status(409).json({error:"Sequence conflict",expected:match.sequence+1,received:input.sequence});return;
    }
    await ScoreEvent.create({matchId:match.id,eventId:input.eventId,sequence:input.sequence,payload:input.delivery});
    match.innings=applyDelivery(match.innings as ReturnType<typeof newInnings>,input.delivery);
    match.sequence=input.sequence;
    match.status=match.innings.complete?"completed":"live";
    match.events.push({eventId:input.eventId,sequence:input.sequence,...input.delivery});
    await match.save();
    io.to(`match:${match.id}`).emit("score:update",match);
    res.json(match);
  }));
  return router;
}
