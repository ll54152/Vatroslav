import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Experimentunos from './pages/Experimentunos';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import Experimenti from './pages/Experimenti';
import Experimentiprimjer from './pages/Experimentiprimjer';
import Komponenteprimjer from './pages/Komponenteprimjer';
import EksperimentEdit from "./pages/EksperimentEdit";
import Komponenteunos from './pages/Komponenteunos';
import Komponente from './pages/Komponente';

function App() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/MainPage" element={<MainPage />} />
            <Route path="/Experimenti" element={<Experimenti />} />
            <Route path="/experimentiprimjer/:id" element={<Experimentiprimjer />} />
            <Route path="/experimenti/edit/:id" element={<EksperimentEdit />} />
            <Route path="/komponenteprimjer/:id" element={<Komponenteprimjer />} />
            <Route path="/Experimentunos" element={<Experimentunos />} />
            <Route path="/Komponenteunos" element={<Komponenteunos />} />
            <Route path="/Komponente" element={<Komponente />} />
        </Routes>
    );
}

export default App;