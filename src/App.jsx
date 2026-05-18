import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home
from "./pages/Home";

import Boats
from "./pages/Boats";

import Tripulacion
from "./pages/Tripulacion";

import Actividades
from "./pages/Actividades";

import Recursos
from "./pages/Recursos";

import Bricos
from "./pages/Bricos";

import Compraventa
from "./pages/Compraventa";

import Privacidad
from "./pages/Privacidad";

import ProtectedRoute
from "./components/ProtectedRoute";

import ChatActividad
from "./pages/ChatActividad";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME PUBLICA */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* PRIVACIDAD PUBLICA */}

        <Route
          path="/privacidad"
          element={<Privacidad />}
        />

        {/* PAGINAS PRIVADAS */}

        <Route
          path="/barcos"
          element={
            <ProtectedRoute>
              <Boats />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tripulacion"
          element={
            <ProtectedRoute>
              <Tripulacion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/actividades"
          element={
            <ProtectedRoute>
              <Actividades />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recursos"
          element={
            <ProtectedRoute>
              <Recursos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/compraventa"
          element={
            <ProtectedRoute>
              <Compraventa />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bricos"
          element={
            <ProtectedRoute>
              <Bricos />
            </ProtectedRoute>
          }
        />

<Route
  path="/chat/:actividadId/:userId"
  element={
    <ProtectedRoute>
      <ChatActividad />
    </ProtectedRoute>
  }
/>


      </Routes>

    </BrowserRouter>

  );
}