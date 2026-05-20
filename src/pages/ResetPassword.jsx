import {
  useState,
} from "react";

import { supabase }
from "../supabase";

export default function ResetPassword() {

  const [email, setEmail] =
    useState("");

  const [enviado, setEnviado] =
    useState(false);

  async function resetPassword() {

    if (!email) return;

    const { error } =
      await supabase.auth
        .resetPasswordForEmail(
          email,
          {
            redirectTo:
              "https://club-furia.vercel.app/update-password",
          }
        );

    if (error) {

      alert(error.message);

      return;
    }

    setEnviado(true);
  }

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "#011135",

        display: "flex",

        justifyContent:
          "center",

        alignItems:
          "center",

        padding: "20px",
      }}
    >

      <div
        style={{
          background:
            "#021b44",

          padding: "30px",

          borderRadius:
            "16px",

          width: "100%",

          maxWidth: "400px",
        }}
      >

        <h1
          style={{
            color: "white",

            marginBottom:
              "20px",
          }}
        >
          🔑 Recuperar contraseña
        </h1>

        {enviado ? (

          <p
            style={{
              color:
                "#7dff8a",
            }}
          >
            Revisa tu email para cambiar la contraseña.
          </p>

        ) : (

          <>

            <input
              type="email"

              placeholder="Tu email"

              value={email}

              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }

              style={{
                width: "100%",

                padding:
                  "14px",

                borderRadius:
                  "10px",

                border:
                  "none",

                marginBottom:
                  "16px",
              }}
            />

            <button
              onClick={
                resetPassword
              }

              style={{
                width: "100%",

                padding:
                  "14px",

                border:
                  "none",

                borderRadius:
                  "10px",

                background:
                  "#720792",

                color:
                  "white",

                fontWeight:
                  "bold",

                cursor:
                  "pointer",
              }}
            >
              Enviar email
            </button>

          </>

        )}

      </div>

    </div>

  );
}