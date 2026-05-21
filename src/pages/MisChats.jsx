import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "../supabase";

import {
  useNavigate,
} from "react-router-dom";

export default function MisChats() {

  const navigate =
    useNavigate();

  const [user, setUser] =
    useState(null);

  const [chats, setChats] =
    useState([]);

  /*
  =========================================
  INIT
  =========================================
  */

  useEffect(() => {

    obtenerUsuario();

  }, []);

  /*
  =========================================
  USER
  =========================================
  */

  async function obtenerUsuario() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    cargarChats(user.id);
  }

  /*
  =========================================
  CARGAR CHATS
  =========================================
  */

  async function cargarChats(
    userId
  ) {

    /*
    =====================================
    CONVERSACIONES USUARIO
    =====================================
    */

    const {
      data: participaciones,
      error:
        participacionesError,
    } =
      await supabase

        .from(
          "conversacion_participantes"
        )

        .select("*")

        .eq(
          "user_id",
          userId
        );

    if (
      participacionesError
    ) {

      console.log(
        participacionesError
      );

      return;
    }

    const conversacionesIds =

      participaciones.map(
        (p) =>
          p.conversacion_id
      );

    if (
      conversacionesIds.length ===
      0
    ) {

      setChats([]);

      return;
    }

    /*
    =====================================
    PARTICIPANTES
    =====================================
    */

    const {
      data: todosParticipantes,
    } =
      await supabase

        .from(
          "conversacion_participantes"
        )

        .select("*")

        .in(
          "conversacion_id",
          conversacionesIds
        );

/*
=====================================
PERFILES
=====================================
*/

const otrosIds = todosParticipantes
  .filter(
    (p) => p.user_id !== userId
  )
  .map((p) => p.user_id);

const {
  data: perfiles,
} =
  await supabase
    .from("profiles")
    .select("*")
    .in("id", otrosIds);

    /*
    =====================================
    MENSAJES
    =====================================
    */

    const {
      data: mensajes,
    } =
      await supabase

        .from("mensajes")

        .select("*")

        .in(
          "conversacion_id",
          conversacionesIds
        )

        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    /*
    =====================================
    CONSTRUIR CHATS
    =====================================
    */

    const chatsFinales =

      conversacionesIds.map(
        (
          conversacionId
        ) => {

          const otroParticipante =

            todosParticipantes.find(

              (p) =>

                p.conversacion_id ===
                  conversacionId &&

                p.user_id !==
                  userId
            );

          const ultimoMensaje =

            mensajes?.find(
              (m) =>
                m.conversacion_id ===
                conversacionId
            );

/*
================================
PERFIL USUARIO
================================
*/

const perfil =
  perfiles?.find(
    (p) =>
      p.id ===
      otroParticipante?.user_id
  );

const nombre =
  perfil?.nombre ||
  perfil?.username ||
  "Usuario";

const avatar =
  perfil?.avatar_url || "";

    return {

  conversacionId,

  nombre,

  avatar,      

            ultimoMensaje:

              ultimoMensaje
                ?.mensaje ||

              "Sin mensajes",

            fecha:

              ultimoMensaje
                ?.created_at ||

              "",
          };
        }
      );

    /*
    =====================================
    ORDENAR
    =====================================
    */

    chatsFinales.sort(
      (a, b) =>

        new Date(
          b.fecha
        ) -

        new Date(
          a.fecha
        )
    );

    setChats(
      chatsFinales
    );
  }

  return (

    <div
      style={{
        maxWidth: "800px",

        margin: "0 auto",

        padding: "20px",

        minHeight: "100vh",

        background:
          "#011135",
      }}
    >

      {/* HEADER */}

      <div
        style={{
          display: "flex",

          alignItems:
            "center",

          gap: "14px",

          marginBottom:
            "24px",
        }}
      >

        <button
          onClick={() =>
            navigate("/")
          }

          style={{
            background:
              "transparent",

            border:
              "none",

            color:
              "white",

            fontSize:
              "30px",

            cursor:
              "pointer",
          }}
        >
          ←
        </button>

        <h1
          style={{
            color: "white",

            margin: 0,
          }}
        >
          💬 Mis Chats
        </h1>

      </div>

      {/* VACÍO */}

      {chats.length === 0 && (

        <p
          style={{
            color: "white",
          }}
        >
          No tienes chats todavía
        </p>

      )}

      {/* LISTA */}

      {chats.map((chat) => (

        <div
          key={
            chat.conversacionId
          }

          onClick={() =>

            navigate(
              `/conversacion/${chat.conversacionId}`
            )

          }

          style={{
            background:
              "#02235c",

            padding:
              "16px",

            borderRadius:
              "14px",

            marginBottom:
              "14px",

            cursor:
              "pointer",

            border:
              "1px solid rgba(255,255,255,0.08)",

            display:
              "flex",

            alignItems:
              "center",

            gap: "14px",
          }}
        >

         {/* AVATAR */}

{chat.avatar ? (

  <img
    src={chat.avatar}
    alt=""
    style={{
      width: "52px",
      height: "52px",
      borderRadius: "50%",
      objectFit: "cover",
      flexShrink: 0,
    }}
  />

) : (

  <div
    style={{
      width: "52px",

      height: "52px",

      borderRadius:
        "50%",

      background:
        "#720792",

      display:
        "flex",

      alignItems:
        "center",

      justifyContent:
        "center",

      color:
        "white",

      fontWeight:
        "bold",

      fontSize:
        "20px",

      flexShrink: 0,
    }}
  >
    {chat.nombre
      ?.charAt(0)
      ?.toUpperCase()}
  </div>

)}

          {/* INFO */}

          <div
            style={{
              flex: 1,

              overflow:
                "hidden",
            }}
          >

            <p
              style={{
                color:
                  "#e7eb0f",

                margin: 0,

                marginBottom:
                  "6px",

                fontWeight:
                  "bold",

                fontSize:
                  "17px",
              }}
            >
              {chat.nombre}
            </p>

            <p
              style={{
                color:
                  "white",

                margin: 0,

                opacity: 0.9,

                overflow:
                  "hidden",

                textOverflow:
                  "ellipsis",

                whiteSpace:
                  "nowrap",
              }}
            >
              {
                chat.ultimoMensaje
              }
            </p>

          </div>

        </div>

      ))}

    </div>

  );
}