import type {NextFunction,Request,Response} from "express";
import jwt from "jsonwebtoken";
import {env} from "../config/env.js";

export type AuthenticatedUser={id:string;role:string};
export type AuthenticatedRequest=Request&{user?:AuthenticatedUser};

export function requireAuth(req:AuthenticatedRequest,res:Response,next:NextFunction):void{
  const token=req.headers.authorization?.replace(/^Bearer\s+/i,"");
  if(!token){res.status(401).json({error:"Authentication required"});return;}
  try{req.user=jwt.verify(token,env.JWT_ACCESS_SECRET) as AuthenticatedUser;next();}
  catch{res.status(401).json({error:"Invalid or expired token"});}
}

export function requireRole(...roles:string[]){
  return (req:AuthenticatedRequest,res:Response,next:NextFunction):void=>{
    if(!req.user||!roles.includes(req.user.role)){res.status(403).json({error:"Insufficient permissions"});return;}
    next();
  };
}
