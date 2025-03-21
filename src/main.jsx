import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import AppRouter from "./routers/Routers.jsx";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {SearchProvider} from "src/context/SearchContext.jsx";
import {LobbyProvider} from "src/context/LobbyContext.jsx";
import {DeadlineProvider} from "src/context/DeadlineContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
            <SearchProvider>
                <DeadlineProvider>
                    <ToastContainer/>
                    <AppRouter/>
                </DeadlineProvider>
            </SearchProvider>
    </StrictMode>,
)
