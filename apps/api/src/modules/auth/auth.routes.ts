import {Router, type Router as ExpressRouter} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {loginSchema,registerSchema} from "@kenoracric/contracts";
import {User} from "../users/user.model.js";
import {env} from "../../config/env.js";
import {asyncHandler} from "../../utils/async-handler.js";

export const authRouter:ExpressRouter=Router();

authRouter.post("/register",asyncHandler(async(req,res)=>{
  const input=registerSchema.parse(req.body);
  const passwordHash=await bcrypt.hash(input.password,12);
  const user=await User.create({...input,email:input.email.toLowerCase(),passwordHash});
  res.status(201).json({user:{id:user.id,name:user.name,email:user.email,role:user.role}});
}));

authRouter.post("/login",asyncHandler(async(req,res)=>{
  const input=loginSchema.parse(req.body);
  const user=await User.findOne({email:input.email.toLowerCase()});
  if(!user||!await bcrypt.compare(input.password,user.passwordHash)){res.status(401).json({error:"Email or password is incorrect"});return;}
  const token=jwt.sign({id:user.id,role:user.role},env.JWT_ACCESS_SECRET,{expiresIn:"8h"});
  res.json({token,user:{id:user.id,name:user.name,email:user.email,role:user.role}});
}));
