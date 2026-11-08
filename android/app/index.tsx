import {Link} from "expo-router";
import {useEffect,useState} from "react";
import {ScrollView,StyleSheet,Text,View} from "react-native";
import * as SQLite from "expo-sqlite";
import {io} from "socket.io-client";
import type {MatchRecord} from "@kenoracric/api-client";
import {api} from "../src/lib/api";

export default function Home(){
  const [matches,setMatches]=useState<MatchRecord[]>([]);
  const [databaseReady,setDatabaseReady]=useState(false);
  const [error,setError]=useState("");
  const currentMatches=matches.filter(match=>match.status!=="completed");
  const pastMatches=matches.filter(match=>match.status==="completed").sort((a,b)=>Date.parse(b.startAt||"")-Date.parse(a.startAt||""));
  useEffect(()=>{
    const socket=io(api.socketUrl);
    SQLite.openDatabaseAsync("kenoracric.db").then(async database=>{
      await database.execAsync("CREATE TABLE IF NOT EXISTS pending_events (event_id TEXT PRIMARY KEY, match_id TEXT, sequence INTEGER, payload TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);");
      await database.execAsync("CREATE TABLE IF NOT EXISTS mobile_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);");
      setDatabaseReady(true);
    }).catch(()=>setError("Could not open the local database."));
    api.matches.list().then(items=>{
      setMatches(items);
      for(const match of items)socket.emit("match:join",match._id);
    }).catch(()=>setError("Could not reach the KenoraCric server."));
    socket.on("score:update",updated=>setMatches(current=>current.map(match=>match._id===updated._id?updated:match)));
    return()=>{socket.disconnect();};
  },[]);
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Text style={styles.kicker}>KENORATECH / CRICKET, LIVE</Text>
    <Text style={styles.title}>Every Ball.{"\n"}<Text style={styles.gold}>Every Moment.</Text></Text>
    <Text style={styles.copy}>Follow cricket worldwide, from first ball to final result.</Text>
    <Link href="/scoring" style={styles.button}>Open scorer workspace</Link>
    <Text style={styles.heading}>Live & upcoming</Text>
    {currentMatches.map(match=><View key={match._id} style={styles.card}>
      <Text style={styles.status}>{match.status.toUpperCase()} / {match.format}</Text>
      <Text style={styles.team}>{match.teamA} v {match.teamB}</Text>
      <Text style={styles.score}>{match.result?.teamAScore||`${match.innings.runs}/${match.innings.wickets}`} / {match.result?.teamBScore||`${Math.floor(match.innings.legalBalls/6)}.${match.innings.legalBalls%6} overs`}</Text>
      <Text style={styles.copy}>{match.title}{match.venue?" / "+match.venue:""}</Text>
    </View>)}
    {currentMatches.length===0&&<Text style={styles.copy}>{error||"No live or upcoming matches."}</Text>}
    <Text style={styles.heading}>Past matches</Text>
    {pastMatches.map(match=><View key={match._id} style={styles.card}>
      <Text style={styles.status}>COMPLETED / {match.format}</Text>
      <Text style={styles.team}>{match.teamA} v {match.teamB}</Text>
      <Text style={styles.score}>{match.result?`${match.result.teamAScore} v ${match.result.teamBScore}`:`${match.innings.runs}/${match.innings.wickets}`}</Text>
      {match.result&&<Text style={styles.copy}>{match.result.summary}</Text>}
      <Text style={styles.copy}>{match.title}{match.startAt?" / "+new Date(match.startAt).toLocaleDateString():""}</Text>
    </View>)}
    {pastMatches.length===0&&<Text style={styles.copy}>Completed match results will appear here.</Text>}
    <Text style={styles.sync}>{databaseReady?"Local scoring queue ready":"Preparing local database"}</Text>
  </ScrollView>;
}

const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:"#06152e"},content:{padding:24,paddingTop:48},
  kicker:{color:"#ffc928",fontSize:10,letterSpacing:2,fontWeight:"700"},
  title:{color:"#fff",fontSize:42,fontWeight:"800",lineHeight:48,marginTop:20},gold:{color:"#ffc928"},
  copy:{color:"#9eafc5",fontSize:14,lineHeight:22,marginTop:14},
  button:{backgroundColor:"#ffc928",color:"#081932",fontWeight:"700",padding:15,marginTop:24,overflow:"hidden",alignSelf:"flex-start"},
  heading:{color:"#fff",fontSize:22,fontWeight:"700",marginTop:38,marginBottom:14},
  card:{backgroundColor:"#0d2342",borderColor:"#ffffff20",borderWidth:1,padding:18,marginBottom:12},
  status:{color:"#ffc928",fontSize:10,letterSpacing:1,fontWeight:"700"},team:{color:"#fff",fontSize:18,fontWeight:"700",marginTop:14},
  score:{color:"#fff",fontSize:16,fontWeight:"700",marginTop:12},sync:{color:"#6dd1a5",fontSize:11,marginTop:20},
});
