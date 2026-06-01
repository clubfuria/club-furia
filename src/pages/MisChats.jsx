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

    const channel = supabase

      .channel("mis-chats-realtime")

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes",
        },

        () => {

          if (user?.id) {

            cargarChats(user.id);
          }
        }
      )

      .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };

  }, [user]);

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
const {
  data: salidasUsuario,
} =
  await supabase

    .from(
      "salida_tripulantes"
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

const salidasIds =
  salidasUsuario?.map(
    (s) => s.salida_id
  ) || [];

const {
  data: salidasChats,
} =
  await supabase

    .from("salidas")

    .select("*")

    .in(
      "id",
      salidasIds
    );
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

    const otrosIds =
      todosParticipantes

        .filter(
          (p) =>
            p.user_id !==
            userId
        )

        .map(
          (p) =>
            p.user_id
        );

    const {
      data: perfiles,
    } =
      await supabase

        .from("profiles")

        .select("*")

        .in(
          "id",
          otrosIds
        );

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

            const noLeidos =

  mensajes?.filter(
    (m) =>

      m.conversacion_id ===
        conversacionId &&

      m.user_id !==
        userId &&

      !m.leido
  ).length || 0;


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

noLeidos,

            ultimoMensaje:

              ultimoMensaje

                ? (

                    ultimoMensaje.user_id === userId

                      ? `Tú: ${ultimoMensaje.mensaje}`

                      : ultimoMensaje.mensaje

                  )

                : "Sin mensajes",

            fecha:

              ultimoMensaje
                ?.created_at ||

              "",
          };
        }
      );


const chatsGrupo =

  (salidasChats || []).map(
    (salida) => ({

      conversacionId:
        `grupo-${salida.id}`,

      salidaId:
        salida.id,

      esGrupo:
        true,

      nombre:
        `👥 ${salida.titulo}`,

      avatar: "",

noLeidos:

  mensajes?.filter(
    (m) =>

      m.actividad_id ===
        salida.id &&

      m.to_user ===
        userId &&

      !m.leido

  ).length || 0,

      ultimoMensaje:
        "Chat grupal",

      fecha:
        salida.created_at,
    })
  );

chatsFinales.push(
  ...chatsGrupo
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

  /*
  =========================================
  FORMATEAR FECHA
  =========================================
  */

  const formatearFecha = (
    fecha
  ) => {

    if (!fecha) return "";

    const d =
      new Date(fecha);

    return d.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

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

  chat.esGrupo

    ? navigate(
        `/chat-grupo/${chat.salidaId}`
      )

    : navigate(
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

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems:
                  "center",
                marginBottom:
                  "6px",
                gap: "10px",
              }}
            >

              <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <p
    style={{
      color: "#e7eb0f",
      margin: 0,
      fontWeight: "bold",
      fontSize: "17px",
    }}
  >
    {chat.nombre}
  </p>

  {chat.noLeidos > 0 && (
    <div
      style={{
        background: "#ff0000",
        color: "white",
        minWidth: "22px",
        height: "22px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "0 6px",
      }}
    >
      {chat.noLeidos}
    </div>
  )}
</div>

              <span
                style={{
                  color:
                    "#cccccc",
                  fontSize:
                    "12px",
                  flexShrink: 0,
                }}
              >
                {formatearFecha(
                  chat.fecha
                )}
              </span>

            </div>

            <p
              style={{
                color:
                  "white",
                margin: 0,
                opacity: 0.7,
                fontSize:
                  "14px",
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