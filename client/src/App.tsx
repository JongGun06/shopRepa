import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { auth } from './firebase/config';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import Main from './components/Pages/MainPage/Main';
import AuthPage from './components/Auth/AuthPage';
import FavoritesPage from './components/Pages/FavoritesPage/FavoritesPage';
import ProfilePage from './components/Pages/ProfilePage/ProfilePage';
import AddProductPage from './components/Pages/SellerDashboard/AddProductPage';
import ProductDetailPage from './components/Pages/ProductDetailPage/ProductDetailPage';
import CartPage from './components/Pages/CartPage/CartPage';
import SellerOrdersPage from './components/Pages/SellerOrdersPage/SellerOrdersPage';
import UserOrdersPage from './components/Pages/UserOrdersPage/UserOrdersPage';
import MapPage from './components/Pages/MapPage/MapPage'; // <-- Импорт новой страницы
import { type RootState, type AppDispatch } from './store/store';
import { logout, setUser } from './store/authSlice';
import { useSyncUserMutation } from './store/apiSlice';

// Импорт иконок
import { HomeIcon } from './components/Icons/HomeIcon';
import { HeartIcon } from './components/Icons/HeartIcon';
import { OrdersIcon } from './components/Icons/OrdersIcon';
import { MenuIcon } from './components/Icons/MenuIcon';
import { MapIcon } from './components/Icons/MapIcon'; // <-- Импорт иконки карты

function App() {
  const { profile } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [syncUser] = useSyncUserMutation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const response = await syncUser({ firebaseUid: user.uid, email: user.email }).unwrap();
          dispatch(setUser(response));
        } catch (err) {
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

  const mainNavLinks = (
    <>
      {/* Добавлена ссылка "Карта" для десктопа */}
      <Link to="/map">Карта</Link> 
      <Link to="/favorites">Избранное</Link>
      <Link to="/orders/user">Мои заказы</Link>
      {isSeller && <Link to="/orders/seller">Заказы (Продавец)</Link>}
      {isSeller && <Link to="/add-product-very-secret-path">Добавить товар</Link>}
    </>
  );

  return (
    <div className="app-container">
      {/* --- ВЕРХНИЙ ХЕДЕР --- */}
      <header className="app-header">
        <Link to="/" className="logo">МойМаркет</Link>
        <nav className="desktop-nav">
          {mainNavLinks}
        </nav>
        <div className="header-right">
          <Link to="/cart" className="cart-link">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>
          <div className="desktop-auth">
            {profile ? (
              <div className="profile-badge">
                <Link to="/profile" className="profile-link">
                  <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name || profile.email}&background=random`} alt="avatar" />
                  <span>{profile.name}</span>
                </Link>
                <button onClick={handleLogout}>Выйти</button>
              </div>
            ) : ( <Link to="/auth">Вход</Link> )}
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/map" element={<MapPage />} /> {/* <-- Новый маршрут для карты */}
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

      {/* --- НИЖНЯЯ НАВИГАЦИЯ ДЛЯ МОБИЛЬНЫХ --- */}
      <nav className="bottom-nav">
        <NavLink to="/" className="bottom-nav-link">
            <HomeIcon />
            <span>Главная</span>
        </NavLink>
        <NavLink to="/favorites" className="bottom-nav-link">
            <HeartIcon />
            <span>Избранное</span>
        </NavLink>
        {/* Добавлена иконка "Карта" в центр */}
        <NavLink to="/map" className="bottom-nav-link">
            <MapIcon />
            <span>Карта</span>
        </NavLink>
        <NavLink to="/orders/user" className="bottom-nav-link">
            <OrdersIcon />
            <span>Заказы</span>
        </NavLink>
        <button className="bottom-nav-link" onClick={() => setIsMenuOpen(true)}>
            <MenuIcon />
            <span>Меню</span>
        </button>
      </nav>

      {/* --- Боковое выезжающее меню --- */}
      <div className={`side-menu-panel ${isMenuOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
            <h4>Меню</h4>
            <button onClick={() => setIsMenuOpen(false)}>&times;</button>
        </div>
        <div className="side-menu-content">
            {profile ? (
                <Link to="/profile" className="profile-link-mobile">
                    <img src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.name || profile.email}&background=random`} alt="avatar" />
                    <span>{profile.name}</span>
                </Link>
            ) : (
                <Link to="/auth">Вход / Регистрация</Link>
            )}
            <hr />
            {isSeller && <Link to="/orders/seller">Заказы (Продавец)</Link>}
            {isSeller && <Link to="/add-product-very-secret-path">Добавить товар</Link>}
            {profile && <button className="logout-mobile" onClick={handleLogout}>Выйти</button>}
        </div>
      </div>
      {isMenuOpen && <div className="overlay" onClick={() => setIsMenuOpen(false)}></div>}
    </div>
  );
}

export default App;