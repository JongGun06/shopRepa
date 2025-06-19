// client/src/components/Auth/AuthPage.tsx

import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User
} from 'firebase/auth';
import { auth } from '../../firebase/config'; // Импортируем нашу конфигурацию

const AuthPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginView, setIsLoginView] = useState(true); // Для переключения между входом и регистрацией

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // Очищаем поля при изменении статуса
      setEmail('');
      setPassword('');
      setError('');
      setMessage('');
    });

    return () => unsubscribe();
  }, []);

  const mapFirebaseError = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use': return 'Этот email уже зарегистрирован.';
      case 'auth/invalid-email': return 'Некорректный формат email.';
      case 'auth/user-not-found': return 'Пользователь с таким email не найден.';
      case 'auth/wrong-password': return 'Неверный пароль.';
      case 'auth/weak-password': return 'Пароль слишком слабый. Используйте не менее 6 символов.'
      default: return `Произошла ошибка: ${errorCode}`;
    }
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    setError('');
    setMessage('');

    if (isLoginView) {
      // Логика входа
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        setError(mapFirebaseError(err.code));
      }
    } else {
      // Логика регистрации
      if (password.length < 6) {
        setError("Пароль должен быть не менее 6 символов.");
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (err: any) {
        setError(mapFirebaseError(err.code));
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(mapFirebaseError(err.code))
    }
  }

  const handlePasswordReset = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError("Пожалуйста, введите ваш email, чтобы сбросить пароль.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Ссылка для сброса пароля отправлена! Проверьте вашу почту.");
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      {user ? (
        // Вид, если пользователь вошел в систему
        <div>
          <h2>Добро пожаловать, {user.email}!</h2>
          <button onClick={handleSignOut}>Выйти</button>
        </div>
      ) : (
        // Вид, если пользователь не вошел в систему (форма входа/регистрации)
        <div>
          <h2>{isLoginView ? 'Вход' : 'Регистрация'}</h2>
          <form onSubmit={handleAction}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                required
              />
            </div>
            <div>
              <label>Пароль:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                required
              />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <button type="submit">{isLoginView ? 'Войти' : 'Зарегистрироваться'}</button>
          </form>
          <button onClick={() => setIsLoginView(!isLoginView)}>
            {isLoginView ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
          <br />
          <button onClick={handlePasswordReset}>
            Забыли пароль?
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthPage;