import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../../store/store';
import { addToCart, decreaseCart, removeFromCart, clearCart } from '../../../store/cartSlice';
import { useCreateOrderMutation } from '../../../store/apiSlice';
import './CartPage.css';

const CartPage = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const { profile } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [createOrder, { isLoading, isError, error }] = useCreateOrderMutation();

  const totalAmount = cart.cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

  const handleAddToCart = (item: any) => {
    if (item.cartQuantity >= item.quantity) {
      alert(`Нельзя добавить больше ${item.quantity} единиц товара "${item.title}"`);
      return;
    }
    dispatch(addToCart(item));
  };

  const handleCheckout = async () => {
    if (!profile) {
      alert('Пожалуйста, войдите, чтобы оформить заказ.');
      navigate('/auth');
      return;
    }

    // Проверяем, что все товары в корзине имеют достаточное количество
    for (const item of cart.cartItems) {
      if (item.cartQuantity > item.quantity) {
        alert(`Недостаточно товара "${item.title}". Доступно: ${item.quantity}, в корзине: ${item.cartQuantity}`);
        return;
      }
    }

    try {
      const orderData = {
        firebaseUid: profile.firebaseUid,
        products: cart.cartItems.map(item => ({
          productId: item._id,
          quantity: item.cartQuantity,
        })),
      };
      await createOrder(orderData).unwrap();
      alert('Заказ успешно оформлен!');
      dispatch(clearCart());
      navigate('/orders/user');
    } catch (err) {
      alert('Ошибка при оформлении заказа: ' + (err.data?.error || 'Неизвестная ошибка'));
    }
  };

  return (
    <div className="cart-container">
      <h1>Корзина</h1>
      {cart.cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Ваша корзина пуста</p>
          <Link to="/">Начать покупки</Link>
        </div>
      ) : (
        <div>
          <div className="cart-titles">
            <h3>Товар</h3>
            <h3>Цена</h3>
            <h3>Количество</h3>
            <h3>Сумма</h3>
          </div>
          <div className="cart-items">
            {cart.cartItems.map(item => (
              <div className="cart-item" key={item._id}>
                <div className="cart-product">
                  <img src={item.image} alt={item.title} />
                  <div>
                    <h4>{item.title}</h4>
                    <button onClick={() => dispatch(removeFromCart(item))}>Удалить</button>
                  </div>
                </div>
                <div className="cart-price">{item.price} сом</div>
                <div className="cart-quantity">
                  <button onClick={() => dispatch(decreaseCart(item))}>-</button>
                  <div className="count">{item.cartQuantity}</div>
                  <button onClick={() => handleAddToCart(item)}>+</button>
                </div>
                <div className="cart-total-price">
                  {item.price * item.cartQuantity} сом
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <button className="clear-cart" onClick={() => dispatch(clearCart())}>Очистить корзину</button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Итого</span>
                <span className="amount">{totalAmount} сом</span>
              </div>
              <p>Налоги и доставка рассчитываются при оформлении заказа</p>
              <button onClick={handleCheckout} disabled={isLoading}>
                {isLoading ? 'Оформление...' : 'Оформить заказ'}
              </button>
              {isError && <p style={{ color: 'red' }}>Ошибка: {JSON.stringify(error)}</p>}
              <div className="continue-shopping">
                <Link to="/">Продолжить покупки</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;