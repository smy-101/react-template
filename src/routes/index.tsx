import {createBrowserRouter, RouterProvider} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div className='underline'>Hello world!</div>,
  },
]);

const Routers = () => {
  return <RouterProvider router={router} />;
};

export {Routers};
