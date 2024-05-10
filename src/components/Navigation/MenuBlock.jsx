import React from 'react';
import {NavLink} from "react-router-dom";

const MenuBlock = ({links, isOpen, styles}) => {
    const menuStyle = isOpen ? "block" : "";
    return (
        <nav className={styles}>
            {links.map((link, index) => (
                <NavLink className={`text-white ${menuStyle} px-4 py-2 menu-item`} key={index}
                         to={link.url}>{link.text}</NavLink>
            ))}
        </nav>
    );
}

export default MenuBlock;
