import {ArrowRight,ChevronDown,Globe2,Menu} from "lucide-react";
import {Link,useLocation} from "react-router-dom";
import {Brand} from "./Brand";

const links=[["Live scores","/matches"],["Tournaments","/tournaments"],["Teams","/teams"],["Statistics","/statistics"]];
export function SiteHeader(){
  const location=useLocation();
  return <header className="topbar">
    <Brand/><nav>{links.map(([label,path])=><Link key={path} className={location.pathname===path?"active":""} to={path}>{label}</Link>)}</nav>
    <div className="head-actions"><span className="edition"><Globe2 size={14}/> GLOBAL <ChevronDown size={13}/></span>
      <Link className="login" to="/login">Sign in</Link><Link className="button small" to="/scoring">Scorer access <ArrowRight size={15}/></Link><Menu className="mobile-menu"/>
    </div>
  </header>;
}
