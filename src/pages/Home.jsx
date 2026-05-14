import { useEffect, useState }
from "react";

import { Link }
from "react-router-dom";

import BottomNav
from "../components/BottomNav";

import { supabase }
from "../supabase";

import logo
from "../assets/logo.png";

import {
  Sailboat,
  Users,
  CalendarDays,
  Wrench,
  FolderOpen,
} from "lucide-react";

export default function Home() {

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    supabase.auth
      .getUser()
      .then(({ data }) => {

        setUser(data.user);
      });

  }, []);

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

        <img
          src={logo}
          alt="Club Furia"
          style={{
            width: "250px",
            marginBottom: "15px",
            filter:
              "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
          }}
        />

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

      {/* MENU PRINCIPAL */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
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
              borderRadius: "22px",
              padding: "20px 24px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >

              <Sailboat
                size={38}
                color="#0261e6"
              />

              <div>

                <h2
                  style={{
                    color: "#f20b2a",
                    margin: 0,
                  }}
                >
                  BARCOS
                </h2>

                <p
                  style={{
                    color: "#0261e6",
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  Registro de flota
                </p>

              </div>

            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#999",
              }}
            >
              ›
            </div>

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
              borderRadius: "22px",
              padding: "20px 24px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >

              <Users
                size={38}
                color="#0261e6"
              />

              <div>

                <h2
                  style={{
                    color: "#f20b2a",
                    margin: 0,
                  }}
                >
                  TRIPULACION
                </h2>

                <p
                  style={{
                    color: "#0261e6",
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  Armadores y
                  tripulantes
                </p>

              </div>

            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#999",
              }}
            >
              ›
            </div>

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
              borderRadius: "22px",
              padding: "20px 24px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >

              <CalendarDays
                size={38}
                color="#0261e6"
              />

              <div>

                <h2
                  style={{
                    color: "#f20b2a",
                    margin: 0,
                  }}
                >
                  ACTIVIDADES
                </h2>

                <p
                  style={{
                    color: "#0261e6",
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  Salidas y calendario
                </p>

              </div>

            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#999",
              }}
            >
              ›
            </div>

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
              borderRadius: "22px",
              padding: "20px 24px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >

              <FolderOpen
                size={38}
                color="#0261e6"
              />

              <div>

                <h2
                  style={{
                    color: "#f20b2a",
                    margin: 0,
                  }}
                >
                  RECURSOS
                </h2>

                <p
                  style={{
                    color: "#0261e6",
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  Manuales y documentos
                </p>

              </div>

            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#999",
              }}
            >
              ›
            </div>

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
              borderRadius: "22px",
              padding: "20px 24px",

              display: "flex",
              alignItems: "center",
              justifyContent:
                "space-between",

              boxShadow:
                "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "18px",
              }}
            >

              <Wrench
                size={38}
                color="#0261e6"
              />

              <div>

                <h2
                  style={{
                    color: "#f20b2a",
                    margin: 0,
                  }}
                >
                  BRICOS
                </h2>

                <p
                  style={{
                    color: "#0261e6",
                    margin: 0,
                    marginTop: "4px",
                  }}
                >
                  Reparaciones y mejoras
                </p>

              </div>

            </div>

            <div
              style={{
                fontSize: "28px",
                color: "#999",
              }}
            >
              ›
            </div>

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