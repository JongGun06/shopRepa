import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../../firebase/config';
import { useSyncUserMutation } from '../../store/apiSlice';
import { setUser, logout } from '../../store/authSlice';
import { type AppDispatch } from '../../store/store';
import './AuthPage.css';

const AuthPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [syncUser, { isLoading, isError, error: apiError }] = useSyncUserMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const response = await syncUser({ firebaseUid: firebaseUser.uid, email: firebaseUser.email }).unwrap();
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

  const mapFirebaseError = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/email-already-in-use': return 'Этот email уже зарегистрирован.';
      case 'auth/invalid-email': return 'Некорректный формат email.';
      case 'auth/user-not-found': return 'Пользователь с таким email не найден.';
      case 'auth/wrong-password': return 'Неверный пароль.';
      case 'auth/weak-password': return 'Пароль слишком слабый. Используйте не менее 6 символов.';
      default: return `Произошла ошибка: ${errorCode}`;
    }
  };

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setMessage('');

    try {
      let userCredential;
      if (isLoginView) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password.length < 6) {
          setLocalError('Пароль должен быть не менее 6 символов.');
          return;
        }
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      if (userCredential.user) {
        const backendProfile = await syncUser({
          firebaseUid: userCredential.user.uid,
          email: userCredential.user.email,
        }).unwrap();
        dispatch(setUser(backendProfile));
        navigate('/');
      }
    } catch (err: any) {
      setLocalError(mapFirebaseError(err.code || ''));
      console.error('Ошибка входа/регистрации:', err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const response = await syncUser({ firebaseUid: user.uid, email: user.email }).unwrap();
      dispatch(setUser(response));
      navigate('/');
    } catch (err: any) {
      setLocalError('Ошибка входа через Google: ' + (err.message || 'Неизвестная ошибка'));
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setLocalError('Введите email для сброса пароля.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Письмо для сброса пароля отправлено на ваш email.');
    } catch (err: any) {
      setLocalError(mapFirebaseError(err.code || ''));
    }
  };

  if (isLoading) {
    return <div className="auth-container">Загрузка...</div>;
  }

  return (
    <div className="auth-container">
      <h1>{isLoginView ? 'Вход' : 'Регистрация'}</h1>
      <form onSubmit={handleEmailAction}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {localError && <p className="error">{localError}</p>}
        {isError && <p className="error">Ошибка сервера: {JSON.stringify(apiError)}</p>}
        {message && <p className="message">{message}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoginView ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      <button
        className="auth-button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        Войти с Google
      </button>
      {isLoginView && (
        <button
          className="reset-password"
          onClick={handlePasswordReset}
          disabled={isLoading}
        >
          Забыли пароль?
        </button>
      )}
      <button
        className="toggle-auth"
        onClick={() => setIsLoginView(!isLoginView)}
      >
        {isLoginView ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
      </button>
    </div>
  );
};

export default AuthPage;