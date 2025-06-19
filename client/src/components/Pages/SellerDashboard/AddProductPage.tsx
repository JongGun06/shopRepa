// client/src/components/Pages/SellerDashboard/AddProductPage.tsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../../../store/store';
import { useCreateProductMutation, useGetCategoriesQuery } from '../../../store/apiSlice';
import '../ProfilePage/ProfilePage.css'; // Используем стили со страницы профиля

const AddProductPage = () => {
    const { profile } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    const [createProduct, { isLoading }] = useCreateProductMutation();
    const { data: categories = [] } = useGetCategoriesQuery();

    const [formData, setFormData] = useState({ title: '', description: '', price: '', category: '', imageFile: null as File | null });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFormData({ ...formData, imageFile: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (!formData.title || !formData.price || !formData.category || !formData.imageFile) {
            setMessage('Все поля, кроме описания, обязательны');
            return;
        }

        const productData = new FormData();
        productData.append('firebaseUid', profile!.firebaseUid);
        productData.append('title', formData.title);
        productData.append('description', formData.description);
        productData.append('price', formData.price);
        productData.append('category', formData.category);
        productData.append('image', formData.imageFile);

        try {
            await createProduct(productData).unwrap();
            setMessage('Товар успешно добавлен!');
            // Очистить форму можно здесь
            navigate('/profile'); // Перекидываем в профиль, где он увидит свой товар
        } catch (err) {
            setMessage('Ошибка добавления товара');
        }
    };

    if (profile?.role !== 'seller' || profile?.status !== 'approved') {
        return <div className="main-container"><h2>Доступ запрещен. Эта страница только для одобренных продавцов.</h2></div>;
    }

    return (
        <div className="main-container">
            <h1>Добавить новый товар</h1>
            <div className="profile-layout">
                <div className="profile-form-card">
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group"><label>Название товара</label><input type="text" name="title" onChange={handleChange} required /></div>
                        <div className="form-group"><label>Описание</label><textarea name="description" onChange={handleChange} rows={4}></textarea></div>
                        <div className="form-group"><label>Цена (сом)</label><input type="number" name="price" onChange={handleChange} required /></div>
                        <div className="form-group">
                            <label>Категория</label>
                            <select name="category" onChange={handleChange} required>
                                <option value="">Выберите категорию</option>
                                {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                            </select>
                        </div>
                        <div className="form-group"><label>Изображение</label><input type="file" name="imageFile" onChange={handleFileChange} accept="image/*" required /></div>
                        <button type="submit" disabled={isLoading} className="save-button">{isLoading ? 'Добавление...' : 'Добавить товар'}</button>
                        {message && <p className="form-message">{message}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProductPage;