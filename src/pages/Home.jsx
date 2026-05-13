import { Link } from "react-router-dom";

import BottomNav
from "../components/BottomNav";

import {
  Sailboat,
  Users,
  CalendarDays,
  Wrench,
  FolderOpen,
} from "lucide-react";

export default function Home() {

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#011135",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            color: "#fe5d01",
            fontSize: "64px",
            marginBottom: "10px",
          }}
        >
          CLUB FURIA
        </h1>

        <p
          style={{
            color: "#e7eb0f",
            fontSize: "24px",
          }}
        >
          Comunidad social de
          armadores y tripulaciones
        </p>

      </div>

      {/* GRID MENU */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: "20px",
          marginTop: "30px",
        }}
      >

        {/* BARCOS */}

        <Link
          to="/barcos"
          style={{
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "30px 20px",
              textAlign: "center",
              minHeight: "210px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                marginBottom: "10px",
                color: "#0261e6",
              }}
            >
              <Sailboat size={56} />
            </div>

            <h2
              style={{
                color: "#f20b2a",
                marginBottom: "10px",
              }}
            >
              BARCOS
            </h2>

            <p
              style={{
                color: "#0261e6",
                fontSize: "22px",
                lineHeight: "32px",
              }}
            >
              Registro de flota
              Furia
            </p>

          </div>

        </Link>

        {/* TRIPULACION */}

        <Link
          to="/tripulacion"
          style={{
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "30px 20px",
              textAlign: "center",
              minHeight: "210px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                marginBottom: "10px",
                color: "#0261e6",
              }}
            >
              <Users size={56} />
            </div>

            <h2
              style={{
                color: "#f20b2a",
                marginBottom: "10px",
              }}
            >
              TRIPULACION
            </h2>

            <p
              style={{
                color: "#0261e6",
                fontSize: "22px",
                lineHeight: "32px",
              }}
            >
              Armadores y
              tripulantes
            </p>

          </div>

        </Link>

        {/* ACTIVIDADES */}

        <Link
          to="/actividades"
          style={{
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "30px 20px",
              textAlign: "center",
              minHeight: "210px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                marginBottom: "10px",
                color: "#0261e6",
              }}
            >
              <CalendarDays
                size={56}
              />
            </div>

            <h2
              style={{
                color: "#f20b2a",
                marginBottom: "10px",
              }}
            >
              ACTIVIDADES
            </h2>

            <p
              style={{
                color: "#0261e6",
                fontSize: "22px",
                lineHeight: "32px",
              }}
            >
              Salidas y calendario
            </p>

          </div>

        </Link>

        {/* RECURSOS */}

        <Link
          to="/recursos"
          style={{
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "30px 20px",
              textAlign: "center",
              minHeight: "210px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                marginBottom: "10px",
                color: "#0261e6",
              }}
            >
              <FolderOpen
                size={56}
              />
            </div>

            <h2
              style={{
                color: "#f20b2a",
                marginBottom: "10px",
              }}
            >
              RECURSOS
            </h2>

            <p
              style={{
                color: "#0261e6",
                fontSize: "22px",
                lineHeight: "32px",
              }}
            >
              Fichas, manuales
              y logos
            </p>

          </div>

        </Link>

        {/* BRICOS */}

        <Link
          to="/bricos"
          style={{
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              borderRadius: "24px",
              padding: "30px 20px",
              textAlign: "center",
              minHeight: "210px",

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                marginBottom: "10px",
                color: "#0261e6",
              }}
            >
              <Wrench size={56} />
            </div>

            <h2
              style={{
                color: "#f20b2a",
                marginBottom: "10px",
              }}
            >
              BRICOS
            </h2>

            <p
              style={{
                color: "#0261e6",
                fontSize: "22px",
                lineHeight: "32px",
              }}
            >
              Reparaciones y
              mejoras
            </p>

          </div>

        </Link>

      </div>

      {/* LOGIN INFO */}

      <div
        style={{
          marginTop: "40px",
          textAlign: "center",
          color: "white",
          fontSize: "20px",
        }}
      >

        Conectado como:
        {" "}
        {user?.user_metadata?.nombre ||
    user?.email}

      </div>

      <BottomNav />

    </div>

  );
}