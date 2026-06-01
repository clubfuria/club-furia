import {
  useEffect,
  useState,
  useRef,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { supabase }
from "../supabase";

export default function ChatGrupoActividad() {

  const {
    actividadId,
  } = useParams();

const navigate =
  useNavigate();


  const [user, setUser] =
    useState(null);

  const [mensajes, setMensajes] =
    useState([]);

  const [nuevoMensaje, setNuevoMensaje] =
    useState("");

const [perfiles, setPerfiles] =
  useState({});


  const mensajesEndRef =
    useRef(null);

  /*
  =========================================
  INICIAR
  =========================================
  */

  useEffect(() => {

    iniciar();

  }, []);

  /*
  =========================================
  AUTO SCROLL
  =========================================
  */

  useEffect(() => {

    mensajesEndRef.current
      ?.scrollIntoView({
        behavior:
          "smooth",
      });

  }, [mensajes]);

  async function iniciar() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setUser(user);

    if (!user) return;

    cargarMensajes();

    supabase
      .channel(
        "chat-grupo-actividad"
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",

          schema: "public",

          table: "mensajes",
        },
        () => {

          cargarMensajes();
        }
      )
      .subscribe();
  }

  /*
  =========================================
  CARGAR MENSAJES
  =========================================
  */

  async function cargarMensajes() {

    const { data, error } =
      await supabase
        .from("mensajes")
        .select("*")
        .eq(
          "actividad_id",
          actividadId
        )
        .is(
          "to_user",
          null
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {

      console.log(error);

      return;
    }

    if (data) {

  setMensajes(data);

  const ids = [
    ...new Set(
      data.map(
        (m) => m.from_user
      )
    ),
  ];

  const {
    data: perfilesData,
  } = await supabase
    .from("profiles")
.select("*")
    .in("id", ids);

  const mapa = {};

  perfilesData?.forEach(
    (p) => {

      mapa[p.id] =
        p.nombre ||
        p.username ||
        "Usuario";
    }
  );

  setPerfiles(mapa);
  console.log(perfilesData);
}
  }

  /*
  =========================================
  ENVIAR MENSAJE
  =========================================
  */

  async function enviarMensaje() {

    if (
      !nuevoMensaje.trim()
    ) {

      return;
    }

    const { error } =
      await supabase
        .from("mensajes")
        .insert([
          {
            from_user:
              user.id,

            to_user:
              null,

            actividad_id:
              actividadId,

            mensaje:
              nuevoMensaje,
          },
        ]);

    if (error) {

      console.log(error);

      return;
    }

    setNuevoMensaje("");
  }

  /*
  =========================================
  ENTER ENVIAR
  =========================================
  */

  function handleKeyDown(
    e
  ) {

    if (
      e.key === "Enter"
    ) {

      enviarMensaje();
    }
  }

  return (

    <div
      style={{
        maxWidth:
          "900px",

        margin:
          "0 auto",

        padding:
          "20px",

        minHeight:
          "100vh",

        background:
          "#011135",

        color:
          "white",
      }}
    >

      <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "20px",
  }}
>

  <button
    onClick={() =>
      navigate("/mis-chats")
    }
    style={{
      background:
        "transparent",
      border: "none",
      color: "white",
      fontSize: "28px",
      cursor: "pointer",
    }}
  >
    ←
  </button>

  <h1
    style={{
      color: "#fe5d01",
      margin: 0,
    }}
  >
    💬 CHAT GRUPAL
  </h1>

</div>

      {/* MENSAJES */}

      <div
        style={{
          background:
            "rgba(255,255,255,0.08)",

          borderRadius:
            "20px",

          padding:
            "20px",

          minHeight:
            "400px",

          maxHeight:
            "70vh",

          overflowY:
            "auto",

          marginBottom:
            "20px",
        }}
      >

        {mensajes.map(
          (m) => {

            const mio =
              m.from_user ===
              user?.id;

            return (

              <div
                key={m.id}

                style={{
                  display:
                    "flex",

                  justifyContent:
                    mio
                      ? "flex-end"
                      : "flex-start",

                  marginBottom:
                    "14px",
                }}
              >

                <div
                  style={{
                    background:
                      mio
                        ? "#fe5d01"
                        : "#1e293b",

                    color:
                      "white",

                    padding:
                      "12px 16px",

                    borderRadius:
                      "18px",

                    maxWidth:
                      "75%",

                    wordBreak:
                      "break-word",
                  }}
                >

                  <div
                    style={{
                      fontSize:
                        "12px",

                      opacity:
                        0.7,

                      marginBottom:
                        "6px",
                    }}
                  >

                    {perfiles[m.from_user] ||
  "Usuario"}

                  </div>

                  <div
                    style={{
                      fontSize:
                        "15px",

                      lineHeight:
                        1.4,
                    }}
                  >
                    {m.mensaje}
                  </div>

                  <div
                    style={{
                      fontSize:
                        "11px",

                      opacity:
                        0.6,

                      marginTop:
                        "6px",

                      textAlign:
                        "right",
                    }}
                  >

                    {
                      new Date(
                        m.created_at
                      ).toLocaleString()
                    }

                  </div>

                </div>

              </div>

            );
          }
        )}

        <div
          ref={
            mensajesEndRef
          }
        />

      </div>

      {/* INPUT */}

      <div
        style={{
          display:
            "flex",

          gap:
            "12px",
        }}
      >

        <input
          type="text"

          value={
            nuevoMensaje
          }

          onChange={(e) =>
            setNuevoMensaje(
              e.target.value
            )
          }

          onKeyDown={
            handleKeyDown
          }

          placeholder="Mensaje grupal..."

          style={{
            flex: 1,

            padding:
              "14px",

            borderRadius:
              "12px",

            border:
              "none",
          }}
        />

        <button
          onClick={
            enviarMensaje
          }

          style={{
            background:
              "#fe5d01",

            color:
              "white",

            border:
              "none",

            borderRadius:
              "12px",

            padding:
              "14px 20px",

            fontWeight:
              "bold",

            cursor:
              "pointer",
          }}
        >
          ENVIAR
        </button>

      </div>

    </div>
  );
}