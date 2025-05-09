import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ChatApp from "./../component/chatbot";
import { TeachMe, DynamicFacts, StaticFacts } from "./../component/screen/admin";
import SystemUser from "../SystemUser";

const Routes = () => {

    const routesForPublic = [
        {
            path: "/",
            element: <ChatApp />,
        },
        {
            path: "/admin",
            element: <SystemUser />,
            children: [
                { path: "", element: <TeachMe /> },
                { path: "dynamic-facts", element: <DynamicFacts /> },
                { path: "static-facts", element: <StaticFacts /> }
            ]
        }
    ];

    const router = createBrowserRouter([...routesForPublic]);

    return <RouterProvider router={router} />;
};

export default Routes;