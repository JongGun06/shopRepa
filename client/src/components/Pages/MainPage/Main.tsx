import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useGetCategoriesQuery } from '../../../store/apiSlice';
import './MainPage.css';

const Main = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('default');

  const { data: products = [], isLoading: isProductsLoading } = useGetProductsQuery({
    search,
    category,
    price_gte: priceRange.min ? Number(priceRange.min) : undefined,
    price_lte: priceRange.max ? Number(priceRange.max) : undefined,
    sortBy,
  });

  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="main-container">
      <h1>Каталог</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={handleSearchChange}
        />
        <select value={category} onChange={handleCategoryChange}>
          <option value="">Все категории</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="min"
          placeholder="Цена от"
          value={priceRange.min}
          onChange={handlePriceChange}
        />
        <input
          type="number"
          name="max"
          placeholder="Цена до"
          value={priceRange.max}
          onChange={handlePriceChange}
        />
        <select value={sortBy} onChange={handleSortChange}>
          <option value="default">По умолчанию</option>
          <option value="priceAsc">Цена: по возрастанию</option>
          <option value="priceDesc">Цена: по убыванию</option>
          <option value="dateNew">Новинки</option>
        </select>
      </div>
      {isProductsLoading || isCategoriesLoading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="products-grid">
          {products.filter(product => product.quantity > 0).map(product => (
            <Link to={`/product/${product._id}`} key={product._id} className="card-product">
              <img src={product.image} alt={product.title} />
              <div className="card-product-body">
                <h5>{product.title}</h5>
                <p>{product.price} сом</p>
                <p>В наличии: {product.quantity}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Main;