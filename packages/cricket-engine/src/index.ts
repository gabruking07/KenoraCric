export type Extras = { wides:number; noBalls:number; byes:number; legByes:number; penalties:number };
export type Dismissal = "bowled"|"caught"|"lbw"|"stumped"|"run_out"|"hit_wicket"|"retired_hurt"|"retired_out"|"obstructing"|"hit_twice"|"timed_out";
export type Delivery = { runs:number; batterRuns?:number; extra?:keyof Extras; extraRuns?:number; wicket?:Dismissal; legal?:boolean };
export type Innings = { runs:number; wickets:number; legalBalls:number; extras:Extras; balls:Delivery[]; target?:number; complete:boolean; freeHit:boolean };
export const newInnings = (target?:number):Innings => ({runs:0,wickets:0,legalBalls:0,extras:{wides:0,noBalls:0,byes:0,legByes:0,penalties:0},balls:[],target,complete:false,freeHit:false});
export const overs = (balls:number) => `${Math.floor(balls/6)}.${balls%6}`;
export const runRate = (runs:number, balls:number) => balls ? Number((runs*6/balls).toFixed(2)) : 0;
export function applyDelivery(state:Innings, d:Delivery):Innings {
 if(state.complete) throw new Error("Innings is complete");
 if(!Number.isInteger(d.runs)||d.runs<0||d.runs>7) throw new Error("Runs must be an integer from 0 to 7");
 const extraRuns=d.extraRuns??(d.extra==="wides"||d.extra==="noBalls"?1:0);
 if(!Number.isInteger(extraRuns)||extraRuns<0) throw new Error("Invalid extra runs");
 const legal=d.legal??(!d.extra||!(["wides","noBalls"] as const).includes(d.extra as "wides"|"noBalls"));
 const extras={...state.extras}; if(d.extra) extras[d.extra]+=extraRuns || d.runs;
 const runs=d.runs+extraRuns;
 const legalBalls=state.legalBalls+(legal?1:0);
 const wicket=d.wicket && d.wicket!=="retired_hurt" ? 1:0;
 const balls=[...state.balls,{...d,legal,extraRuns}];
 const next={...state,runs:state.runs+runs,wickets:state.wickets+wicket,legalBalls,extras,balls,freeHit:d.extra==="noBalls"};
 next.complete=next.wickets>=10 || (next.target!==undefined&&next.runs>=next.target);
 return next;
}
export function undoDelivery(state:Innings):Innings {
 if(!state.balls.length) throw new Error("No delivery to undo");
 return state.balls.slice(0,-1).reduce((s,b)=>applyDelivery(s,b),newInnings(state.target));
}
