import { Route, Routes } from 'react-router'
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RootRedirect from "./routes/RootRedirect";
import MainLayout from './layouts/MianLayout';
import PredictionPage from './pages/Prediction';
import LiveStats from './pages/LiveStats';
import LeaderBoard from './pages/LeaderBoard';
import Users from './pages/Users';
import CreatePrediction from './pages/CreatePrediction';

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
            <Route path="/live" element={<LiveStats />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />

          </Route>

        </Route>

        <Route element={<ProtectedRoute role='creator' />}>

          <Route element={<MainLayout />}>

            <Route path="/users" element={<Users />} />
            <Route path="/prediction" element={<CreatePrediction />} />
            <Route path="/prediction/:id" element={<></>} />

          </Route>

        </Route>

      </Routes >

    </>
  )
}

export default App
