import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EstadoProvider } from './context/estadoContext'
import MenuMemorama from './components/Menu'
import Mem4 from './Mem4x'
import Mem6 from './Mem6x'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <EstadoProvider>
        <Routes>
          <Route path='/' element={<MenuMemorama/>}/>
          <Route path='/4x' element={<Mem4/>}/>
          <Route path='/6x' element={<Mem6/>}/>
        </Routes>
      </EstadoProvider>
    </BrowserRouter>
  )
}

export default App;