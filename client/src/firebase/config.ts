// client/src/firebase/config.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Твои конфигурационные данные Firebase
// ВАЖНО: Замени их на свои реальные данные из консоли Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAJCKwsurjiiGYsfGGOEw5zFcUPjXalHZg",
  authDomain: "shopdordoi-76815.firebaseapp.com",
  projectId: "shopdordoi-76815",
  storageBucket: "shopdordoi-76815.firebasestorage.app",
  messagingSenderId: "1032433668426",
  appId: "1:1032433668426:web:75b0df41fb3d20723ef1b3",
  measurementId: "G-S9C50WT02H"
};

// Инициализируем Firebase
const app = initializeApp(firebaseConfig);

// Экспортируем сервис аутентификации
export const auth = getAuth(app);