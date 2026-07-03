import { Route, Routes } from 'react-router'
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RootRedirect from "./routes/RootRedirect";

function App() {

  return (
    <>
      <Routes>

        <Route path="/root" element={<RootRedirect />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<></>} />
        </Route>

      </Routes >

    </>
  )
}

export default App
