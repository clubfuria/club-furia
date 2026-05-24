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

export default function Conversacion() {

  const {
    conversacionId,
  } = useParams();

const navigate =
  useNavigate();

  const [user, setUser] =
    useState(null);

  const [mensajes, setMensajes] =
    useState([]);

  const [
    nuevoMensaje,
    setNuevoMensaje,
  ] = useState("");

  const mensajesEndRef =
    useRef(null);

  /*
  =========================================
  INIT
  =========================================
  */

  useEffect(() => {

    obtenerUsuario();

    cargarMensajes();

marcarMensajesLeidos();

    const channel =
      supabase
        .channel(
          `chat-${conversacionId}`
        )

        .on(
          "postgres_changes",

          {
            event: "INSERT",

            schema: "public",

            table: "mensajes",

            filter:
              `conversacion_id=eq.${conversacionId}`,
          },

          (payload) => {

            setMensajes(
              (prev) => {

                const existe =
                  prev.find(
                    (m) =>
                      m.id ===
                      payload.new.id
                  );

                if (existe)
                  return prev;

                return [
                  ...prev,
                  payload.new,
                ];
              }
            );
          }
        )

        .subscribe();

    return () => {

      supabase.removeChannel(
        channel
      );
    };

  }, [conversacionId]);

  /*
  =========================================
  AUTOSCROLL
  =========================================
  */

  useEffect(() => {

    mensajesEndRef.current
      ?.scrollIntoView({
        behavior:
          "smooth",
      });

  }, [mensajes]);

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

    setUser(user);
  }

  /*
  =========================================
  LOAD MESSAGES
  =========================================
  */

  async function cargarMensajes() {

    const { data, error } =
      await supabase
        .from("mensajes")
        .select("*")
        .eq(
          "conversacion_id",
          conversacionId
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (!error && data) {

      setMensajes(data);
    }
  }

/*
=========================================
MARCAR LEIDOS
=========================================
*/

async function marcarMensajesLeidos() {

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) return;

  await supabase

    .from("mensajes")

    .update({
      leido: true,
    })

    .eq(
      "conversacion_id",
      conversacionId
    )

    .neq(
      "user_id",
      user.id
    );
}

  /*
  =========================================
  SEND MESSAGE
  =========================================
  */

  async function enviarMensaje() {

    if (
      !nuevoMensaje.trim()
    ) return;

    if (!user) return;

    const texto =
      nuevoMensaje;

    setNuevoMensaje("");

    const { error } =
      await supabase
        .from("mensajes")
        .insert([
          {
            conversacion_id:
              conversacionId,

            user_id:
              user.id,

            mensaje:
              texto,
          },
        ]);

    if (error) {

      alert(error.message);

      return;
    }
    /*
=========================================
NOTIFICACION NUEVO MENSAJE
=========================================
*/

const {
  data: participantes,
} =
  await supabase

    .from(
      "conversacion_participantes"
    )

    .select("*")

    .eq(
      "conversacion_id",
      conversacionId
    );

const destinatario =

  participantes?.find(
    (p) =>
      p.user_id !==
      user.id
  );

if (destinatario) {

  await supabase

    .from(
      "notificaciones"
    )

    .insert([
      {
        user_id:
          destinatario.user_id,

        mensaje:
          `💬 Nuevo mensaje de ${user.email?.split("@")[0]}`,
ruta: `/conversacion/${conversacionId}`,

      },
    ]);
}
  }

  return (

    <div
      style={{
        background:
          "#011135",

        minHeight:
          "100vh",

        display:
          "flex",

        flexDirection:
          "column",
      }}
    >

      {/* CABECERA */}

      <div
  style={{
    padding:
      "16px 20px",

    background:
      "#021b44",

    color:
      "white",

    borderBottom:
      "1px solid rgba(255,255,255,0.1)",

    display:
      "flex",

    alignItems:
      "center",

    gap: "16px",
  }}
>

  <button
    onClick={() =>
      navigate(
        "/mis-chats"
      )
    }

    style={{
      background:
        "transparent",

      border:
        "none",

      color:
        "white",

      fontSize:
        "28px",

      cursor:
        "pointer",
    }}
  >
    ←
  </button>

  <div
    style={{
      fontSize:
        "22px",

      fontWeight:
        "bold",
    }}
  >
    💬 Conversación
  </div>

</div>

      {/* MENSAJES */}

      <div
        style={{
          flex: 1,

          padding:
            "20px",

          overflowY:
            "auto",

          display:
            "flex",

          flexDirection:
            "column",
        }}
      >

        {mensajes.map(
          (msg) => {

            const mio =
              msg.user_id ===
              user?.id;

            return (

              <div
                key={msg.id}

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
                        ? "#720792"
                        : "#16325c",

                    color:
                      "white",

                    padding:
                      "12px 16px",

                    borderRadius:
                      "18px",

                    maxWidth:
                      "70%",

                    fontSize:
                      "15px",

                    lineHeight:
                      1.4,

                    wordBreak:
                      "break-word",

                    boxShadow:
                      "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  {msg.mensaje}
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

      {/* ESCRIBIR */}

      <div
        style={{
          display:
            "flex",

          gap:
            "10px",

          padding:
            "16px",

          background:
            "#021b44",

          borderTop:
            "1px solid rgba(255,255,255,0.1)",
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

          onKeyDown={(e) => {

            if (
              e.key ===
              "Enter"
            ) {

              enviarMensaje();
            }
          }}

          placeholder="Escribe un mensaje..."

          style={{
            flex: 1,

            padding:
              "14px",

            borderRadius:
              "14px",

            border:
              "none",

            outline:
              "none",

            fontSize:
              "15px",
          }}
        />

        <button
          onClick={
            enviarMensaje
          }

          style={{
            background:
              "#720792",

            color:
              "white",

            border:
              "none",

            padding:
              "14px 20px",

            borderRadius:
              "14px",

            cursor:
              "pointer",

            fontWeight:
              "bold",

            fontSize:
              "16px",
          }}
        >
          ➤
        </button>

      </div>

    </div>

  );
}