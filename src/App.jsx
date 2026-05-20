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

import MisChats from "./pages/MisChats";

import ChatGrupoActividad
from "./pages/ChatGrupoActividad";

import Conversacion from "./pages/Conversacion";

import ResetPassword
from "./pages/ResetPassword";

import UpdatePassword
from "./pages/UpdatePassword";

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
  path="/mis-chats"
  element={<MisChats />}
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
  path="/conversacion/:conversacionId"
  element={
    <ProtectedRoute>
      <Conversacion />
    </ProtectedRoute>
  }
/>


<Route
  path="/chat-grupo/:actividadId"
  element={
    <ChatGrupoActividad />
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

<Route
  path="/reset-password"
  element={<ResetPassword />}
/>

<Route
  path="/update-password"
  element={<UpdatePassword />}
/>

      </Routes>

    </BrowserRouter>

  );
}