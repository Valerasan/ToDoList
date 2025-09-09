import React from "react";
import HighlightIcon from "@mui/icons-material/Highlight";
import Logout from "./Logout.jsx";

function Header() {
  return (
    <header>
      <h1>
        <div className="header">
          <div className="logo">
            <HighlightIcon />
            Keeper
          </div>
          <div className="logout-button-location">
            <Logout />
          </div>
        </div>
      </h1>
    </header>
  );
}

export default Header;
