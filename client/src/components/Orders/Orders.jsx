import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = ({ access }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Словарь для перевода статусов заказа
    const statusTranslations = {
        pending: 'Ожидание',
        processing: 'Обработка',
        shipped: 'Отправлен',
        delivered: 'Доставлен',
        canceled: 'Отменен',
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('/api/orders', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${access}`
                    }
                });
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="md:p-10 p-0">
            <h2 className="text-lg font-semibold p-4">Мои заказы</h2>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-4">
                    {orders.length === 0 ? (
                        <div>У вас пока нет заказов.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                <tr>
                                    <th className="px-4 py-2">Номер заказа</th>
                                    <th className="px-4 py-2">Статус</th>
                                    <th className="px-4 py-2">Товары</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map(order => (
                                    <tr key={order.pk} className="border-b">
                                        <td className="px-4 py-2">{order.pk}</td>
                                        <td className="px-4 py-2">{statusTranslations[order.status]}</td>
                                        <td className="px-4 py-2">
                                            <ul>
                                                {order.items.map((item, index) => (
                                                    <li key={item.product.id}>
                                                        {item.product.name} - {item.quantity}
                                                        {index !== order.items.length - 1 && ','}
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;
