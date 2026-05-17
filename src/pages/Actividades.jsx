import BottomNav from "../components/BottomNav";
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

  // EDITAR

  const [
    editingSalidaId,
    setEditingSalidaId,
  ] = useState(null);

  useEffect(() => {

    fetchSalidas();

    fetchTripulantes();

    supabase.auth.getUser().then(
      ({ data }) => {
        setUser(data.user);
      }
    );

  }, []);

  /*
    ==========================================
    FETCH SALIDAS
    ==========================================
  */

  async function fetchSalidas() {

    const hoy =
      new Date()
        .toISOString();

    const { data, error } =
      await supabase
        .from("salidas")
        .select("*")
        .gte(
          "fecha",
          hoy
        )
        .order(
          "fecha",
          {
            ascending: true,
          }
        );

    if (!error && data) {

      setSalidas(data);
    }
  }

  /*
    ==========================================
    FETCH TRIPULANTES
    ==========================================
  */

  async function fetchTripulantes() {

    const { data, error } =
      await supabase
        .from("salida_tripulantes")
        .select("*");

    if (!error && data) {

      setTripulantes(data);
    }
  }

  /*
    ==========================================
    CREAR / EDITAR
    ==========================================
  */

  const addSalida = async () => {

    if (!user) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    // EDITAR

    if (editingSalidaId) {

      const { error } =
        await supabase
          .from("salidas")
          .update({
            titulo:
              salidaTitulo,

            puerto:
              salidaPuerto,

            fecha:
              salidaFecha,

            plazas:
              salidaPlazas,

            descripcion:
              salidaDescripcion,
          })
          .eq(
            "id",
            editingSalidaId
          );

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Actividad actualizada"
      );

      setEditingSalidaId(
        null
      );

    } else {

      // NUEVA

      const { error } =
        await supabase
          .from("salidas")
          .insert([
            {
              titulo:
                salidaTitulo,

              puerto:
                salidaPuerto,

              fecha:
                salidaFecha,

              plazas:
                salidaPlazas,

              descripcion:
                salidaDescripcion,

              user_id:
                user.id,
            },
          ]);

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Actividad creada"
      );
    }

    // LIMPIAR

    setSalidaTitulo("");

    setSalidaPuerto("");

    setSalidaFecha("");

    setSalidaPlazas("");

    setSalidaDescripcion("");

    fetchSalidas();
  };

  /*
    ==========================================
    APUNTARSE
    ==========================================
  */

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
            salida_id:
              salidaId,

            user_id:
              user.id,

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

    /*
      ==========================================
      NOTIFICACIÓN
      ==========================================
    */

    const salida =
      salidas.find(
        (s) =>
          s.id === salidaId
      );

    if (
      salida?.user_id &&
      salida.user_id !== user.id
    ) {

      await supabase
        .from(
          "notificaciones"
        )
        .insert([
          {
            user_id:
              salida.user_id,

            mensaje:
              `${user.email} se ha apuntado a ${salida.titulo}`,
          },
        ]);
    }

    fetchTripulantes();

    alert(
      "Te has apuntado"
    );
  };

  /*
    ==========================================
    EDITAR
    ==========================================
  */

  const editarSalida = (
    salida
  ) => {

    setEditingSalidaId(
      salida.id
    );

    setSalidaTitulo(
      salida.titulo || ""
    );

    setSalidaPuerto(
      salida.puerto || ""
    );

    setSalidaFecha(
      salida.fecha || ""
    );

    setSalidaPlazas(
      salida.plazas || ""
    );

    setSalidaDescripcion(
      salida.descripcion || ""
    );
  };

  /*
    ==========================================
    BORRAR
    ==========================================
  */

  const borrarSalida =
    async (id) => {

      const confirmar =
        window.confirm(
          "¿Eliminar actividad?"
        );

      if (!confirmar)
        return;

      await supabase
        .from("salidas")
        .delete()
        .eq("id", id);

      fetchSalidas();
    };

  return (

    <div
      style={{
        maxWidth: "900px",

        margin: "40px auto",

        padding: "20px",

        fontFamily: "Arial",

        backgroundColor:
          "#011135",

        minHeight: "100vh",

        paddingBottom:
          "100px",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          marginBottom:
            "30px",
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

            textDecoration:
              "none",

            backgroundColor:
              "#720792",

            padding:
              "10px 20px",

            borderRadius:
              "8px",
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

          borderRadius:
            "12px",

          marginBottom:
            "30px",
        }}
      >

        <h2
          style={{
            color: "white",
          }}
        >
          {
            editingSalidaId
              ? "Editar actividad"
              : "Crear salida"
          }
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
            marginBottom:
              "10px",
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
            marginBottom:
              "10px",
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
            marginBottom:
              "10px",
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
            marginBottom:
              "10px",
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
            marginBottom:
              "10px",
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

            borderRadius:
              "8px",

            cursor:
              "pointer",
          }}
        >
          {
            editingSalidaId
              ? "Actualizar actividad"
              : "Crear salida"
          }
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

            borderRadius:
              "10px",

            marginBottom:
              "15px",
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

          {/* APUNTARSE */}

          <button
            onClick={() =>
              apuntarseSalida(
                salida.id
              )
            }
            style={{
              marginTop:
                "10px",

              padding:
                "10px 20px",

              backgroundColor:
                "#0d7a32",

              color: "white",

              border: "none",

              borderRadius:
                "8px",

              cursor:
                "pointer",
            }}
          >
            Apuntarme
          </button>

          {/* EDITAR / BORRAR */}

          {user?.id ===
            salida.user_id && (

            <div
              style={{
                display:
                  "flex",

                gap: "10px",

                marginTop:
                  "12px",

                flexWrap:
                  "wrap",
              }}
            >

              <button
                onClick={() =>
                  editarSalida(
                    salida
                  )
                }
                style={{
                  padding:
                    "10px 18px",

                  backgroundColor:
                    "#0d7a32",

                  color:
                    "white",

                  border:
                    "none",

                  borderRadius:
                    "8px",

                  cursor:
                    "pointer",
                }}
              >
                Editar
              </button>

              <button
                onClick={() =>
                  borrarSalida(
                    salida.id
                  )
                }
                style={{
                  padding:
                    "10px 18px",

                  backgroundColor:
                    "#aa2222",

                  color:
                    "white",

                  border:
                    "none",

                  borderRadius:
                    "8px",

                  cursor:
                    "pointer",
                }}
              >
                Borrar
              </button>

            </div>

          )}

          {/* TRIPULANTES */}

          <div
            style={{
              marginTop:
                "15px",
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
                    color:
                      "white",

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

      <BottomNav />

    </div>

  );
}