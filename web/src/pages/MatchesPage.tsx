import {useEffect,useState} from "react";
import {CalendarDays} from "lucide-react";
import type {MatchRecord} from "@kenoracric/api-client";
import {api} from "../lib/api";
import {MatchCard} from "../components/cricket/MatchCard";

export function MatchesPage(){
  const [matches,setMatches]=useState<MatchRecord[]>([]);
  useEffect(()=>{api.matches.list().then(setMatches).catch(()=>setMatches([]));},[]);
  const live=matches.filter(match=>match.status==="live");
  const upcoming=matches.filter(match=>match.status==="scheduled");
  const past=matches.filter(match=>match.status==="completed").sort((a,b)=>Date.parse(b.startAt||"")-Date.parse(a.startAt||""));
  return <main className="page"><span className="eyebrow muted">MATCH CENTRE</span><h1>All matches<span>.</span></h1>
    <p className="lead">Live action, upcoming fixtures, and completed results.</p>
    {live.length>0&&<section className="section"><div className="section-head"><div><span className="eyebrow muted">LIVE NOW</span><h2>Live matches<span>.</span></h2></div></div><div className="match-grid">{live.map(match=><MatchCard key={match._id} match={match}/>)}</div></section>}
    {upcoming.length>0&&<section className="section"><div className="section-head"><div><span className="eyebrow muted">FIXTURES</span><h2>Upcoming matches<span>.</span></h2></div></div><div className="match-grid">{upcoming.map(match=><MatchCard key={match._id} match={match}/>)}</div></section>}
    {past.length>0&&<section className="section"><div className="section-head"><div><span className="eyebrow muted">RESULTS</span><h2>Past matches<span>.</span></h2></div></div><div className="match-grid">{past.map(match=><MatchCard key={match._id} match={match}/>)}</div></section>}
    {matches.length===0&&<div className="empty-card wide"><CalendarDays/><b>Fixtures will appear here</b><span>Create matches through the API to publish them.</span></div>}
  </main>;
}
