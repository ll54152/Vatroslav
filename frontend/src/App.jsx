import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import ExperimentAdd from './pages/ExperimentAdd.jsx';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import Experiments from './pages/Experiments.jsx';
import ExperimentView from './pages/ExperimentView.jsx';
import ComponentView from './pages/ComponentView';
import ExperimentEdit from "./pages/ExperimentEdit";
import ComponentAdd from './pages/ComponentAdd.jsx';
import Components from './pages/Components.jsx';
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountManagement from "./pages/AccountManagement";

function App() {
    return (
        <Routes>
            <Route index element={<Home/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/Login" element={<Login/>}/>
            <Route path="/Signup" element={<Signup/>}/>
            <Route path="/MainPage" element={<MainPage/>}/>
            <Route path="/experiments" element={<Experiments/>}/>
            <Route path="/experiment/view/:id" element={<ExperimentView/>}/>
            <Route path="/experiment/edit/:id" element={<ExperimentEdit/>}/>
            <Route path="/experiment/add" element={<ExperimentAdd/>}/>
            <Route path="/component/view/:id" element={<ComponentView/>}/>
            <Route path="/component/add" element={<ComponentAdd/>}/>
            <Route path="/components" element={<Components/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
            <Route path="/reset-password" element={<ResetPassword/>}/>
            <Route path="/account" element={<AccountManagement/>}/>

        </Routes>
    );
}

export default App;