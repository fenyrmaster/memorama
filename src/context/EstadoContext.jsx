import React, { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

const EstadoContext = createContext();

const EstadoProvider = ({ children }) => {

    const navigate = useNavigate();

    const tabla_estados = {
        finJuego: 0,
        menu: 1,
        elegirPrimeraOpcion: 2,
        elegirSegundaOpcion: 3,
        comparar: 4,
        correcto: 5,
        incorrecto: 6
    }


    const [estado, setEstado] = useState(0);
    const [compare, setCompare] = useState([]);

    // Estado ya esta definida, por lo que solo le pasamos la entrada
    const tabla = (currentState, entrada) => {
        if(currentState === tabla_estados.finJuego && entrada === "Inicio"){
            setEstado(tabla_estados.menu);
        }
        else if(currentState === tabla_estados.menu && entrada === "newGame"){
            setEstado(tabla_estados.elegirPrimeraOpcion);
        }
        else if(currentState === tabla_estados.elegirPrimeraOpcion && entrada === "elegido"){
            setEstado(tabla_estados.elegirSegundaOpcion);
            console.log("pase a segunda");
        }
        else if(currentState === tabla_estados.elegirSegundaOpcion && entrada === "elegido"){
            setEstado(tabla_estados.comparar);
            console.log("pase a comparar");
            console.log(estado);
        }
        else if(currentState === tabla_estados.comparar && entrada === "correcto"){
            setEstado(tabla_estados.correcto);
            console.log("pase a correcto");
        }
        else if(currentState === tabla_estados.comparar && entrada === "incorrecto"){
            setEstado(tabla_estados.incorrecto);
            console.log("pase a incorrecto");
        }
        else if((currentState === tabla_estados.correcto || tabla_estados.incorrecto) && entrada === "elegir"){
            setEstado(tabla_estados.elegirPrimeraOpcion);
        }
        else{
            setEstado(tabla_estados.finJuego);
            navigate("/");
        }
    }

    return(
        <EstadoContext.Provider
        value={{
            // Variables
            estado,
            //Funciones
            tabla
        }}>
            {children}
        </EstadoContext.Provider>
    )
}

export{
    EstadoProvider
}

export default EstadoContext;