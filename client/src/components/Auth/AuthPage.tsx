// client/src/components/Auth/AuthPage.tsx (ФИНАЛЬНАЯ ВЕРСИЯ С REDUX TOOLKIT QUERY)
import { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useDispatch } from 'react-redux';
import { useSyncUserMutation } from '../../store/apiSlice';
import { setCredentials, logout } from '../../store/authSlice';
import { type AppDispatch } from '../../store/store';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Используем хук мутации из RTK Query
  const [syncUser, { isLoading, isError, error: apiError }] = useSyncUserMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // Если пользователь вышел из Firebase, очищаем и наш стор
        dispatch(logout());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

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
    e.preventDefault();
    setLocalError('');
    setMessage('');

    try {
      let userCredential;
      if (isLoginView) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password.length < 6) {
          setLocalError("Пароль должен быть не менее 6 символов.");
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      // Если Firebase отработал успешно, вызываем нашу RTK Query мутацию
      if (userCredential.user) {
        const backendProfile = await syncUser({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
        }).unwrap(); // .unwrap() для получения данных или ошибки

        // Сохраняем полученный от нашего бэка профиль в Redux
        dispatch(setCredentials(backendProfile));
        navigate('/'); // Перенаправляем на главную
      }

    } catch (err: any) {
      // Отлавливаем ошибки и от Firebase, и от RTK Query
      setLocalError(mapFirebaseError(err.code || ''));
      console.error('Ошибка входа/регистрации:', err);
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>{isLoginView ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleAction}>
        {/* ... JSX формы остался таким же, как я приводил ранее ... */}
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input style={{ width: '100%', padding: '8px' }} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Пароль:</label>
          <input style={{ width: '100%', padding: '8px' }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {localError && <p style={{ color: 'red' }}>{localError}</p>}
        {isError && <p style={{ color: 'red' }}>Ошибка сервера: {JSON.stringify(apiError)}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button style={{ width: '100%', padding: '10px' }} type="submit">{isLoginView ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>
      <button style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '10px' }} onClick={() => setIsLoginView(!isLoginView)}>
        {isLoginView ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
};

export default AuthPage;