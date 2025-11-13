import { Routes, Route } from 'react-router-dom'; 
import Navbar from './components/Navbar'; 
import Home from './pages/Home'; 
import Raid from './pages/Raid'; 
import Boss from './pages/Boss'; 
import Trash from './pages/Trash'; 

export default function App() {
  return (
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/raid/:raidId' element={<Raid/>}/>
        <Route path='/raid/:raidId/boss/:bossId' element={<Boss/>}/>
        <Route path='/raid/:raidId/trash/:trashId' element={<Trash/>}/>
      </Routes>
    </div>
  );
}
