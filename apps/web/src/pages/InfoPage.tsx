import {Link,useLocation} from "react-router-dom";
import {ArrowRight} from "lucide-react";

export function InfoPage(){
  const location=useLocation();
  const title=location.pathname.split("/").filter(Boolean).pop()?.replace(/-/g," ")||"KenoraCric";
  return <main className="page"><span className="eyebrow muted">KENORACRIC</span><h1>{title}<span>.</span></h1>
    <p className="lead">This section is being connected to the KenoraCric platform.</p>
    <Link className="button" to="/matches">Visit match centre <ArrowRight size={15}/></Link>
  </main>;
}
