import {Schema,model} from "mongoose";

const scoreEventSchema=new Schema({
  matchId:{type:Schema.Types.ObjectId,required:true,index:true},
  eventId:{type:String,required:true},
  sequence:{type:Number,required:true},
  payload:{type:Schema.Types.Mixed,required:true},
},{timestamps:true});
scoreEventSchema.index({matchId:1,eventId:1},{unique:true});

export const ScoreEvent=model("ScoreEvent",scoreEventSchema);
