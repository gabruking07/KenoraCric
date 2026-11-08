import {Activity} from "lucide-react";
import {Link} from "react-router-dom";
import type {MatchRecord} from "@kenoracric/api-client";
import {overs} from "@kenoracric/cricket-engine";

export function MatchCard({match}:{match:MatchRecord}){
  return <Link to={"/matches/"+match._id} className="score-card">
    <div className="card-top"><span className={match.status==="live"?"live-pill":"upcoming-pill"}><i/>{match.status}</span><span>{match.format}</span></div>
    <div className="teams"><div><b>{match.teamA}</b><small>HOME</small></div><strong>{match.innings.runs}<em>/{match.innings.wickets}</em></strong></div>
    <div className="teams"><div><b>{match.teamB}</b><small>AWAY</small></div><span className="team-score">-</span></div>
    <div className="card-foot"><span><Activity size={13}/> {overs(match.innings.legalBalls)} ov</span><span>{match.venue||"Venue TBC"}</span></div>
  </Link>;
}
