import React, { useState, useEffect, useContext } from "react";
import EstadoContext from "../context/estadoContext";
import styled from "@emotion/styled";
import axios from "axios";
import Card from "./Card";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from 'uuid';
import { css } from "@emotion/react";
import confetti from "canvas-confetti";
import { useNavigate } from "react-router-dom";

const Board = ({sizeBoard}) => {

    const [size, setSize] = useState(sizeBoard);
    const [loader, setLoader] = useState(true);
    const [imagenes, setImagenes] = useState([]);
    const [prev, setPrev] = useState(-1);
    const [block, setBlock] = useState(false);
    const navigate = useNavigate();

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

    const obtenerImagenes = async () => {
        let images = [];
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

    useEffect(() => {
        tabla(estado, "newGame");
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

    const gameEnded = estadoAct => {
        let flag = true;
        imagenes.forEach(el => {
            if(!el.correct){
                flag = false;
            }
        })
        if(flag){
            let final = tabla(estadoAct, "completo");
            let colors = ['#bb0000', '#ffffff', "#00ff08", "#ffa200", "#eeff00", "#0800ff"];
            let celebrateInt = setInterval(() => {
                confetti({
                    particleCount: 6,
                    angle: 60,
                    spread: 100,
                    drift: Math.random(),
                    origin: { x: 0 },
                    colors,
                    ticks: 300
                });
                confetti({
                    particleCount: 6,
                    angle: 120,
                    spread: 100,
                    drift: (Math.random()-1),
                    origin: { x: 1 },
                    colors,
                    ticks: 300
                });
            }, 6);
            setTimeout(() => {
                clearInterval(celebrateInt);
            }, 4000);
            Swal.fire({
                title: "Has completado el memorama!",
                text: "Quieres volver a intentarlo con otro orden?",
                icon: "success",
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si!',
                showCancelButton: true,
                cancelButtonText: "No"
            }).then((result) => {
                if(result.isConfirmed){
                    tabla(final, "newGame");
                    obtenerImagenes();
                } else if(result.isDismissed){
                    tabla(final, "finC");
                }
            });
            return true;
        }
        else{
            return false
        }
    }

    // La funcion que controla los correctos
    const picks = async card => {
        if(!block && card.correct === false && card.index != prev){
            imagenes[card.index].rotate = true;
            setImagenes([...imagenes]);
            let comparar = tabla(estado, "elegido");
            if(comparar == 4){
                setBlock(true);
                if(imagenes[prev].ref === imagenes[card.index].ref){
                    imagenes[prev].correct = true;
                    imagenes[card.index].correct = true;
                    setImagenes([...imagenes]);
                    comparar = tabla(comparar, "correcto");
                    setPrev(-1);
                    // Validacion para verificar si el juego ha sido completado
                    let actual = gameEnded(comparar);
                    if(actual == false){
                        tabla(comparar, "elegir");
                    }
                    setBlock(false);
                } else{
                    imagenes[prev].wrong = true;
                    imagenes[card.index].wrong = true;
                    comparar = tabla(comparar, "incorrecto");
                    setImagenes([...imagenes]);
                    setTimeout(() => {
                        setPrev(-1);
                        imagenes[prev].wrong = false;
                        imagenes[card.index].wrong = false;
                        imagenes[prev].rotate = false;
                        imagenes[card.index].rotate = false;
                        setImagenes([...imagenes]);
                        tabla(comparar, "elegir");
                        setBlock(false);
                    }, 1000);
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