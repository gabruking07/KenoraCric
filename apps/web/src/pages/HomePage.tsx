import {useEffect,useState} from "react";
import {Activity,ArrowRight,BarChart3,Radio,Trophy,Wifi} from "lucide-react";
import {Link} from "react-router-dom";
import {overs,runRate} from "@kenoracric/cricket-engine";
import type {MatchRecord} from "@kenoracric/api-client";
import {api} from "../lib/api";
import {MatchCard} from "../components/cricket/MatchCard";
import {SiteFooter} from "../components/layout/SiteFooter";

export function HomePage(){
  const [matches,setMatches]=useState<MatchRecord[]>([]);
  useEffect(()=>{api.matches.list().then(setMatches).catch(()=>setMatches([]));},[]);
  const live=matches.filter(match=>match.status==="live");
  const upcoming=matches.filter(match=>match.status==="scheduled");
  const featured=live[0];
  const score=featured?featured.innings.runs+"/"+featured.innings.wickets:"-";
  return <>
    <section className="hero"><div className="hero-glow"/><div className="hero-copy">
      <span className="eyebrow"><span className="gold-dot"/> THE GAME, IN REAL TIME</span><h1>Every ball.<br/><span>Every moment.</span></h1>
      <p>Follow the pulse of cricket worldwide. Live scores, tournament stories and the numbers that define the game.</p>
      <div className="hero-buttons"><Link className="button" to="/matches"><Radio size={16}/> Explore cricket <ArrowRight size={16}/></Link><Link className="text-link" to="/tournaments">Discover tournaments <ArrowRight size={15}/></Link></div>
      <div className="hero-proof"><span>KenoraCric match centre</span><span className="proof-divider"/><span className="online"><Wifi size={13}/> LIVE COVERAGE</span></div>
    </div>
    <div className="hero-score"><div className="broadcast-label"><span className="live-pill"><i/>{featured?"LIVE NOW":"MATCH CENTRE"}</span><span>{featured?.format||"CRICKET"}</span></div>
      <div className="hero-match-title">{featured?.title||"Follow every fixture"}<small>{featured?.venue||"KENORACRIC MATCH CENTRE"}</small></div>
      <div className="hero-sides"><div className="side"><div className="flag india">A</div><b>{featured?.teamA||"TEAM A"}</b><small>HOME</small></div>
        <strong className="hero-score-num">{score}<small>{featured?overs(featured.innings.legalBalls)+" OVERS":"LIVE SCORE"}</small></strong>
        <div className="side"><div className="flag aus">B</div><b>{featured?.teamB||"TEAM B"}</b><small>AWAY</small></div>
      </div>
      <div className="match-state"><span>{featured?.title||"Live scores and upcoming fixtures"}</span><b>{featured?.status||"No live match"}</b></div>
      <div className="runline"><span>RUN RATE<b>{featured?runRate(featured.innings.runs,featured.innings.legalBalls):"-"}</b></span><span>OVERS<b>{featured?overs(featured.innings.legalBalls):"-"}</b></span><span>EVENTS<b>{featured?.sequence??"-"}</b></span></div>
      <Link className="hero-card-link" to="/matches">Open match centre <ArrowRight size={14}/></Link>
    </div><div className="hero-index">01 <span/> 04</div></section>
    <section className="ticker"><span className="ticker-label"><Radio size={13}/> MATCH CENTRE</span><span className="tick-text">{featured?featured.teamA+" "+score+" ("+overs(featured.innings.legalBalls)+") v "+featured.teamB:"Live match updates appear here when available."}</span><Link to="/matches">All scores <ArrowRight size={14}/></Link></section>
    <main><section className="section"><div className="section-head"><div><span className="eyebrow muted">THE ACTION</span><h2>Cricket, as it happens<span>.</span></h2></div><Link className="section-link" to="/matches">View match centre <ArrowRight size={15}/></Link></div>
      <div className="match-grid">{live.slice(0,3).map(match=><MatchCard key={match._id} match={match}/>)}{upcoming.slice(0,1).map(match=><MatchCard key={match._id} match={match}/>)}
        {matches.length===0&&<div className="empty-card wide"><span className="live-icon"><Radio/></span><b>No published matches yet</b><span>Create a match through the shared API to show it here.</span></div>}
      </div>
    </section>
    <section className="feature-band"><div><span className="eyebrow muted">BUILT FOR THE GAME</span><h2>More than a score.<br/><span>The whole story.</span></h2><p>From the first toss to the final over, see cricket with the clarity and detail it deserves.</p><Link className="button outline" to="/features">Explore the platform <ArrowRight size={15}/></Link></div>
      <div className="feature-list"><article><span><Activity/></span><div><b>Ball by ball</b><small>Every delivery, decision and turning point in real time.</small></div></article><article><span><Trophy/></span><div><b>Every competition</b><small>Follow leagues, international tours and the road to finals.</small></div></article><article><span><BarChart3/></span><div><b>Numbers with meaning</b><small>Player form and statistics that tell the story.</small></div></article></div>
    </section></main><SiteFooter/>
  </>;
}
