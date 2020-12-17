import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/logofull.png";
import SidebarItems from "./SidebarItems";
import "./styles/Sidebar.css";

const Sidebar = () => {
  return (
    <>
      <div className="sidebar">
        <img src={logo} alt="logo" className="logo"></img>
        {SidebarItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.route}
            activeClassName={item.route === "/" ? "" : "active"}
            className="link"
            key={index}
          >
            <div className="sidebar-item" key={item.name}>
              <p>{item.name}</p>
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
