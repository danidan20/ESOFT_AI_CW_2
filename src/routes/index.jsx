import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ChatApp from "./../component/chatbot";

const Routes = () => {
  
    const routesForPublic = [
        {
            path: "/",
            element: <ChatApp />,
        }
    ];

    const router = createBrowserRouter(routesForPublic);

    return <RouterProvider router={router} />;
};

export default Routes;