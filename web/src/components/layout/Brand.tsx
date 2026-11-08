import {Link} from "react-router-dom";

export function Brand(){
  return <Link className="brand" to="/" aria-label="KenoraCric home">
    <span className="brand-mark">K</span><b>Kenora<span>Cric</span></b>
  </Link>;
}
