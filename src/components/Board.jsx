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
    const [prev, setPrev] = useState(-1);
    const [block, setBlock] = useState(false);

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
        tabla(1, "newGame");
        let images = [];
        const obtenerImagenes = async () => {
            const url = `https://pixabay.com/api/?key=${import.meta.env.VITE_IMAGES_KEY}&q=hardware&per_page=${(size*size)/2}&page=${1}`;
            const respuesta = await axios(url);
            respuesta.data.hits.forEach((el) => {
                let data = {
                    image: el.previewURL,
                    rotate: false,
                    correct: false,
                    wrong: false,
                    ref: uuidv4(),
                    index: 1,
                    id: 1
                }
                images.push(data);
            });
            let random = pickRandom(images, (size*size) / 2);
            let random2 = mezclar([...random, ...random]);
            let random3 = [];
            random2.forEach((el, index) => {
                let newObj = {...el};
                newObj.id = uuidv4();
                newObj.index = index;
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
    const picks = async card => {
        if(!block && card.correct === false){
            imagenes[card.index].rotate = true;
            setImagenes([...imagenes]);
            if(prev != -1){
                tabla(2, "elegido");
            } else{
                tabla(3, "elegido");
            }
            if(prev != -1){
                if(imagenes[prev].id !== imagenes[card.index].id){
                    setBlock(true);
                    if(imagenes[prev].ref === imagenes[card.index].ref){
                        imagenes[prev].correct = true;
                        imagenes[card.index].correct = true;
                        setImagenes([...imagenes]);
                        console.log("hola 1");
                        tabla(4, "correcto");
                        setPrev(-1);
                        tabla(5, "elegir");
                        setBlock(false);
                    } else{
                        imagenes[prev].wrong = true;
                        imagenes[card.index].wrong = true;
                        console.log("hola 2");
                        tabla(4, "incorrecto");
                        setImagenes([...imagenes]);
                        setTimeout(() => {
                            setPrev(-1);
                            imagenes[prev].wrong = false;
                            imagenes[card.index].wrong = false;
                            imagenes[prev].rotate = false;
                            imagenes[card.index].rotate = false;
                            setImagenes([...imagenes]);
                            tabla(6, "elegir");
                            setBlock(false);
                        }, 1000);
                    }
                }
            } else{
                setPrev(card.index);
            }
        }
    }

    return(
        <>
            <Container>
                { imagenes.map((el, index) => <Card key={index} picks={picks} data={el}/>)}
            </Container>
        </>
    )
}

export default Board;