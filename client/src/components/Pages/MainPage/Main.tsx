import { useState } from "react";
import './MainPage.css'
import Category from "./Category";



const Main = () => {
    let [text,setText] = useState<string>('')
    return (
        <div>
            <header className="container header">
                <input placeholder="Я ищу..." className="search" type="text" value={text} onChange={e => setText(e.target.value)}/>
                <button className="searchButton">Поиск</button>
                <button className="filter">фильтры</button>
            </header>
            <main>
                <section>
                    <Category/>
                </section> 
            </main>
        </div>
    );
}

export default Main;
