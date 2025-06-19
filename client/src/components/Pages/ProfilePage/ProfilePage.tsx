// client/src/components/Pages/ProfilePage/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '../../../store/store';
import { useUpdateProfileMutation, useGetUserProductsQuery } from '../../../store/apiSlice';
import { setUser } from '../../../store/authSlice';
import CardProducts from '../MainPage/CardProducts';
import '../MainPage/MainPage.css';
import './ProfilePage.css';

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const { data: userProducts = [] } = useGetUserProductsQuery(profile?._id!, { skip: !profile });

  useEffect(() => { if (profile) setName(profile.name || ''); }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const formData = new FormData();
    formData.append('firebaseUid', profile.firebaseUid);
    if (name !== profile.name) formData.append('name', name);
    if (avatarFile) formData.append('image', avatarFile);

    if (!formData.has('name') && !formData.has('image')) {
      setMessage('Нет изменений для сохранения');
      return;
    }
    try {
      const updatedProfile = await updateProfile(formData).unwrap();
      dispatch(setCredentials(updatedProfile));
      setMessage('Профиль успешно обновлен!');
    } catch (err) { setMessage(''); }
  };

  if (!profile) return <div className="main-container"><h2>Пожалуйста, войдите.</h2></div>;
  const currentAvatar = preview || profile.avatar || `https://ui-avatars.com/api/?name=${profile.name || profile.email}&background=random`;

  return (
    <div className="main-container">
      <h1>Профиль</h1>
      <div className="profile-layout">
        <div className="profile-form-card">
          <h3>Редактировать данные</h3>
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group avatar-upload-group">
              <img src={currentAvatar} alt="avatar" className="profile-avatar-preview" />
              <input id="avatar-upload" type="file" onChange={handleFileChange} accept="image/*" style={{display: 'none'}}/>
              <label htmlFor="avatar-upload" className="button-like">Выбрать аватар</label>
            </div>
            <div className="form-group"><label>Email</label><input type="email" value={profile.email} disabled /></div>
            <div className="form-group"><label>Имя</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <button type="submit" disabled={isUpdating} className="save-button">{isUpdating ? 'Сохранение...' : 'Сохранить'}</button>
            {message && <p className="form-message">{message}</p>}
          </form>
        </div>
      </div>
      <hr className="divider" />
      {profile.role === 'seller' && (
    <>
        <hr className="divider" />
        <h2>Мои объявления</h2>
        {userProducts.length > 0 ? (
            <div className="products-grid">
            {userProducts.map(product => <CardProducts key={product._id} product={product} />)}
            </div>
        ) : (<p>Вы еще не добавили ни одного товара.</p>)}
    </>
)}
    </div>
  );
};
export default ProfilePage;