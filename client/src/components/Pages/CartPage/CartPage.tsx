// client/src/components/Pages/CartPage/CartPage.tsx (НОВЫЙ ФАЙЛ)
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { type RootState, type AppDispatch } from '../../../store/store';
import { addToCart, decreaseCart, removeFromCart, clearCart } from '../../../store/cartSlice';
import './CartPage.css';

const CartPage = () => {
    const cart = useSelector((state: RootState) => state.cart);
    const dispatch = useDispatch<AppDispatch>();

    const totalAmount = cart.cartItems.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

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
                                    <button onClick={() => dispatch(addToCart(item))}>+</button>
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
                            <button>Оформить заказ</button>
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