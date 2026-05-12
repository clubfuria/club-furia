import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Actividades() {

  const [user, setUser] = useState(null);

  const [salidas, setSalidas] =
    useState([]);

  const [tripulantes, setTripulantes] =
    useState([]);

  const [salidaTitulo, setSalidaTitulo] =
    useState("");

  const [salidaPuerto, setSalidaPuerto] =
    useState("");

  const [salidaFecha, setSalidaFecha] =
    useState("");

  const [salidaPlazas, setSalidaPlazas] =
    useState("");

  const [
    salidaDescripcion,
    setSalidaDescripcion,
  ] = useState("");

  useEffect(() => {

    fetchSalidas();

    fetchTripulantes();

    supabase.auth.getUser().then(
      ({ data }) => {
        setUser(data.user);
      }
    );

  }, []);

  // FETCH SALIDAS

  async function fetchSalidas() {

    const { data, error } =
      await supabase
        .from("salidas")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error && data) {
      setSalidas(data);
    }
  }

  // FETCH TRIPULANTES

  async function fetchTripulantes() {

    const { data, error } =
      await supabase
        .from("salida_tripulantes")
        .select("*");

    if (!error && data) {
      setTripulantes(data);
    }
  }

  // CREAR SALIDA

  const addSalida = async () => {

    if (!user) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    const { error } =
      await supabase
        .from("salidas")
        .insert([
          {
            titulo: salidaTitulo,
            puerto: salidaPuerto,
            fecha: salidaFecha,
            plazas: salidaPlazas,
            descripcion:
              salidaDescripcion,
            user_id: user.id,
          },
        ]);

    if (error) {

      alert(error.message);

      return;
    }

    setSalidaTitulo("");
    setSalidaPuerto("");
    setSalidaFecha("");
    setSalidaPlazas("");
    setSalidaDescripcion("");

    fetchSalidas();
  };

  // APUNTARSE

  const apuntarseSalida = async (
    salidaId
  ) => {

    if (!user) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    const existe =
      tripulantes.find(
        (t) =>
          t.salida_id ===
            salidaId &&
          t.user_id === user.id
      );

    if (existe) {

      alert(
        "Ya estás apuntado"
      );

      return;
    }

    const { error } =
      await supabase
        .from(
          "salida_tripulantes"
        )
        .insert([
          {
            salida_id: salidaId,
            user_id: user.id,
            user_name:
              user.user_metadata
                ?.nombre ||
              user.email,
          },
        ]);

    if (error) {

      alert(error.message);

      return;
    }

    fetchTripulantes();

    alert(
      "Te has apuntado"
    );
  };

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#011135",
        minHeight: "100vh",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            color: "#fe5d01",
          }}
        >
          📅 ACTIVIDADES
        </h1>

        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            backgroundColor:
              "#720792",
            padding:
              "10px 20px",
            borderRadius: "8px",
          }}
        >
          INICIO
        </Link>

      </div>

      {/* FORMULARIO */}

      <div
        style={{
          backgroundColor:
            "#001b44",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            color: "white",
          }}
        >
          Crear salida
        </h2>

        <input
          type="text"
          placeholder="Título"
          value={salidaTitulo}
          onChange={(e) =>
            setSalidaTitulo(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Puerto"
          value={salidaPuerto}
          onChange={(e) =>
            setSalidaPuerto(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="datetime-local"
          value={salidaFecha}
          onChange={(e) =>
            setSalidaFecha(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Plazas"
          value={salidaPlazas}
          onChange={(e) =>
            setSalidaPlazas(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <textarea
          placeholder="Descripción"
          value={
            salidaDescripcion
          }
          onChange={(e) =>
            setSalidaDescripcion(
              e.target.value
            )
          }
          style={{
            width: "100%",
            height: "120px",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <button
          onClick={addSalida}
          style={{
            padding:
              "10px 20px",
            backgroundColor:
              "#720792",
            color: "white",
            border:
              "white solid 2px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Crear salida
        </button>

      </div>

      {/* LISTA */}

      {salidas.map((salida) => (

        <div
          key={salida.id}
          style={{
            backgroundColor:
              "#02235c",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "15px",
          }}
        >

          <h3
            style={{
              color: "#e7eb0f",
            }}
          >
            {salida.titulo}
          </h3>

          <p
            style={{
              color: "white",
            }}
          >
            📍
            {" "}
            {salida.puerto}
          </p>

          <p
            style={{
              color: "white",
            }}
          >
            📅
            {" "}
            {salida.fecha}
          </p>

          <p
            style={{
              color: "white",
            }}
          >
            👥 Plazas:
            {" "}
            {salida.plazas}
          </p>

          <p
            style={{
              color: "white",
            }}
          >
            {salida.descripcion}
          </p>

          <button
            onClick={() =>
              apuntarseSalida(
                salida.id
              )
            }
            style={{
              marginTop: "10px",
              padding:
                "10px 20px",
              backgroundColor:
                "#0d7a32",
              color: "white",
              border: "none",
              borderRadius:
                "8px",
              cursor: "pointer",
            }}
          >
            Apuntarme
          </button>

          <div
            style={{
              marginTop: "15px",
            }}
          >

            <p
              style={{
                color: "#e7eb0f",
              }}
            >
              Tripulación apuntada:
            </p>

            {tripulantes
              .filter(
                (t) =>
                  t.salida_id ===
                  salida.id
              )
              .map((t) => (

                <p
                  key={t.id}
                  style={{
                    color: "white",
                    marginLeft:
                      "10px",
                  }}
                >
                  •
                  {" "}
                  {t.user_name}
                </p>

              ))}

          </div>

        </div>

      ))}

    </div>

  );
}