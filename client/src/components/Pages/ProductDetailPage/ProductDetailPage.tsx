import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductByIdQuery } from '../../../store/apiSlice';
import { addToCart } from '../../../store/cartSlice';
import { type AppDispatch } from '../../../store/store';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useGetProductByIdQuery(id!, { skip: !id });

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      navigate('/cart');
    }
  };

  const handleShowCoordinates = () => {
    if (product?.containerCoordinates) {
      console.log(`Координаты контейнера: x=${product.containerCoordinates.x}, y=${product.containerCoordinates.y}`);
    } else {
      console.log('Координаты контейнера не указаны');
    }
  };

  if (isLoading) return <div className="main-container"><p>Загрузка товара...</p></div>;
  if (isError || !product) return <div className="main-container"><p>Ошибка: товар не найден.</p></div>;

  return (
    <div className="product-detail-container">
      <div className="product-image-gallery">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <p className="product-brand-detail">{product.brand}</p>
        <h1>{product.title}</h1>
        <div className="product-price-detail">
          <span>{product.price} сом</span>
          {product.oldPrice && <s>{product.oldPrice} сом</s>}
        </div>
        {product.author && typeof product.author === 'object' && (
          <div className="product-author">
            <img src={product.author.avatar || `https://ui-avatars.com/api/?name=${product.author.name}`} alt={product.author.name} />
            <span>Продавец: {product.author.name}</span>
          </div>
        )}
        <p className="product-description">{product.description}</p>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Добавить в корзину</button>
        <button className="add-to-cart-btn" onClick={handleShowCoordinates} style={{ backgroundColor: '#6c757d', marginTop: '1rem' }}>
          Показать координаты
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;