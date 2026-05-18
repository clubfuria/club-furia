import { Link } from "react-router-dom";

export default function Privacidad() {

  return (

    <div
      style={{
        maxWidth: "900px",

        margin: "40px auto",

        padding: "25px",

        fontFamily: "Arial",

        background:
          "#021224",

        color: "white",

        minHeight: "100vh",
      }}
    >

      <Link
        to="/"
        style={{
          color: "#e0f406",

          textDecoration:
            "none",
        }}
      >
        ← Volver
      </Link>

      <h1
        style={{
          color: "#fe5d01",

          marginTop: "20px",
        }}
      >
        Política de Privacidad
      </h1>

      <p>
        Club Furia es una comunidad
        online para armadores y
        aficionados a los veleros
        Furia.
      </p>

      <h2>
        Datos recopilados
      </h2>

      <ul>

        <li>
          Correo electrónico
        </li>

        <li>
          Información publicada
          por los usuarios
        </li>

        <li>
          Datos de barcos y
          actividades
        </li>

      </ul>

      <h2>
        Finalidad
      </h2>

      <p>
        Los datos se utilizan
        únicamente para el
        funcionamiento de la
        comunidad y comunicación
        entre usuarios.
      </p>

      <h2>
        Conservación
      </h2>

      <p>
        Los datos se conservarán
        mientras el usuario
        mantenga su cuenta activa.
      </p>

      <h2>
        Derechos
      </h2>

      <p>
        El usuario puede solicitar
        modificación o eliminación
        de sus datos en cualquier
        momento.
      </p>

      <h2>
        Seguridad
      </h2>

      <p>
        Club Furia utiliza
        Supabase y Vercel con
        conexiones seguras HTTPS.
      </p>

    </div>
  );
}