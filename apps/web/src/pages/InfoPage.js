import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
export function InfoPage() {
    const location = useLocation();
    const title = location.pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "KenoraCric";
    return _jsxs("main", { className: "page", children: [_jsx("span", { className: "eyebrow muted", children: "KENORACRIC" }), _jsxs("h1", { children: [title, _jsx("span", { children: "." })] }), _jsx("p", { className: "lead", children: "This section is being connected to the KenoraCric platform." }), _jsxs(Link, { className: "button", to: "/matches", children: ["Visit match centre ", _jsx(ArrowRight, { size: 15 })] })] });
}
//# sourceMappingURL=InfoPage.js.map