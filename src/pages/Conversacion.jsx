import { useEffect, useState } from "react";

import {
  useParams,
} from "react-router-dom";

import { supabase }
from "../supabase";

export default function Conversacion() {

  const {
    conversacionId,
  } = useParams();

  const [user, setUser] =
    useState(null);

  const [mensajes, setMensajes] =
    useState([]);

  const [nuevoMensaje,
    setNuevoMensaje] =
    useState("");

  useEffect(() => {

  obtenerUsuario();

  

  const channel =
    supabase
      .channel(
        "mensajes-tiempo-real"
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
            (prev) => [

              ...prev,

              payload.new,
            ]
          );
        }
      )

      .subscribe();

  return () => {

    supabase.removeChannel(
      channel
    );
  };

}, []);

  async function obtenerUsuario() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    setUser(user);
  }

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

  async function enviarMensaje() {

    if (
      !nuevoMensaje.trim()
    ) return;

    if (!user) return;

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
              nuevoMensaje,
          },
        ]);

    if (error) {

      alert(error.message);

      return;
    }

    setNuevoMensaje("");

    cargarMensajes();
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
            "20px",

          background:
            "#021b44",

          color:
            "white",

          fontSize:
            "22px",

          fontWeight:
            "bold",

          borderBottom:
            "1px solid rgba(255,255,255,0.1)",
        }}
      >
        💬 Conversación
      </div>

      {/* MENSAJES */}

      <div
        style={{
          flex: 1,

          padding:
            "20px",

          overflowY:
            "auto",
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
                  }}
                >
                  {msg.mensaje}
                </div>

              </div>

            );
          }
        )}

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
          }}
        >
          ➤
        </button>

      </div>

    </div>

  );
}