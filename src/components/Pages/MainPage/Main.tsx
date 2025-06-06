import { useState } from "react";
import Category from "./Category";



const Main = () => {
    let [text,setText] = useState<string>('')
    return (
        <div>
            <header className="container">
                <input type="text" value={text} onChange={e => setText(e.target.value)}/>
                <button>Поиск</button>
                <button>фильтры</button>
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
