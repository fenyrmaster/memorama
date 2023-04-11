import React, {useEffect, useState} from "react";

const Card = ({data, picks}) => {

    const flipped = data.rotate ? "turned" : "";
    const flippedOp = data.rotate ? "" : "turned";
    const correct = data.correct ? "correct" : "";
    const incorrect = data.wrong ? "incorrect" : "";

    return(
        <div onClick={() => picks(data)} className={`card`}>
            <div className={`card-front ${flipped}`}>
                <img src="./microchip.png"/>
            </div>
            <div className={`card-back ${flippedOp} ${correct} ${incorrect}`}>
                <img src={data.image}/>
            </div>
        </div>
    )
}

export default Card;