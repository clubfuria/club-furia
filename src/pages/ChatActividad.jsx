import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import { supabase }
from "../supabase";

export default function ChatActividad() {

  const {
    actividadId,
    userId,
  } = useParams();

  const [user, setUser] =
    useState(null);

  const [mensajes, setMensajes] =
    useState([]);

  const [nuevoMensaje, setNuevoMensaje] =
    useState("");

  /*
  =========================================
  INICIAR
  =========================================
  */

  useEffect(() => {

    iniciar();

  }, []);

  async function iniciar() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setUser(user);

    if (!user) return;

    cargarMensajes(user.id);

    supabase
      .channel("chat-actividad")
      .on(
        "postgres_changes",
        {
          event: "INSERT",

          schema: "public",

          table: "mensajes",
        },
        () => {

          cargarMensajes(
            user.id
          );
        }
      )
      .subscribe();
  }

  /*
  =========================================
  CARGAR MENSAJES
  =========================================
  */

  async function cargarMensajes(
    currentUserId
  ) {

    const { data, error } =
      await supabase
        .from("mensajes")
        .select("*")
        .eq(
          "actividad_id",
          actividadId
        )
        .or(
          `and(from_user.eq.${currentUserId},to_user.eq.${userId}),and(from_user.eq.${userId},to_user.eq.${currentUserId})`
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
    }
  }

  /*
  =========================================
  ENVIAR MENSAJE
  =========================================
  */

  async function enviarMensaje() {

    if (!nuevoMensaje.trim()) {

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
              userId,

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

  return (

    <div
      style={{
        maxWidth: "900px",

        margin: "0 auto",

        padding: "20px",

        minHeight: "100vh",

        background:
          "#011135",

        color: "white",
      }}
    >

      <h1
        style={{
          color: "#fe5d01",

          marginBottom:
            "20px",
        }}
      >
        💬 CHAT ACTIVIDAD
      </h1>

      {/* MENSAJES */}

      <div
        style={{
          background:
            "rgba(255,255,255,0.08)",

          borderRadius:
            "20px",

          padding: "20px",

          minHeight: "400px",

          marginBottom:
            "20px",
        }}
      >

        {mensajes.map((m) => (

          <div
            key={m.id}

            style={{
              display: "flex",

              justifyContent:
                m.from_user ===
                user?.id
                  ? "flex-end"
                  : "flex-start",

              marginBottom:
                "12px",
            }}
          >

            <div
              style={{
                background:
                  m.from_user ===
                  user?.id
                    ? "#720792"
                    : "#08203b",

                padding:
                  "12px 16px",

                borderRadius:
                  "14px",

                maxWidth:
                  "70%",

                wordBreak:
                  "break-word",
              }}
            >
              {m.mensaje}
            </div>

          </div>

        ))}

      </div>

      {/* INPUT */}

      <div
        style={{
          display: "flex",

          gap: "12px",
        }}
      >

        <input
          type="text"

          value={nuevoMensaje}

          onChange={(e) =>
            setNuevoMensaje(
              e.target.value
            )
          }

          placeholder="Escribe un mensaje..."

          style={{
            flex: 1,

            padding: "14px",

            borderRadius:
              "12px",

            border: "none",
          }}
        />

        <button
          onClick={enviarMensaje}

          style={{
            background:
              "#fe5d01",

            color: "white",

            border: "none",

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