import React from 'react';

const MenuBlock = ({links, isOpen, styles}) => {
    const menuStyle = isOpen ? "block" : "";
    return (
        <nav className={styles}>
            {links.map((link, index) => (
                <a key={index} href={link.url} className={`text-white ${menuStyle} px-4 py-2 menu-item`}>{link.text}</a>
            ))}
        </nav>
    );
}

export default MenuBlock;
