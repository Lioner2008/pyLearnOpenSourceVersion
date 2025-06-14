import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router";
import IdeMainPageRoute from "./routes/IdeMainPageRoute.jsx";

const router = createBrowserRouter([
    {
        path:"/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <IdeMainPageRoute/>
            }
        ]
    }
])

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router}/>
    </StrictMode>
)
