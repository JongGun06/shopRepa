import { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from './firebase/config';
import { signOut } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import Main from './components/Pages/MainPage/Main';
import AuthPage from './components/Auth/AuthPage';
import FavoritesPage from './components/Pages/FavoritesPage/FavoritesPage';
import ProfilePage from './components/Pages/ProfilePage/ProfilePage';
import AddProductPage from './components/Pages/SellerDashboard/AddProductPage';
import ProductDetailPage from './components/Pages/ProductDetailPage/ProductDetailPage';
import CartPage from './components/Pages/CartPage/CartPage';
import SellerOrdersPage from './components/Pages/SellerOrdersPage/SellerOrdersPage';
import UserOrdersPage from './components/Pages/UserOrdersPage/UserOrdersPage';
import { type RootState, type AppDispatch } from './store/store';
import { logout, setUser } from './store/authSlice';
import { useSyncUserMutation } from './store/apiSlice';

function App() {
  const { profile } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [syncUser] = useSyncUserMutation();


  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await syncUser({ firebaseUid: user.uid, email: user.email }).unwrap();
          dispatch(setUser(response));
        } catch (err) {
          console.error('Failed to sync user:', err);
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, [dispatch, syncUser]);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    navigate('/');
  };

  const isSeller = profile?.role === 'seller' && profile?.status === 'approved';

  return (
    <div>
      <header style={{ padding: '1rem', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link to="/">Главная</Link>
          <Link to="/favorites">Избранное</Link>
          <Link to="/orders/user">Мои заказы</Link>
          {isSeller && <Link to="/orders/seller">Заказы (Продавец)</Link>}
          {isSeller && <Link to="/add-product-very-secret-path">Добавить товар</Link>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>
          {profile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit' }}>
                <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name || profile.email}&background=random`} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                <span>{profile.name || profile.email}</span>
              </Link>
              <button onClick={handleLogout}>Выйти</button>
            </div>
          ) : (
            <Link to="/auth">Вход / Регистрация</Link>
          )}
        </div>
      </header>
      <hr style={{ margin: 0 }} />
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/add-product-very-secret-path" element={<AddProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders/seller" element={<SellerOrdersPage />} />
          <Route path="/orders/user" element={<UserOrdersPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;