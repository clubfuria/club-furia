import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Boats from "./pages/Boats";
import Tripulacion from "./pages/Tripulacion";
import Actividades from "./pages/Actividades";
import Recursos from "./pages/Recursos";
import Bricos from "./pages/Bricos";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/barcos"
          element={<Boats />}
        />

        <Route
          path="/tripulacion"
          element={<Tripulacion />}
        />

        <Route
          path="/actividades"
          element={<Actividades />}
        />

        <Route
          path="/recursos"
          element={<Recursos />}
        />

        <Route
          path="/bricos"
          element={<Bricos />}
        />

      </Routes>

    </BrowserRouter>

  );
}