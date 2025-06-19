// client/src/components/Pages/FavoritesPage/FavoritesPage.tsx
import { useSelector } from 'react-redux';
import { useGetFavoritesQuery } from '../../../store/apiSlice';
import { type RootState } from '../../../store/store';
import CardProducts from '../MainPage/CardProducts';
import '../MainPage/MainPage.css';

const FavoritesPage = () => {
  const { profile } = useSelector((state: RootState) => state.auth);
  const { data: favs = [], isLoading, isError } = useGetFavoritesQuery(profile?.firebaseUid!, { skip: !profile });

  if (!profile) return <div className="main-container"><h2>Пожалуйста, войдите, чтобы увидеть избранное.</h2></div>;
  if (isLoading) return <div className="main-container"><p>Загрузка...</p></div>;
  if (isError) return <div className="main-container"><p>Ошибка загрузки.</p></div>;

  return (
    <div className="main-container">
      <h1>Избранное</h1>
      {favs.length > 0 ? (
        <div className="products-grid">{favs.map(p => <CardProducts key={p._id} product={p} />)}</div>
      ) : (<p>У вас пока нет избранных товаров.</p>)}
    </div>
  );
};
export default FavoritesPage;