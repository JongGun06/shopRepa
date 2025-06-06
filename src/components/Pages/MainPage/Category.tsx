// import React from 'react';

interface CategoryType {
    name: string
    link: string 
    img: string
}

const Category = () => {
    let category:CategoryType[] = [
    {
        name: "Одежда",
        link: "odezhda",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Обувь",
        link: "obuv",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Аксессуары",
        link: "aksessuary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Бытовая техника",
        link: "bytovaya-tehnika",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Смартфоны",
        link: "smartfony",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Компьютеры",
        link: "kompyutery",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Мебель",
        link: "mebel",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Детские товары",
        link: "detskie-tovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Косметика",
        link: "kosmetika",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Продукты",
        link: "produkty",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Спорт и отдых",
        link: "sport-otdyh",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Автотовары",
        link: "avtotovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Канцтовары",
        link: "kanctovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Зоотовары",
        link: "zootovary",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    },
    {
        name: "Часы и украшения",
        link: "chasy-ukrasheniya",
        img: "https://img5.lalafo.com/i/category-icon/bb/c7/2c/f8977a90897c902e2698800278.png"
    }
]

    return (
        <div className="container">
            {category.map((el:CategoryType)=> (
                <div className="cardForCategory">
                    <h3>{el.name}</h3>
                    <img src={el.img} />
                </div>
            ))}
        </div>
    );
}

export default Category;
