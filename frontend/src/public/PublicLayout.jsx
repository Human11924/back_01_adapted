import { Outlet } from "react-router-dom";
import PublicHeader from "./components/PublicHeader";
import PublicFooter from "./components/PublicFooter";

import "./styles/variables.css";
import "./styles/public-base.css";
import "./styles/layout.css";
import "./styles/header.css";
import "./styles/footer.css";

export default function PublicLayout() {
  return (
    <div className="publicShell">
      <PublicHeader />
      <Outlet />
      <PublicFooter />
    </div>
  );
}
