import {Schema,model} from "mongoose";
import {newInnings} from "@kenoracric/cricket-engine";

const matchSchema=new Schema({
  title:{type:String,required:true,trim:true},
  teamA:{type:String,required:true,trim:true},
  teamB:{type:String,required:true,trim:true},
  venue:{type:String,trim:true},
  format:{type:String,enum:["T10","T20","ODI","Test","Custom"],default:"T20"},
  oversLimit:{type:Number,default:20,min:1,max:90},
  startAt:Date,
  status:{type:String,enum:["scheduled","live","completed","abandoned"],default:"scheduled"},
  scorerId:Schema.Types.ObjectId,
  innings:{type:Schema.Types.Mixed,default:()=>newInnings()},
  events:{type:[Schema.Types.Mixed],default:[]},
  sequence:{type:Number,default:0,min:0},
},{timestamps:true});

export const Match=model("Match",matchSchema);
