import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowRight, ChevronDown, Globe2, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Brand } from "./Brand";
const links = [["Live scores", "/matches"], ["Tournaments", "/tournaments"], ["Teams", "/teams"], ["Statistics", "/statistics"]];
export function SiteHeader() {
    const location = useLocation();
    return _jsxs("header", { className: "topbar", children: [_jsx(Brand, {}), _jsx("nav", { children: links.map(([label, path]) => _jsx(Link, { className: location.pathname === path ? "active" : "", to: path, children: label }, path)) }), _jsxs("div", { className: "head-actions", children: [_jsxs("span", { className: "edition", children: [_jsx(Globe2, { size: 14 }), " GLOBAL ", _jsx(ChevronDown, { size: 13 })] }), _jsx(Link, { className: "login", to: "/login", children: "Sign in" }), _jsxs(Link, { className: "button small", to: "/scoring", children: ["Scorer access ", _jsx(ArrowRight, { size: 15 })] }), _jsx(Menu, { className: "mobile-menu" })] })] });
}
//# sourceMappingURL=SiteHeader.js.map