import {useEffect,useState,type FormEvent} from "react";
import {applyDelivery,newInnings,overs,runRate,type Innings} from "@kenoracric/cricket-engine";
import type {MatchRecord,ScoreDelivery} from "@kenoracric/api-client";
import {api} from "../lib/api";

export function ScoringPage(){
  const [matches,setMatches]=useState<MatchRecord[]>([]);
  const [selectedId,setSelectedId]=useState("");
  const [innings,setInnings]=useState<Innings>(newInnings());
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [token,setToken]=useState(()=>localStorage.getItem("kc_token")||"");
  const [message,setMessage]=useState("Ready");
  const selected=matches.find(match=>match._id===selectedId);

  useEffect(()=>{api.matches.list().then(setMatches).catch(()=>setMessage("Could not load matches."));},[]);
  function selectMatch(id:string){
    setSelectedId(id);
    const match=matches.find(item=>item._id===id);
    if(match)setInnings(match.innings);
    else setInnings(newInnings());
  }
  async function signIn(event:FormEvent){
    event.preventDefault();
    try{
      const session=await api.auth.login({email,password});
      if(session.user.role!=="scorer"&&session.user.role!=="admin"){setMessage("This account does not have scorer permissions.");return;}
      localStorage.setItem("kc_token",session.token);setToken(session.token);setPassword("");setMessage("Signed in as "+session.user.name+".");
    }catch(reason){setMessage(reason instanceof Error?reason.message:"Sign-in failed.");}
  }
  async function score(delivery:ScoreDelivery){
    if(!selected){setMessage("Choose a match first.");return;}
    if(!token){setMessage("Sign in with an assigned scorer account before scoring.");return;}
    const next=applyDelivery(innings,delivery);
    const event={eventId:crypto.randomUUID(),sequence:selected.sequence+1,delivery};
    setInnings(next);setMessage("Syncing delivery...");
    try{
      const updated=await api.scoring.submit(selected._id,event,token);
      setMatches(current=>current.map(match=>match._id===updated._id?updated:match));
      setMessage("Delivery synced.");
    }catch(reason){setMessage(reason instanceof Error?reason.message:"Scoring request failed.");}
  }
  function signOut(){localStorage.removeItem("kc_token");setToken("");setMessage("Signed out.");}

  return <main className="page scorer"><span className="eyebrow muted">SCORER WORKSPACE</span><h1>Live scoring<span>.</span></h1>
    <p className="lead">Use the same scorer account and API as the Android app.</p>
    {!token?<form className="token-form" onSubmit={signIn}>
      <label>Email<input type="email" value={email} onChange={event=>setEmail(event.target.value)} required/></label>
      <label>Password<input type="password" value={password} onChange={event=>setPassword(event.target.value)} required/></label>
      <button className="button small">Sign in</button>
    </form>:<div className="scorer-auth"><span>{message}</span><button onClick={signOut}>Sign out</button></div>}
    <label className="select-label">Select match<select value={selectedId} onChange={event=>selectMatch(event.target.value)}>
      <option value="">Choose a match</option>{matches.map(match=><option key={match._id} value={match._id}>{match.teamA} v {match.teamB} / {match.status}</option>)}
    </select></label>
    <div className="scorer-board"><div className="scorer-score"><span>{message}</span><strong>{innings.runs}<small>/{innings.wickets}</small></strong><b>{overs(innings.legalBalls)} <small>overs</small></b><em>RR {runRate(innings.runs,innings.legalBalls)}</em></div>
      <div className="run-buttons">{[0,1,2,3,4,6].map(runs=><button key={runs} onClick={()=>score({runs})}>{runs===0?"DOT":runs}</button>)}</div>
      <div className="extra-buttons"><button onClick={()=>score({runs:0,extra:"wides"})}>Wide</button><button onClick={()=>score({runs:0,extra:"noBalls"})}>No ball</button><button onClick={()=>score({runs:1,extra:"byes"})}>Bye</button><button onClick={()=>score({runs:1,extra:"legByes"})}>Leg bye</button><button className="wicket" onClick={()=>score({runs:0,wicket:"bowled"})}>Wicket</button></div>
      <div className="recent">Current over <b>{innings.balls.slice(-6).map(ball=>ball.wicket?"W":ball.extra?"E":ball.runs).join(" / ")||"No deliveries yet"}</b></div>
    </div>
  </main>;
}
