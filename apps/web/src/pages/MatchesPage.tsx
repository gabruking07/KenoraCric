import {useEffect,useState} from "react";
import {CalendarDays} from "lucide-react";
import type {MatchRecord} from "@kenoracric/api-client";
import {api} from "../lib/api";
import {MatchCard} from "../components/cricket/MatchCard";

export function MatchesPage(){
  const [matches,setMatches]=useState<MatchRecord[]>([]);
  useEffect(()=>{api.matches.list().then(setMatches).catch(()=>setMatches([]));},[]);
  return <main className="page"><span className="eyebrow muted">MATCH CENTRE</span><h1>All matches<span>.</span></h1>
    <p className="lead">Live action and upcoming fixtures, supplied by the shared KenoraCric API.</p>
    {matches.length?<div className="match-grid">{matches.map(match=><MatchCard key={match._id} match={match}/>)}
    </div>:<div className="empty-card wide"><CalendarDays/><b>Fixtures will appear here</b><span>Create matches through the API to publish them.</span></div>}
  </main>;
}
