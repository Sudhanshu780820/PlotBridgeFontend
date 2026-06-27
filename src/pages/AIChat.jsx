import { useState } from "react";
import { searchProperties } from "../services/aiService";

export default function AIChat(){

    const [city,setCity]=useState("");
    const [result,setResult]=useState([]);

    const search=async()=>{

        const data=await searchProperties({
            city,
            budget:3000000
        });

        setResult(data.properties);

    }

    return(

        <div>

            <input
                placeholder="City"
                value={city}
                onChange={(e)=>setCity(e.target.value)}
            />

            <button onClick={search}>
                Search
            </button>

            {
                result.map(plot=>

                    <div key={plot._id}>

                        <h3>{plot.title}</h3>

                        <p>{plot.location}</p>

                        <p>₹ {plot.price}</p>

                    </div>

                )
            }

        </div>

    )

}