import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export default function MisChats() {

  const navigate = useNavigate();

  const [user, setUser] =
    useState(null);

  const [chats, setChats] =
    useState([]);

  useEffect(() => {

    obtenerUsuario();

  }, []);

  async function obtenerUsuario() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {

      setUser(user);

      cargarChats(user.id);
    }
  }

  async function cargarChats(
    userId
  ) {

    const { data, error } =
      await supabase
        .from("chats_privados")
        .select("*")
        .or(
          `from_user.eq.${userId},to_user.eq.${userId}`
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (!error && data) {

      const chatsUnicos = [];

      data.forEach((chat) => {

        const otroUsuario =
          chat.from_user === userId
            ? chat.to_user
            : chat.from_user;

        const existe =
          chatsUnicos.find(
            (c) =>
              c.otroUsuario ===
              otroUsuario
          );

        if (!existe) {

          chatsUnicos.push({
            ...chat,
            otroUsuario,
          });
        }
      });

      setChats(chatsUnicos);
    }
  }

  return (

    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        minHeight: "100vh",
        background: "#011135",
      }}
    >

      <h1
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        💬 Mis Chats
      </h1>

      {chats.length === 0 && (

        <p style={{ color: "white" }}>
          No tienes chats todavía
        </p>

      )}

      {chats.map((chat) => (

        <div
          key={chat.id}

          onClick={() =>
            navigate(
              `/chat/${chat.salida_id}/${chat.otroUsuario}`
            )
          }

          style={{
            background:
              "#02235c",

            padding: "16px",

            borderRadius:
              "12px",

            marginBottom:
              "12px",

            cursor:
              "pointer",
          }}
        >

          <p
            style={{
              color: "#e7eb0f",
              marginBottom: "8px",
            }}
          >
            Usuario:
            {" "}
            {chat.otroUsuario}
          </p>

          <p
            style={{
              color: "white",
            }}
          >
            {chat.mensaje}
          </p>

        </div>

      ))}

    </div>

  );
}