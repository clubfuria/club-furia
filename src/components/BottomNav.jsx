import { Link, useLocation }
from "react-router-dom";

import {
  House,
  Sailboat,
  Users,
  Calendar,
  Wrench,
  Folder,
} from "lucide-react";

export default function BottomNav() {

  const location =
    useLocation();

  const isActive = (path) =>
    location.pathname === path;

  const buttonStyle = (path) => ({

    flex: 1,

    textAlign: "center",

    color: isActive(path)
      ? "#e7eb0f"
      : "white",

    textDecoration: "none",

    fontSize: "13px",

    fontWeight: "bold",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

  });

  return (

    <div
      style={{

        position: "fixed",

        bottom: 0,

        left: 0,

        width: "100%",

        height: "70px",

        backgroundColor:
          "#001b44",

        display: "flex",

        borderTop:
          "2px solid #333",

        zIndex: 9999,

      }}
    >

      <Link
        to="/"
        style={buttonStyle("/")}
      >
        <House size={22} />
        <div>Inicio</div>
      </Link>

      <Link
        to="/barcos"
        style={buttonStyle(
          "/barcos"
        )}
      >
        <Sailboat size={22} />
        <div>Barcos</div>
      </Link>

      <Link
        to="/tripulacion"
        style={buttonStyle(
          "/tripulacion"
        )}
      >
        <Users size={22} />
        <div>Tripulación</div>
      </Link>

      <Link
        to="/actividades"
        style={buttonStyle(
          "/actividades"
        )}
      >
        <Calendar size={22} />
        <div>Actividades</div>
      </Link>

      <Link
        to="/bricos"
        style={buttonStyle(
          "/bricos"
        )}
      >
        <Wrench size={22} />
        <div>Bricos</div>
      </Link>

      <Link
        to="/recursos"
        style={buttonStyle(
          "/recursos"
        )}
      >
        <Folder size={22} />
        <div>Recursos</div>
      </Link>

    </div>

  );
}