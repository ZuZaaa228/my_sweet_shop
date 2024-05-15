import React, {useEffect, useState} from 'react';
import MyLoader from '../Loader/MyLoader';
import {setCookie} from "../../tools/setCookie";


function ProductList({setLoading, loading, access, refreshRequest, ...props}) {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [cartItems, setCartItems] = useState({});
    const [productsLoaded, setProductsLoaded] = useState(false); // Состояние для отслеживания загрузки товаров

    function changeCartValues(product_id, quantity = 1) {
        if (quantity === undefined) quantity = 1;
        fetch(`/api/products/${product_id}/add_to_cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access}`
            },
            body: JSON.stringify({
                quantity: quantity,
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    refreshRequest()
                    throw new Error('Failed to add product to cart');
                }
            })
            .then(data => {
                console.log('Product added to cart:', data);
                setCartItems(prevCartItems => ({
                    ...prevCartItems,
                    [product_id]: (prevCartItems[product_id] || 0) + quantity
                }));
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
            });
    }

    useEffect(() => {
        if (!productsLoaded) { // Выполняем запрос только если товары еще не были загружены
            setLoading(true);
            fetch('/api/products')
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error(`HTTP error ${response.status}`);
                    }
                })
                .then(data => {
                    setProducts(data);
                    setProductsLoaded(true);
                })
                .catch(error => {
                    setError('Ошибка загрузки данных');
                    console.error('Error fetching data:', error);
                    setCookie("accessToken", "", 0)
                    setCookie("refreshToken", "", 0)
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [loading, setLoading, productsLoaded]); // Изменяем зависимости, чтобы useEffect сработал только при productsLoaded


    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 md:p-10 xl:grid-cols-6 gap-4 p-10 xl:p-10">
            {!loading && productsLoaded ? (
                products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md flex flex-col justify-between">
                        <img src={'http://127.0.0.1:8000' + product.image} alt={product.name}
                             className="max-w-full self-center max-h-52 contain-content caption-bottom"/>
                        <div
                            className="p-2 md:p-4 row-auto h-fit bg-white rounded-lg shadow-md flex flex-col justify-between">
                            <h2 className="text-lg h-1/2 font-semibold ">{product.name}</h2>
                            <p className="text-gray-600 mb-2 truncate min-h-5">{product.description}</p>
                            <p className="text-gray-800 mb-2">Цена: {product.price} руб.</p>
                            <div className="bottom-0 w-full flex items-end inset-x-0 justify-center">
                                {cartItems[product.id] > 0 ?
                                    <>
                                        {
                                            cartItems[product.id] && (
                                                <div className={"origin-center items-end"}>
                                                    <button
                                                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md mr-2"
                                                        onClick={() => {
                                                            changeCartValues(product.id, 1)
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                    <span>{cartItems[product.id]}</span>
                                                    <button
                                                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md ml-2"
                                                        onClick={() => {
                                                            changeCartValues(product.id, -1)
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                </div>
                                            )
                                        }
                                    </>

                                    :
                                    <button
                                        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md mr-2"
                                        onClick={() => changeCartValues(product.id, 1)}
                                    >
                                        Добавить в корзину
                                    </button>
                                }


                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <MyLoader/>
            )}
        </div>
    );
}

export default ProductList;
