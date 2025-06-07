// import React from 'react';

import { useNavigate } from "react-router-dom"


interface CategoryType {
    name: string
    link: string 
    img: string
    bgColor: string
}

const Category = () => {
    let navigate = useNavigate()
    let category:CategoryType[] = [
    {
        name: "Одежда",
        link: "odezhda",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#FFE4E1" // светло-розовый
    },
    {
        name: "Обувь",
        link: "obuv",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#E6F3FF" // светло-голубой
    },
    {
        name: "Аксессуары",
        link: "aksessuary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#F0E6FF" // светло-фиолетовый
    },
    {
        name: "Бытовая техника",
        link: "bytovaya-tehnika",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#E6FFE6" // светло-зеленый
    },
    {
        name: "Смартфоны",
        link: "smartfony",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#FFF0E6" // светло-оранжевый
    },
    {
        name: "Компьютеры",
        link: "kompyutery",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#E6F7FF" // светло-бирюзовый
    },
    {
        name: "Мебель",
        link: "mebel",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#F5F5DC" // светло-бежевый
    },
    {
        name: "Детские товары",
        link: "detskie-tovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#FFE4FF" // светло-розово-фиолетовый
    },
    {
        name: "Косметика",
        link: "kosmetika",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#FFEBCD" // светло-персиковый
    },
    {
        name: "Продукты",
        link: "produkty",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#F0FFF0" // светло-мятный
    },
    {
        name: "Спорт и отдых",
        link: "sport-otdyh",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#E0FFFF" // светло-голубой аква
    },
    {
        name: "Автотовары",
        link: "avtotovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#F5F5F5" // светло-серый
    },
    {
        name: "Канцтовары",
        link: "kanctovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#FFFACD" // светло-желтый
    },
    {
        name: "Зоотовары",
        link: "zootovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#E6FFE6" // светло-зеленый лайм
    },
    {
        name: "Часы и украшения",
        link: "chasy-ukrasheniya",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png",
        bgColor: "#FFE4B5" // светло-золотистый
    }
]

    function LinkForCategory(link: string) {
        navigate(`/${link}`)
    }

    return (
        <div className="container category-container">
            <div className="category-grid">
                {category.map((el: CategoryType) => (
                    <div onClick={() => LinkForCategory(el.link)} style={{background:el.bgColor}} className="cardForCategory" key={el.link}>
                        <img src={el.img} alt={el.name} />
                        <h3>{el.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Category;
