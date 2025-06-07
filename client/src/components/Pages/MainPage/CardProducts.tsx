import type { ProductCardType } from "../../Types/Types";
import heartBlack from '../../../images/сердцочерное.png'




const CardProducts = () => {


    let products: ProductCardType[] = [
    {
        _id: "674f8a5b2e1d4c8f9a123456",
        title: "Джинсы Levi's 501",
        price: 4500,
        containerCoordinates: { x: 100, y: 200 },
        image: "https://i.pinimg.com/736x/10/3f/14/103f1470071cee4a6470072a7fa9250a.jpg",
        category: "clothing",
        author: "674f8a5b2e1d4c8f9a654321",
        quantity: 2,
        additionalInfo: "Классические прямые джинсы, темно-синие, отличное состояние",
        createDate: "2024-12-01T10:30:00.000Z",
        sizes: [{ type: "32" }, { type: "34" }]
    },
    {
        _id: "674f8a5b2e1d4c8f9a123457",
        title: "Футболка Adidas Originals",
        price: 1800,
        containerCoordinates: { x: 150, y: 300 },
        image: "https://i.pinimg.com/736x/10/3f/14/103f1470071cee4a6470072a7fa9250a.jpg",
        category: "clothing",
        author: "674f8a5b2e1d4c8f9a654322",
        quantity: 5,
        additionalInfo: "100% хлопок, белая с черным логотипом, новая",
        createDate: "2024-11-28T14:20:00.000Z",
        sizes: [{ type: "S" }, { type: "M" }, { type: "L" }]
    },
    {
        _id: "674f8a5b2e1d4c8f9a123458",
        title: "Платье Zara миди",
        price: 3200,
        containerCoordinates: { x: 75, y: 180 },
        image: "https://i.pinimg.com/736x/10/3f/14/103f1470071cee4a6470072a7fa9250a.jpg",
        category: "clothing",
        author: "674f8a5b2e1d4c8f9a654323",
        quantity: 1,
        additionalInfo: "Черное платье миди, рукав 3/4, надевала пару раз",
        createDate: "2024-11-30T09:15:00.000Z",
        sizes: [{ type: "S" }]
    },
    {
        _id: "674f8a5b2e1d4c8f9a123459",
        title: "Кроссовки Nike Air Force",
        price: 8500,
        containerCoordinates: { x: 220, y: 120 },
        image: "https://i.pinimg.com/736x/10/3f/14/103f1470071cee4a6470072a7fa9250a.jpg",
        category: "shoes",
        author: "674f8a5b2e1d4c8f9a654324",
        quantity: 1,
        additionalInfo: "Размер 42, белые, практически новые",
        createDate: "2024-11-25T16:45:00.000Z",
        sizes: [{ type: "42" }]
    },
    {
        _id: "674f8a5b2e1d4c8f9a123460",
        title: "Свитер H&M",
        price: 2200,
        containerCoordinates: { x: 300, y: 250 },
        image: "https://i.pinimg.com/736x/10/3f/14/103f1470071cee4a6470072a7fa9250a.jpg",
        category: "clothing",
        author: "674f8a5b2e1d4c8f9a654325",
        quantity: 1,
        additionalInfo: "Теплый вязаный свитер, серый цвет, размер M",
        createDate: "2024-11-20T11:30:00.000Z",
        sizes: [{ type: "M" }]
    },
    {
        _id: "674f8a5b2e1d4c8f9a123461",
        title: "Куртка Zara",
        price: 5500,
        containerCoordinates: { x: 180, y: 80 },
        image: "https://i.pinimg.com/736x/10/3f/14/103f1470071cee4a6470072a7fa9250a.jpg",
        category: "clothing",
        author: "674f8a5b2e1d4c8f9a654326",
        quantity: 1,
        additionalInfo: "Демисезонная куртка, черная, хорошее состояние",
        createDate: "2024-11-15T13:00:00.000Z",
        sizes: [{ type: "L" }]
    }
]


    return (
        <div className="CardsProduct">
            {products.map((product) => (
                <div key={product._id} className="Product">
                    <div className="Product-image-container">
                        <img 
                            src={product.image} 
                            alt={product.title}
                            className="Product-image"
                        />
                        <button className="Product-favorite">
                            <svg viewBox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="Product-content">
                        <div className="Product-price">
                            {product.price.toLocaleString()} ₽
                        </div>
                        
                        <div className="Product-category">
                            {product.category}
                        </div>
                        
                        <h3 className="Product-title">
                            {product.title}
                        </h3>
                        
                        <p className="Product-info">
                            {product.additionalInfo}
                        </p>
                        
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="Product-sizes">
                                Размеры: {product.sizes.map(size => size.type).join(' • ')}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CardProducts;
