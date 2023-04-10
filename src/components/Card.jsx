import React, {useEffect, useState} from "react";

const Card = ({data, picks, openImages}) => {

    const [rotado, setRotado] = useState(false);

    useEffect(() => {
        let checked = openImages.indexOf(data);
        if(checked != -1){
            setRotado(true);
        } else{
            setRotado(false);
        }
    }, [openImages]);

    return(
        <div onClick={() => picks(data)} className={`card`}>
            <div className={`card-front ${rotado ? "turned" : ""}`}>
                <img src="./microchip.png"/>
            </div>
            <div className={`card-back ${rotado ? "" : "turned"}`}>
                <img src={data.image}/>
            </div>
        </div>
    )
}

export default Card;