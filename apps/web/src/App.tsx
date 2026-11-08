import {Route,Routes} from "react-router-dom";
import {SiteHeader} from "./components/layout/SiteHeader";
import {HomePage} from "./pages/HomePage";
import {MatchesPage} from "./pages/MatchesPage";
import {MatchPage} from "./pages/MatchPage";
import {ScoringPage} from "./pages/ScoringPage";
import {InfoPage} from "./pages/InfoPage";

export default function App(){
  return <><SiteHeader/><Routes>
    <Route path="/" element={<HomePage/>}/><Route path="/matches" element={<MatchesPage/>}/>
    <Route path="/matches/:id" element={<MatchPage/>}/><Route path="/scoring" element={<ScoringPage/>}/>
    <Route path="*" element={<InfoPage/>}/>
  </Routes></>;
}
