import React from "react";
import "./Header.css";
import Connection from "../connection/Connection";
import { NftLogo } from "../../assets/icons";

const Header = ({ onAccountChange, onConnect }) => {
  return (
    <div className="Header">
      <div className="Header-width">
        <div className="Header-left">
          <div className="Header-logo">
            <NftLogo />
          </div>
          <div className="Header-title">NFT Minter</div>
        </div>
        <div className="Header-right">
          <Connection onAccountChange={onAccountChange} onConnect={onConnect} />
        </div>
      </div>
    </div>
  );
};

export default Header;
