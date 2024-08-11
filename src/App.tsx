import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/singup"; 
import HomePasge from "./pages/home";
import BoardPage from "./pages/board";
import BoardsetPage from "./pages/boardSet";
import TaskPage from "./pages/task"; "./pages/task";

const routers = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/singup", element: <SignupPage /> },
  { path: "/home", element: <HomePasge /> },
  { path: "/board", element: <BoardPage /> },
  { path: "/boardSet", element: <BoardsetPage/> },
  { path: "/task", element: <TaskPage/> },
  
]);

function App() {
  return <RouterProvider router={routers} />;
}

export default App;
