import { useSelector } from 'react-redux';
import { type RootState } from '../../../store/store';
import { useGetSellerOrdersQuery, useUpdateOrderStatusMutation } from '../../../store/apiSlice';
import '../MainPage/MainPage.css';

const SellerOrdersPage = () => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const { data: orders = [], isLoading, isError } = useGetSellerOrdersQuery(profile?.firebaseUid!, { skip: !profile });
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleConfirmOrder = async (orderId: string) => {
    if (!confirm('Подтвердить выполнение заказа?')) return;
    try {
      await updateOrderStatus({ orderId, status: 'delivered', firebaseUid: profile!.firebaseUid }).unwrap();
      alert('Заказ подтвержден!');
    } catch (error) {
      alert('Ошибка при подтверждении заказа.');
    }
  };

  if (!profile) return <div className="main-container"><h2>Пожалуйста, войдите, чтобы увидеть заказы.</h2></div>;
  if (profile.role !== 'seller' || profile.status !== 'approved') {
    return <div className="main-container"><h2>Доступ только для одобренных продавцов.</h2></div>;
  }
  if (isLoading) return <div className="main-container"><p>Загрузка...</p></div>;
  if (isError) return <div className="main-container"><p>Ошибка загрузки заказов.</p></div>;

  // Сортировка: pending в начале, delivered в конце
  const sortedOrders = [...orders].sort((a, b) => {
    if (a.status === 'pending' && b.status === 'delivered') return -1;
    if (a.status === 'delivered' && b.status === 'pending') return 1;
    return 0;
  });

  return (
    <div className="main-container">
      <h1>Мои заказы (Продавец)</h1>
      {sortedOrders.length > 0 ? (
        <div className="products-grid">
          {sortedOrders.map(order => (
            <div key={order._id} className="card-product">
              <div className="card-product-body">
                <h5>Заказ #{order._id.slice(-6)}</h5>
                <p>Покупатель: {order.user.name || order.user.email}</p>
                <p>Статус: {order.status === 'pending' ? 'В обработке' : 'Доставлен'}</p>
                <p>Дата: {new Date(order.createDate).toLocaleDateString()}</p>
                <h6>Товары:</h6>
                <ul>
                  {order.products
                    .filter(p => p.product.author._id === profile._id)
                    .map(p => (
                      <li key={p.product._id}>
                        {p.product.title} x {p.quantity} ({p.product.price * p.quantity} сом)
                      </li>
                    ))}
                </ul>
                {order.status === 'pending' && (
                  <button
                    className="add-to-cart-btn"
                    onClick={() => handleConfirmOrder(order._id)}
                    disabled={isUpdating}
                    style={{ backgroundColor: '#28a745', marginTop: '1rem' }}
                  >
                    {isUpdating ? 'Подтверждение...' : 'Подтвердить заказ'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>У вас пока нет заказов.</p>
      )}
    </div>
  );
};

export default SellerOrdersPage;