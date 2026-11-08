import React, {useState} from 'react';
import {StatusBar} from 'react-native';
import Home from './app/index';
import Scoring from './app/scoring';

export default function App(){
  const [screen,setScreen]=useState<'home'|'scoring'>('home');
  return <>
    <StatusBar barStyle="light-content" backgroundColor="#06152e" />
    {screen==='home'?<Home onOpenScoring={()=>setScreen('scoring')}/>:<Scoring onBack={()=>setScreen('home')}/>}
  </>;
}
