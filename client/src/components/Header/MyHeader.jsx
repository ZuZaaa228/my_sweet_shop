import React, {useState} from 'react';
import logo from '../../logo.svg';
import MenuBlock from "../Navigation/MenuBlock";
import {NavLink} from 'react-router-dom';
import {getCookie} from "../../tools/getCookie";
import MyLoader from "../Loader/MyLoader";


const MyHeader = ({loading, setLoading, setAccess, ...props}) => {
    const [showCategories, setShowCategories] = useState(false);
    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };

    const menuLinks = [
        {url: "/catalog", text: "Каталог"},
        {url: "/cart", text: "Корзина"},
        {url: "/orders", text: "Заказы"}
    ];

    const handleLogout = () => {
        setLoading(true)
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setAccess(getCookie("accessToken"))
        setLoading(false)
    };


    return (

        <header className="bg-orange-500 py-4">
            {loading ? <MyLoader/> : ""}

            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center md:mr-auto">
                    <div className="flex-shrink-0 ml-8">
                        <img className="h-8" src={logo} alt="Логотип"/>
                    </div>
                    <MenuBlock links={menuLinks} styles={"hidden md:block"}/>
                </div>
                <div className="flex items-center md:ml-auto">
                    <nav className="hidden md:block">


                        {props.isAuthenticate ? (<>
                                <NavLink to="/profile"
                                         className="text-white px-4 py-2 menu-item">Профиль</NavLink>
                                <a href={"/"} className="text-white px-4 py-2 menu-item"
                                   onClick={handleLogout}>Выйти</a>
                            </>
                        ) : (
                            <NavLink className="text-white px-4 py-2 menu-item" to="/login">Войти</NavLink>
                        )}

                    </nav>
                    <button onClick={toggleCategories}
                            className="md:hidden text-white focus:outline-none mr-8">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                                  d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                    </button>
                </div>
            </div>
            {showCategories && (
                <>
                    <MenuBlock links={menuLinks} isOpen={showCategories}
                               styles={"md:hidden slide-down-menu"}/>
                    {/*<Link to={"/profile"}>Профиль</Link>*/}
                    {props.isAuthenticate ? (<>
                            <a className="text-white px-4 py-2 menu-item"><NavLink
                                to={"/profile"}>Профиль</NavLink></a>
                            <a href={"/"} className="text-white px-4 py-2 menu-item"
                               onClick={handleLogout}>Выйти</a>

                        </>
                    ) : (
                        <NavLink className="text-white px-4 py-2 menu-item slide-down-menu"
                                 to="/login">Войти</NavLink>
                    )}
                </>
            )
            }
        </header>

    )
}

export default MyHeader;