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
        comparar: 4
    }


    const [estado, setEstado] = useState(0);
    const [compare, setCompare] = useState([]);

    // Estado ya esta definida, por lo que solo le pasamos la entrada
    const tabla = entrada => {
        if(estado === tabla_estados.finJuego && entrada === "Inicio"){
            setEstado(tabla_estados.menu);
        }
        else if(estado === tabla_estados.menu && entrada === "newGame"){
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