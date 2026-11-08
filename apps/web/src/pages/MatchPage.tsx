import {useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";
import {io} from "socket.io-client";
import {overs,runRate} from "@kenoracric/cricket-engine";
import type {MatchRecord} from "@kenoracric/api-client";
import {api,socketUrl} from "../lib/api";

export function MatchPage(){
  const {id=""}=useParams();
  const [match,setMatch]=useState<MatchRecord|null>(null);
  const [error,setError]=useState("");
  useEffect(()=>{
    api.matches.get(id).then(setMatch).catch(reason=>setError(reason instanceof Error?reason.message:"Match unavailable"));
    const socket=io(socketUrl);
    socket.emit("match:join",id);
    socket.on("score:update",setMatch);
    return()=>{socket.emit("match:leave",id);socket.disconnect();};
  },[id]);
  if(!match)return <main className="page"><Link to="/matches">Back to match centre</Link><h2>{error||"Loading match..."}</h2></main>;
  return <main className="page"><Link to="/matches">Back to match centre</Link><div className="match-detail">
    <span className="live-pill"><i/>{match.status}</span><h1>{match.teamA} <span>v</span> {match.teamB}</h1>
    <p>{match.title} / {match.venue} / {match.format}</p>
    <div className="detail-score">{match.innings.runs}/{match.innings.wickets}<small>{overs(match.innings.legalBalls)} overs / RR {runRate(match.innings.runs,match.innings.legalBalls)}</small></div>
    <div className="ball-list"><h3>Recent deliveries</h3>{match.events.slice(-12).reverse().map((event,index)=><span key={event.eventId||index}>{event.runs}{event.wicket?" W":""}</span>)}</div>
  </div></main>;
}
