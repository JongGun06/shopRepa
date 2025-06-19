// client/src/App.tsx (ФИНАЛЬНАЯ ВЕРСИЯ)
import { Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useUserStore } from './store/userStore'; // <-- Импортируем наше хранилище
import Main from './components/Pages/MainPage/Main';
import AuthPage from './components/Auth/AuthPage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';

function App() {
  // Получаем профиль и функции из хранилища
  const { profile, setProfile, clearProfile } = useUserStore();

  // Этот useEffect будет следить за состоянием пользователя при перезагрузке страницы
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !profile) {
        // Если пользователь есть в Firebase, но нет в хранилище (после перезагрузки)
        // то делаем запрос к нашему бэкенду заново
        try {
          const response = await fetch('http://localhost:3000/shop/users/registerOrLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firebaseUid: user.uid, email: user.email }),
          });
          const backendProfile = await response.json();
          setProfile(backendProfile);
        } catch (e) {
          console.error("Не удалось восстановить сессию с бэкенда", e);
          clearProfile();
        }
      } else if (!user) {
        // Если пользователя нет в Firebase, очищаем хранилище
        clearProfile();
      }
    });

    return () => unsubscribe();
  }, [profile, setProfile, clearProfile]);

  return (
    <div>
      {/* Меню навигации */}
      <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', marginBottom: '1rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Главная</Link>
        {profile ? (
          // Если пользователь залогинен, показываем его имя и выход
          <span style={{ float: 'right' }}>
            Привет, {profile.name || profile.email}!
            <Link to="/auth" style={{ marginLeft: '1rem' }}> (Выйти) </Link>
          </span>
        ) : (
          // Если не залогинен, показываем ссылку на вход
          <Link to="/auth" style={{ float: 'right' }}>Вход / Регистрация</Link>
        )}
      </nav>

      {/* Основное содержимое */}
      <main>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/auth" element={<AuthPage />} />
          {/* Тут можно будет добавлять другие страницы, например, профиль */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;