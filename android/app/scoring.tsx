import {useEffect,useState} from "react";
import {Pressable,ScrollView,StyleSheet,Text,TextInput,View} from "react-native";
import * as SQLite from "expo-sqlite";
import {io} from "socket.io-client";
import {applyDelivery,newInnings,overs,type Innings} from "@kenoracric/cricket-engine";
import type {MatchRecord,ScoreDelivery} from "@kenoracric/api-client";
import {api} from "../src/lib/api";

export default function Scoring(){
  const [matches,setMatches]=useState<MatchRecord[]>([]);
  const [match,setMatch]=useState<MatchRecord|null>(null);
  const [innings,setInnings]=useState<Innings>(newInnings());
  const [database,setDatabase]=useState<SQLite.SQLiteDatabase|null>(null);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [token,setToken]=useState("");
  const [message,setMessage]=useState("Sign in with a scorer account to sync scoring.");
  useEffect(()=>{
    api.matches.list().then(setMatches).catch(()=>setMessage("Could not reach the KenoraCric server."));
    SQLite.openDatabaseAsync("kenoracric.db").then(async db=>{
      await db.execAsync("CREATE TABLE IF NOT EXISTS pending_events (event_id TEXT PRIMARY KEY, match_id TEXT, sequence INTEGER, payload TEXT, created_at TEXT DEFAULT CURRENT_TIMESTAMP);");
      setDatabase(db);
    }).catch(()=>setMessage("Could not open the local scoring database."));
  },[]);

  useEffect(()=>{
    if(!match)return;
    const socket=io(api.socketUrl);
    socket.emit("match:join",match._id);
    socket.on("score:update",updated=>{
      setMatch(updated);setInnings(updated.innings);
      setMatches(current=>current.map(item=>item._id===updated._id?updated:item));
    });
    return()=>{socket.emit("match:leave",match._id);socket.disconnect();};
  },[match?._id]);
  async function signIn(){
    try{
      const session=await api.auth.login({email,password});
      if(session.user.role!=="scorer"&&session.user.role!=="admin"){setMessage("This account does not have scoring permission.");return;}
      setToken(session.token);setPassword("");setMessage("Signed in as "+session.user.name+".");
    }catch(error){setMessage(error instanceof Error?error.message:"Sign-in failed.");}
  }
  async function addDelivery(delivery:ScoreDelivery){
    if(!match){setMessage("Select a match before scoring.");return;}
    if(!database){setMessage("Preparing local scoring storage. Try again in a moment.");return;}
    const nextInnings=applyDelivery(innings,delivery);
    const event={eventId:crypto.randomUUID(),sequence:match.sequence+1,delivery};
    const updatedMatch={...match,sequence:event.sequence,innings:nextInnings};
    setInnings(nextInnings);setMatch(updatedMatch);
    setMatches(current=>current.map(item=>item._id===match._id?updatedMatch:item));
    try{await database.runAsync("INSERT OR IGNORE INTO pending_events (event_id,match_id,sequence,payload) VALUES (?,?,?,?)",event.eventId,match._id,event.sequence,JSON.stringify(delivery));}
    catch{setMessage("Could not save the delivery to local storage.");return;}
    if(!token){setMessage("Saved locally. Sign in with a scorer account to sync.");return;}
    try{
      await api.scoring.submit(match._id,event,token);
      await database.runAsync("DELETE FROM pending_events WHERE event_id=?",event.eventId);
      setMessage("Delivery synced.");
    }catch(error){setMessage(error instanceof Error?"Saved locally. "+error.message:"Saved locally; server sync failed.");}
  }
  return <ScrollView style={styles.page} contentContainerStyle={styles.content}>
    <Text style={styles.kicker}>SCORER WORKSPACE</Text><Text style={styles.title}>Quick score</Text><Text style={styles.message}>{message}</Text>
    {!token&&<View style={styles.authCard}><Text style={styles.label}>Scorer sign-in</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email" placeholderTextColor="#778aa4" style={styles.input}/>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Password" placeholderTextColor="#778aa4" style={styles.input}/>
      <Pressable onPress={signIn} style={styles.signIn}><Text style={styles.darkText}>Sign in</Text></Pressable>
    </View>}
    {token&&<Pressable onPress={()=>{setToken("");setMessage("Signed out.");}}><Text style={styles.signOut}>Sign out</Text></Pressable>}
    <Text style={styles.label}>Select match</Text>
    {matches.map(item=><Pressable key={item._id} style={[styles.match,match?._id===item._id&&styles.selected]} onPress={()=>{setMatch(item);setInnings(item.innings||newInnings());}}>
      <Text style={styles.white}>{item.teamA} v {item.teamB}</Text><Text style={styles.subtle}>{item.status} / {item.format}</Text>
    </Pressable>)}
    <View style={styles.board}><Text style={styles.score}>{innings.runs}/{innings.wickets}</Text><Text style={styles.white}>{overs(innings.legalBalls)} overs</Text>
      <View style={styles.grid}>{[0,1,2,3,4,6].map(runs=><Pressable key={runs} onPress={()=>addDelivery({runs})} style={styles.run}><Text style={styles.white}>{runs||"DOT"}</Text></Pressable>)}</View>
      <View style={styles.extras}>
        <Pressable onPress={()=>addDelivery({runs:0,extra:"wides"})} style={styles.extra}><Text style={styles.white}>Wide</Text></Pressable>
        <Pressable onPress={()=>addDelivery({runs:0,extra:"noBalls"})} style={styles.extra}><Text style={styles.white}>No ball</Text></Pressable>
        <Pressable onPress={()=>addDelivery({runs:1,extra:"byes"})} style={styles.extra}><Text style={styles.white}>Bye</Text></Pressable>
        <Pressable onPress={()=>addDelivery({runs:1,extra:"legByes"})} style={styles.extra}><Text style={styles.white}>Leg bye</Text></Pressable>
        <Pressable onPress={()=>addDelivery({runs:0,wicket:"bowled"})} style={[styles.extra,styles.wicket]}><Text style={styles.white}>Wicket</Text></Pressable>
      </View>
    </View>
  </ScrollView>;
}
const styles=StyleSheet.create({
  page:{flex:1,backgroundColor:"#06152e"},content:{padding:20,paddingTop:34},kicker:{color:"#ffc928",fontSize:10,letterSpacing:2,fontWeight:"700"},
  title:{fontSize:30,fontWeight:"800",color:"#fff",marginTop:12},message:{color:"#9db1ca",fontSize:12,marginVertical:14},
  authCard:{backgroundColor:"#0d2342",padding:16,marginBottom:22,borderWidth:1,borderColor:"#ffffff18"},
  label:{color:"#c4cfdf",fontSize:12,fontWeight:"700",marginTop:12,marginBottom:8},input:{backgroundColor:"#081a34",color:"#fff",padding:12,marginTop:8,borderWidth:1,borderColor:"#ffffff20"},
  signIn:{backgroundColor:"#ffc928",padding:13,alignItems:"center",marginTop:12},darkText:{color:"#081932",fontWeight:"700"},signOut:{color:"#ffc928",fontSize:12,marginBottom:10},
  match:{backgroundColor:"#0d2342",padding:15,marginBottom:8,borderWidth:1,borderColor:"#ffffff15"},selected:{borderColor:"#ffc928"},
  white:{color:"#fff",fontWeight:"700"},subtle:{color:"#91a3bc",fontSize:10,marginTop:5},board:{backgroundColor:"#0d2342",padding:20,marginTop:15},
  score:{fontSize:44,fontWeight:"800",color:"#fff"},grid:{flexDirection:"row",flexWrap:"wrap",gap:8,marginTop:22},
  run:{width:"31%",height:64,alignItems:"center",justifyContent:"center",backgroundColor:"#15375f",borderWidth:1,borderColor:"#ffffff18"},
  extras:{flexDirection:"row",flexWrap:"wrap",gap:7,marginTop:14},extra:{paddingVertical:12,paddingHorizontal:10,backgroundColor:"#102747",borderWidth:1,borderColor:"#ffffff18"},wicket:{backgroundColor:"#6b2734"},
});
