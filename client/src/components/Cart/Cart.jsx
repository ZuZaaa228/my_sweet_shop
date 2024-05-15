import React, {useEffect, useState} from 'react';
import MyLoader from "../Loader/MyLoader";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {Navigate} from "react-router-dom";

function Cart({setLoading, loading, access, refreshRequest, ...props}) {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState({});
    const [productsLoaded, setProductsLoaded] = useState(false);
    const [newOrder, setNewOrder] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (!productsLoaded) {
            setLoading(true);
            fetch('/api/cart', {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        setProductsLoaded(true);
                        return response.json();
                    } else {
                        if (response.status === 401) {
                            refreshRequest();
                        }
                        throw new Error(`HTTP error ${response.status}`);
                    }
                })
                .then(data => {
                    setCart(data);
                    const initialCartItems = {};
                    data.items.forEach(item => {
                        initialCartItems[item.product.id] = item.quantity;
                    });
                    setCartItems(initialCartItems);
                })
                .catch(error => {
                    setError('Ошибка загрузки данных');
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [productsLoaded, access, refreshRequest, setLoading]);

    useEffect(() => {
        // Функция для вычисления общей суммы корзины
        const calculateTotalPrice = () => {
            let total = 0;
            cart.items.forEach(item => {
                total += item.product.price * cartItems[item.product.id];
            });
            setTotalPrice(total);
        };

        if (cart) {
            calculateTotalPrice();
        }
    }, [cart, cartItems]);

    function changeCartValues(product_id, quantity) {
        setLoading(true);
        fetch(`/api/products/${product_id}/update_cart_item`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({quantity})
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    if (response.status === 401) {
                        refreshRequest();
                    }
                    throw new Error('Failed to update product quantity in cart');
                }
            })
            .then(data => {
                console.log('Product quantity updated in cart:', data);
                setCart(data);
                setCartItems(prevCartItems => ({
                    ...prevCartItems,
                    [product_id]: quantity
                }));
            })
            .catch(error => {
                console.error('Error updating product quantity in cart:', error);
                setError('Ошибка обновления количества товара в корзине');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function removeItem(product_id) {
        setLoading(true);
        fetch(`/api/products/${product_id}/remove_from_cart`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    if (response.status === 401) {
                        refreshRequest();
                    }
                    throw new Error('Failed to remove product from cart');
                }
            })
            .then(data => {
                console.log('Product removed from cart:', data);
                setCart(data);
                setCartItems(prevCartItems => {
                    const updatedCartItems = {...prevCartItems};
                    delete updatedCartItems[product_id];
                    return updatedCartItems;
                });
            })
            .catch(error => {
                console.error('Error removing product from cart:', error);
                setError('Ошибка удаления товара из корзины');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    if (error) {
        return <p>{error}</p>;
    }


    function checkout() {
        setLoading(true);
        fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access}`
            }
        })
            .then(response => {
                if (response.ok) {
                    setNewOrder(true);
                    return response.json();
                } else {
                    if (response.status === 401) {
                        refreshRequest();
                    }
                    throw new Error('Failed to checkout');
                }
            })
            .then(data => {
                console.log('Order placed:', data);
                // Очистить корзину и выполнить какие-либо действия после оформления заказа
            })
            .catch(error => {
                console.error('Error placing order:', error);
                setError('Ошибка оформления заказа');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    if (newOrder) {
        return (
            <>
                setLoading(false)
                <Navigate to={'/orders'}/>
            </>
        );
    }

    return (
        <div className="md:p-10 p-0">
            {!loading && productsLoaded ? (
                <div className="bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold p-4">Корзина</h2>
                    <div className="p-4">
                        {cart.items.map(item => (
                            <div key={item.product.id} className="flex items-center border-b pb-4 md:flex">
                                <div className="flex-shrink-0 mr-4">
                                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20"/>
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="text-lg font-semibold">{item.product.name}</div>
                                        <div className="text-gray-600">{item.product.price} руб.</div>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            className="bg-white-500 border-orange-600 hover:animate-pulse border hover:bg-orange-600 text-orange-500 hover:text-white font-semibold py-1 px-2 rounded-md mr-2"
                                            onClick={() => changeCartValues(item.product.id, cartItems[item.product.id] - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="mx-2">{cartItems[item.product.id]}</span>
                                        <button
                                            className="bg-white-500 border-orange-600 hover:animate-pulse transition-colors border hover:bg-orange-600 text-orange-500 hover:text-white font-semibold py-1 px-2 rounded-md mr-2"
                                            onClick={() => changeCartValues(item.product.id, cartItems[item.product.id] + 1)}
                                        >
                                            +
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md"
                                            onClick={() => removeItem(item.product.id)}
                                        >
                                            <span className="hidden md:inline">Удалить</span>
                                            <FontAwesomeIcon icon={faTimes} className="md:hidden rounded-b"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4">
                        <button
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md w-full md:w-auto"
                            onClick={() => {
                                {
                                    checkout()
                                }
                            }}
                        >
                            Оформить заказ
                        </button>
                    </div>
                </div>
            ) : (
                <MyLoader/>
            )}
            <div className="bg-white rounded-lg shadow-md mt-4 p-4">
                <div className="text-lg font-semibold">Общая сумма: {totalPrice} руб.</div>
            </div>
        </div>

    );
}

export default Cart;
