import React, { useState, useEffect, useContext } from "react";
import EstadoContext from "../context/estadoContext";
import styled from "@emotion/styled";
import axios from "axios";
import Card from "./Card";
import { v4 as uuidv4 } from 'uuid';
import { css } from "@emotion/react";

const Board = ({sizeBoard}) => {

    const [size, setSize] = useState(sizeBoard);
    const [loader, setLoader] = useState(true);
    const [imagenes, setImagenes] = useState([]);
    const [openImages, setOpenImages] = useState([]);
    const [clearedImages, setClearedImages] = useState([]);
    const [compare, setCompare] = useState([]);

    const estadoContext = useContext(EstadoContext);
    const { estado, tabla } = estadoContext;

    const pickRandom = (array, items) => {
        const clonedArray = [...array]
        const randomPicks = [];
    
        for (let index = 0; index < items; index++) {
            // Elejimos una imagen random de el arreglo de imagenes
            const randomIndex = Math.floor(Math.random() * clonedArray.length)
            
            // Ponemos en el arreglo aleatorio
            randomPicks.push(clonedArray[randomIndex]);
            // Quitamos esa imagen del arreglo principal, para evitar que se duplique
            clonedArray.splice(randomIndex, 1);
        }
    
        return randomPicks
    }

    // Desordena de forma aleatoria las imagenes
    const mezclar = array => {
        const clonedArray = [...array]

        // Le damos a cada elemento su propio identificador unico
    
        for (let index = clonedArray.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index + 1))
            const original = clonedArray[index]
    
            clonedArray[index] = clonedArray[randomIndex]
            clonedArray[randomIndex] = original
        }

        return clonedArray
    }

    useEffect(() => {
        tabla("newGame");
        let images = [];
        const obtenerImagenes = async () => {
            const url = `https://pixabay.com/api/?key=${import.meta.env.VITE_IMAGES_KEY}&q=tecnologia&per_page=${(size*size)/2}&page=${1}`;
            const respuesta = await axios(url);
            respuesta.data.hits.forEach((el) => {
                let data = {
                    image: el.previewURL,
                    id: 1
                }
                images.push(data);
            });
            let random = pickRandom(images, (size*size) / 2);
            let random2 = mezclar([...random, ...random]);
            let random3 = [];
            random2.forEach(el => {
                let newObj = {...el};
                newObj.id = uuidv4();
                random3.push(newObj);
            })
            setImagenes(random3);
        }
        obtenerImagenes();
    }, []);

    const Container = styled.div`
        grid-gap: 1rem;
        padding: 1rem;
        background-color: white;
        display: grid;
        border-radius: .5rem;
        perspective: 150rem;
        -moz-perspective: 150rem;
        grid-template-columns: repeat(${size}, 1fr);
        grid-template-rows: repeat(${size}, 1fr);
    `;

    // La funcion que controla los correctos
    const picks = card => {
        if(openImages.indexOf(card) != -1){
            setOpenImages([...openImages, card]);
        }
    }

    return(
        <>
            <Container>
                { imagenes.map((el, index) => <Card key={index} picks={picks} openImages={openImages} setOpenImages={setOpenImages} data={el}/>)}
            </Container>
        </>
    )
}

export default Board;