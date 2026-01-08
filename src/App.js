import { ToastContainer } from 'react-toastify';
import Router from './router/Router'
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            {/* Diğer componentler */}
            <Router/>

            <ToastContainer position="top-center" />
        </>
    );
}

export default App
