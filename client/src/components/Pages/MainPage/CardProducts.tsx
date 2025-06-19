// client/src/components/Pages/MainPage/CardProducts.tsx (НОВАЯ ВЕРСИЯ)
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../../../store/store';
import { type Product } from '../../../types';
import { 
  useAddToFavoritesMutation, 
  useRemoveFromFavoritesMutation,
  useGetFavoritesQuery
} from '../../../store/apiSlice';
import { StarIcon } from './StarIcon';

// SVG иконка для сердечка
const HeartIcon = ({ isFavorite }: { isFavorite: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#dc3545" : "none"} stroke={isFavorite ? "#dc3545" : "gray"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="favorite-icon">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

interface CardProductsProps {
  product: Product;
}

const CardProducts = ({ product }: CardProductsProps) => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const { data: favoritesData } = useGetFavoritesQuery(profile?.firebaseUid!, { skip: !profile });
  const [addToFavorites] = useAddToFavoritesMutation();
  const [removeFromFavorites] = useRemoveFromFavoritesMutation();

  const isFavorite = favoritesData?.some(favProduct => favProduct._id === product._id) || false;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!profile) {
      alert("Пожалуйста, войдите, чтобы добавлять в избранное.");
      navigate('/auth');
      return;
    }

    const credentials = { firebaseUid: profile.firebaseUid, productId: product._id };

    if (isFavorite) {
      removeFromFavorites(credentials);
    } else {
      addToFavorites(credentials);
    }
  };

  return (
    <div className="card-product">
      <Link to={`/product/${product._id}`} className="card-product-link">
        <div className="card-product-image-wrapper">
          <img src={product.image} alt={product.title} className="card-product-image" />
          <button onClick={handleFavoriteClick} className="favorite-button" title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}>
            <HeartIcon isFavorite={isFavorite} />
          </button>
        </div>
        <div className="card-product-body">
          <p className="card-product-brand">{product.brand || 'No Brand'}</p>
          <h5 className="card-product-title">{product.title}</h5>
          <div className="card-product-rating">
            <StarIcon />
            <span>{product.rating?.toFixed(1)}</span>
          </div>
          <div className="card-product-price-wrapper">
            <span className="card-product-price">{product.price} сом</span>
            {product.oldPrice && (
              <span className="card-product-old-price">{product.oldPrice} сом</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CardProducts;