import React, { useState, useEffect, useContext } from 'react'
import EstadoContext from '../context/estadoContext';
import {Link} from "react-router-dom"

const MenuMemorama = () => {

  const [intervalo, setIntervalo] = useState(1);
  const estadoContext = useContext(EstadoContext);
  const { tabla } = estadoContext;

    useEffect(() => {
        const interval = setInterval(() => {
            if(intervalo < 4){
                setIntervalo(intervalo+1);
            } else{
                setIntervalo(1);
            }
          }, 6000);
        return () => clearInterval(interval);
    }, [intervalo]);

    useEffect(() => {
        console.log(estadoContext);
        tabla(0, "Inicio");
    }, [])

  return (
    <>
        <main className='contenedor_principal'>
            <div className='menu'>
                <h1 className='menu-titulo'>Bienvenido al juego de memorama de tecnologia</h1>
                <p className='menu-text'>Elije el tamaño del tablero:</p>
                <div className='menu-opciones'>
                    <Link to={"/4x"} className='menu-opcion'>4X4</Link>
                    <Link to={"/6x"} className='menu-opcion'>6X6</Link>
                    <Link to={"/8x"} className='menu-opcion'>8X8</Link>
                </div>
            </div>
            <div className='hero'>
                { <img className='img-hero' src={`./Hero-${intervalo}.png`}></img> }
                <div className="floating-bg"></div>
            </div>
        </main>
    </>
  )
}

export default MenuMemorama;