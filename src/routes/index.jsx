import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ChatApp from "./../component/chatbot";
import {TeachMe,DynamicFacts,StaticFacts,Session} from "./../component/screen/admin";

const Routes = () => {

    const routesForPublic = [
        {
            path: "/",
            element: <ChatApp />,
        }
    ];

    const routesForAdmin = [
        {
            path: "/admin",
            element: <PrivateRoute><Dashboard /></PrivateRoute>,
            children: [
                { path: "teach-me", element: <TeachMe /> },
                { path: "dynamic-facts", element: <DynamicFacts /> },
                { path: "static-facts", element: <StaticFacts /> },
                { path: "session", element: <Session /> },
            ]
        }
    ];

    const router = createBrowserRouter([...routesForPublic, ...routesForAdmin]);

    return <RouterProvider router={router} />;
};

export default Routes;