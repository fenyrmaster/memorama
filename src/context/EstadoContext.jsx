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
        incorrecto: 6,
        opcionFinal: 7
    }


    const [estado, setEstado] = useState(0);
    const [compare, setCompare] = useState([]);

    // Estado ya esta definida, por lo que solo le pasamos la entrada
    const tabla = (currentState, entrada) => {
        //Principio del automata
        if(currentState === tabla_estados.finJuego && entrada === "Inicio"){
            setEstado(tabla_estados.menu);
            return tabla_estados.menu;
        }
        //f(q1, newGame) = q2
        else if(currentState === tabla_estados.menu && entrada === "newGame"){
            setEstado(tabla_estados.elegirPrimeraOpcion);
            return tabla_estados.elegirPrimeraOpcion;
        }
        //f(q2, elegido) = q3
        else if(currentState === tabla_estados.elegirPrimeraOpcion && entrada === "elegido"){
            setEstado(tabla_estados.elegirSegundaOpcion);
            return tabla_estados.elegirSegundaOpcion;
        }
        //f(q3, elegido) = q4
        else if(currentState === tabla_estados.elegirSegundaOpcion && entrada === "elegido"){
            setEstado(tabla_estados.comparar);
            return tabla_estados.comparar;
        }
        //f(q4, correcto) = q5
        else if(currentState === tabla_estados.comparar && entrada === "correcto"){
            setEstado(tabla_estados.correcto);
            return tabla_estados.correcto;
        }//f(q4, incorrecto) = q6
        else if(currentState === tabla_estados.comparar && entrada === "incorrecto"){
            setEstado(tabla_estados.incorrecto);
            return tabla_estados.incorrecto;
        }//f(q5, elegir) = q2, f(q6, elegir) = q2
        else if((currentState === tabla_estados.correcto || tabla_estados.incorrecto) && entrada === "elegir"){
            setEstado(tabla_estados.elegirPrimeraOpcion);
            return tabla_estados.elegirPrimeraOpcion;
        }//f(q5, completo) = q7
        else if(currentState === tabla_estados.correcto && entrada === "completo"){
            setEstado(tabla_estados.opcionFinal);
            return tabla_estados.opcionFinal;
        }//f(q7, newGame) = q2
        else if(currentState === tabla_estados.opcionFinal && entrada === "newGame"){
            setEstado(tabla_estados.elegirPrimeraOpcion);
            return tabla_estados.elegirPrimeraOpcion;
        }//Fin del juego / Aceptacion de la cadena
        else if(currentState === tabla_estados.opcionFinal && entrada === "finC"){
            setEstado(tabla_estados.finJuego);
            navigate("/");
        }
        //Este ultimo es lo equivalente al estado inicial que cualquier entrada invalida llegara aqui
        //En el caso de nuestro codigo, se considerara algo que no debio de haber pasado y todo se reiniciara
        //Comenzando desde el estado inicial
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