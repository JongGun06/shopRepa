import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../../../store/store';
import { useCreateProductMutation, useGetCategoriesQuery } from '../../../store/apiSlice';
import './AddProductPage.css';

const AddProductPage = () => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct, { isLoading, isError, error }] = useCreateProductMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    containerX: '',
    containerY: '',
    quantity: '',
    brand: '',
    rating: '',
    oldPrice: '',
    additionalInfo: '',
  });
  const [image, setImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) {
      alert('Пожалуйста, войдите как продавец.');
      navigate('/auth');
      return;
    }
    if (profile.role !== 'seller' || profile.status !== 'approved') {
      alert('Только одобренные продавцы могут добавлять товары.');
      return;
    }
    if (!image) {
      alert('Пожалуйста, выберите изображение.');
      return;
    }

    const form = new FormData();
    form.append('firebaseUid', profile.firebaseUid);
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('category', formData.category);
    form.append('containerX', formData.containerX);
    form.append('containerY', formData.containerY);
    form.append('quantity', formData.quantity);
    form.append('brand', formData.brand);
    form.append('rating', formData.rating);
    form.append('oldPrice', formData.oldPrice);
    form.append('additionalInfo', formData.additionalInfo);
    form.append('image', image);

    try {
      await createProduct(form).unwrap();
      alert('Товар успешно добавлен!');
      navigate('/');
    } catch (err) {
        //@ts-ignore
      alert('Ошибка при добавлении товара: ' + (err.data?.error || 'Неизвестная ошибка'));
    }
  };

  return (
    <div className="add-product-container">
      <h1>Добавить товар</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Цена</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label>Категория</label>
          <select name="category" value={formData.category} onChange={handleInputChange} required>
            <option value="">Выберите категорию</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Координата X</label>
          <input type="number" name="containerX" value={formData.containerX} onChange={handleInputChange} step="0.000001" />
        </div>
        <div className="form-group">
          <label>Координата Y</label>
          <input type="number" name="containerY" value={formData.containerY} onChange={handleInputChange} step="0.000001" />
        </div>
        <div className="form-group">
          <label>Количество</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="1" />
        </div>
        <div className="form-group">
          <label>Бренд</label>
          <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Рейтинг</label>
          <input type="number" name="rating" value={formData.rating} onChange={handleInputChange} min="0" max="5" step="0.1" />
        </div>
        <div className="form-group">
          <label>Старая цена</label>
          <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} min="0" step="0.01" />
        </div>
        <div className="form-group">
          <label>Дополнительная информация</label>
          <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Изображение</label>
          <input type="file" accept="image/jpeg,image/jpg,image/png" onChange={handleImageChange} required />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Добавление...' : 'Добавить товар'}
        </button>
        {isError && <p className="error">Ошибка: {JSON.stringify(error)}</p>}
      </form>
    </div>
  );
};

export default AddProductPage;