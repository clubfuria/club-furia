import {
  useState,
} from "react";

import { supabase }
from "../supabase";

import {
  useNavigate,
} from "react-router-dom";

export default function UpdatePassword() {

  const navigate =
    useNavigate();

  const [
    password,
    setPassword,
  ] = useState("");

  async function actualizar() {

    if (!password)
      return;

    const { error } =
      await supabase.auth
        .updateUser({
          password,
        });

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Contraseña actualizada"
    );

    navigate("/login");
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
          🔐 Nueva contraseña
        </h1>

        <input
          type="password"

          placeholder="Nueva contraseña"

          value={password}

          onChange={(e) =>
            setPassword(
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
          onClick={actualizar}

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
          Guardar contraseña
        </button>

      </div>

    </div>

  );
}