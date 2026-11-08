import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {resolve} from "node:path";
import {User} from "../dist/modules/users/user.model.js";
import {Match} from "../dist/modules/matches/match.model.js";

dotenv.config({path:resolve(process.cwd(),"server/.env")});

const email=process.env.DEMO_USER_EMAIL?.trim().toLowerCase();
const password=process.env.DEMO_USER_PASSWORD;
const name=process.env.DEMO_USER_NAME?.trim()||"Raj Patel";
if(!email||!password||password.length<10)throw new Error("Set DEMO_USER_EMAIL and a DEMO_USER_PASSWORD of at least 10 characters.");
const uri=process.env.MONGODB_URI;
if(!uri)throw new Error("MONGODB_URI is missing from server/.env.");
const host=uri.match(/^mongodb(?:\+srv)?:\/\/([^/@]+@)?([^/:?]+)/)?.[2];
const localHosts=["localhost","127.0.0.1","::1"];
if(host&&!localHosts.includes(host)&&process.env.ALLOW_REMOTE_SEED!=="1"){
  throw new Error("This database is remote. Set ALLOW_REMOTE_SEED=1 explicitly to seed it.");
}

const now=Date.now();
const days=(offset)=>new Date(now+offset*24*60*60*1000);
const emptyInnings=()=>({runs:0,wickets:0,legalBalls:0,extras:{wides:0,noBalls:0,byes:0,legByes:0,penalties:0},balls:[],complete:false,freeHit:false});
const completedInnings=(runs,wickets,legalBalls)=>({runs,wickets,legalBalls,extras:{wides:0,noBalls:0,byes:0,legByes:0,penalties:0},balls:[],complete:true,freeHit:false});

const past=[
  {title:"DEMO · Kenora Premier League Final",teamA:"Kenora Strikers",teamB:"Lakeview Lions",venue:"Kenora Community Ground",startAt:days(-18),teamAScore:"164/6",teamBScore:"152/8",summary:"Kenora Strikers won by 12 runs",runs:164,wickets:6,legalBalls:120},
  {title:"DEMO · Riverside T20",teamA:"North Star XI",teamB:"Lakeside Warriors",venue:"Riverside Oval",startAt:days(-12),teamAScore:"142/7",teamBScore:"143/5",summary:"Lakeside Warriors won by 5 wickets",runs:142,wickets:7,legalBalls:120},
  {title:"DEMO · Autumn Cup Match",teamA:"Maple XI",teamB:"Harbor Hawks",venue:"Maple Park",startAt:days(-6),teamAScore:"177/5",teamBScore:"173/9",summary:"Maple XI won by 4 runs",runs:177,wickets:5,legalBalls:120},
];
const upcoming=[
  {title:"DEMO · Kenora Premier League",teamA:"Kenora Strikers",teamB:"Lakeside Warriors",venue:"Kenora Community Ground",startAt:days(3)},
  {title:"DEMO · Riverside T20 Fixture",teamA:"Lakeview Lions",teamB:"North Star XI",venue:"Riverside Oval",startAt:days(7)},
  {title:"DEMO · Autumn Cup",teamA:"Harbor Hawks",teamB:"Maple XI",venue:"Maple Park",startAt:days(10)},
];

try{
  await mongoose.connect(uri);
  let user=await User.findOne({email});
  if(user){
    if(!await bcrypt.compare(password,user.passwordHash))throw new Error("That email already exists, but the supplied password does not match. No account or match data was changed.");
    if(user.role!=="admin")user.role="scorer";
    user.name=name;
    await user.save();
  }else{
    user=await User.create({name,email,passwordHash:await bcrypt.hash(password,12),role:"scorer"});
  }

  for(const fixture of past){
    const {teamAScore,teamBScore,summary,runs,wickets,legalBalls,...match}=fixture;
    await Match.updateOne({title:match.title},{$set:{...match,format:"T20",oversLimit:20,status:"completed",scorerId:user._id,innings:completedInnings(runs,wickets,legalBalls),events:[],sequence:0,result:{teamAScore,teamBScore,summary}}},{upsert:true});
  }
  for(const match of upcoming){
    await Match.updateOne({title:match.title},{$set:{...match,format:"T20",oversLimit:20,status:"scheduled",scorerId:user._id,innings:emptyInnings(),events:[],sequence:0},$unset:{result:""}},{upsert:true});
  }
  console.info(`Scorer account ready: ${email}`);
  console.info(`Demo match data ready: ${past.length} completed results and ${upcoming.length} upcoming fixtures.`);
}finally{
  await mongoose.disconnect();
}
