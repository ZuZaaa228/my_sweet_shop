import React, {useState} from 'react';
import logo from '../../logo.svg';
import MenuBlock from "../Navigation/MenuBlock";
import {Navigate, NavLink} from 'react-router-dom';
import {getCookie} from "../../tools/getCookie";
import MyLoader from "../Loader/MyLoader";


const MyHeader = ({loading, setLoading, setAccess, setRefresh, setIsAuthenticate, ...props}) => {
    const [showCategories, setShowCategories] = useState(false);
    const toggleCategories = () => {
        setShowCategories(!showCategories);
    };

    const menuLinks = [
        {url: "/cart", text: "Корзина"},
        {url: "/orders", text: "Заказы"}
    ];

    const handleLogout = () => {
        setLoading(true)
        fetch(
            '/api/logout',
            {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Authorization': `Bearer ${props.access}`,
                },
            }
        )
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                setAccess(getCookie("accessToken"))
                setRefresh(getCookie("refreshToken"))
                alert("Вы вышли")
                setIsAuthenticate(false)
            })


        setLoading(false)
    };


    return (

        <header className="sticky bg-orange-500 py-4">

            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center md:mr-auto">
                    <div className="flex-shrink-0 ml-8">
                        <NavLink to={"/"} onClick={() => setLoading(true)}>
                            <img className="h-8" src={logo} alt="Логотип"/>
                        </NavLink>

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
                            <NavLink className={"text-white px-4 py-2 menu-item"}
                                     to={"/profile"}>Профиль</NavLink>
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