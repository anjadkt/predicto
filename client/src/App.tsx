import { Route, Routes } from 'react-router'
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RootRedirect from "./routes/RootRedirect";
import MainLayout from './layouts/MianLayout';
import PredictionPage from './pages/Prediction';

function App() {

  return (
    <>
      <Routes>

        <Route path="/root" element={<RootRedirect />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute role='predictor' />}>

          <Route element={<MainLayout />}>

            <Route path="/" element={<PredictionPage />} />
            <Route path="/creator/predictions" element={<></>} />
            <Route path="/creator/profile" element={<></>} />

          </Route>

        </Route>

        <Route element={<ProtectedRoute role='creator' />}>

          <Route element={<MainLayout />}>

            <Route path="/creator/dashboard" element={<></>} />
            <Route path="/creator/predictions" element={<></>} />
            <Route path="/creator/profile" element={<></>} />

          </Route>

        </Route>

      </Routes >

    </>
  )
}

export default App
