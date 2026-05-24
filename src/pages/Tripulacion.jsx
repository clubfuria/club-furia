import BottomNav
from "../components/BottomNav";

import { useEffect, useState }
from "react";

import { Link }
from "react-router-dom";

import { supabase }
from "../supabase";

import {
  useNavigate,
} from "react-router-dom";

import {
  obtenerOCrearConversacion,
} from "../utils/chatUtils";

export default function Tripulacion() {

  const navigate =
    useNavigate();

  const [user, setUser] =
    useState(null);

  const [profiles, setProfiles] =
    useState([]);

  const [
    profileNombre,
    setProfileNombre,
  ] = useState("");

  const [
    profilePuerto,
    setProfilePuerto,
  ] = useState("");

  const [
    profileExperiencia,
    setProfileExperiencia,
  ] = useState("");

  const [
    profileDisponibilidad,
    setProfileDisponibilidad,
  ] = useState("");

  const [
    profileDescripcion,
    setProfileDescripcion,
  ] = useState("");

const [
  profileRol,
  setProfileRol,
] = useState("");

const [
  profileHabilidades,
  setProfileHabilidades,
] = useState("");

const [
  profileTitulacion,
  setProfileTitulacion,
] = useState("");

const [
  profileMillas,
  setProfileMillas,
] = useState("");

const [
  profileTipoNavegacion,
  setProfileTipoNavegacion,
] = useState("");

const [
  profileIdiomas,
  setProfileIdiomas,
] = useState("");


  useEffect(() => {

    fetchProfiles();

    supabase.auth.getUser().then(
      ({ data }) => {

        setUser(data.user);

        if (data.user) {

          fetchMyProfile(
            data.user.id
          );
        }
      }
    );

  }, []);

  /*
  =========================================
  FETCH PROFILES
  =========================================
  */

  async function fetchProfiles() {

    const { data, error } =
      await supabase
        .from("profiles")
        .select("*")
        .order("nombre", {
          ascending: true,
        });

    if (!error && data) {

      setProfiles(data);
    }
  }

  /*
  =========================================
  FETCH MY PROFILE
  =========================================
  */

  async function fetchMyProfile(
    userId
  ) {

    const { data } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (data) {

      setProfileNombre(
        data.nombre || ""
      );

      setProfilePuerto(
        data.puerto || ""
      );

      setProfileExperiencia(
        data.experiencia || ""
      );

      setProfileDisponibilidad(
        data.disponibilidad ||
          ""
      );

      setProfileDescripcion(
        data.descripcion || ""
      );

setProfileRol(
  data.rol || ""
);

setProfileHabilidades(
  data.habilidades || ""
);

setProfileTitulacion(
  data.titulacion || ""
);

setProfileMillas(
  data.millas || ""
);

setProfileTipoNavegacion(
  data.tipo_navegacion || ""
);

setProfileIdiomas(
  data.idiomas || ""
);

    }
  }

  /*
  =========================================
  SAVE PROFILE
  =========================================
  */

  const saveProfile =
    async () => {

      if (!user) {

        alert(
          "Debes iniciar sesión"
        );

        return;
      }

      const { error } =
        await supabase
          .from("profiles")
          .upsert([
            {
              id: user.id,

usuario:
  user.email,

              nombre:
                profileNombre,

              puerto:
                profilePuerto,

              experiencia:
                profileExperiencia,

              disponibilidad:
                profileDisponibilidad,

              descripcion:
                profileDescripcion,

              rol:
                profileRol,

              habilidades:
                profileHabilidades,

              titulacion:
                profileTitulacion,

              millas:
                profileMillas,

              tipo_navegacion:
                profileTipoNavegacion,

              idiomas:
                profileIdiomas,
            },
          ]);

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Perfil guardado"
      );

      /*
=====================================
NOTIFICAR NUEVA TRIPULACION
=====================================
*/

const {
  data: profiles,
} =
  await supabase
    .from("profiles")
    .select("id");

if (profiles) {

  const notifications =

    profiles

      .filter(
        (p) =>
          p.id !== user.id
      )

      .map((p) => ({

        user_id: p.id,

        mensaje:
          `👥 Nueva tripulación: ${crewName}`,
ruta: "/tripulacion",
      }));

  if (
    notifications.length > 0
  ) {

    await supabase
      .from(
        "notificaciones"
      )
      .insert(
        notifications
      );
  }
}

      fetchProfiles();
    };

  return (

    <div
      style={{
        maxWidth: "900px",

        margin: "40px auto",

        padding: "20px",

        fontFamily: "Arial",

        backgroundColor:
          "#011135",

        minHeight: "100vh",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "18px",
        }}
      >

        <h1
          style={{
            color: "#fe5d01",
          }}
        >
          👥 TRIPULACION
        </h1>

        <Link
          to="/"
          style={{
            color: "white",

            textDecoration:
              "none",

            backgroundColor:
              "#720792",

            padding:
              "10px 20px",

            borderRadius: "8px",
          }}
        >
          INICIO
        </Link>

      </div>

      {/* FORMULARIO */}

      <div
        style={{
          backgroundColor:
            "#001b44",

          padding: "20px",

          borderRadius: "12px",

          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            color: "white",
          }}
        >
          Mi perfil
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          value={profileNombre}
          onChange={(e) =>
            setProfileNombre(
              e.target.value
            )
          }
          style={{
            width: "100%",

            padding: "10px",

            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Puerto base"
          value={profilePuerto}
          onChange={(e) =>
            setProfilePuerto(
              e.target.value
            )
          }
          style={{
            width: "100%",

            padding: "10px",

            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Experiencia"
          value={
            profileExperiencia
          }
          onChange={(e) =>
            setProfileExperiencia(
              e.target.value
            )
          }
          style={{
            width: "100%",

            padding: "10px",

            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Disponibilidad"
          value={
            profileDisponibilidad
          }
          onChange={(e) =>
            setProfileDisponibilidad(
              e.target.value
            )
          }
          style={{
            width: "100%",

            padding: "10px",

            marginBottom: "10px",
          }}
        />


<input
  type="text"
  placeholder="Rol a bordo"
  value={profileRol}
  onChange={(e) =>
    setProfileRol(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

<input
  type="text"
  placeholder="Titulación"
  value={profileTitulacion}
  onChange={(e) =>
    setProfileTitulacion(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

<input
  type="text"
  placeholder="Millas navegadas"
  value={profileMillas}
  onChange={(e) =>
    setProfileMillas(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

<input
  type="text"
  placeholder="Tipo de navegación"
  value={profileTipoNavegacion}
  onChange={(e) =>
    setProfileTipoNavegacion(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

<input
  type="text"
  placeholder="Idiomas"
  value={profileIdiomas}
  onChange={(e) =>
    setProfileIdiomas(
      e.target.value
    )
  }
  style={{
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

<textarea
  placeholder="Habilidades"
  value={profileHabilidades}
  onChange={(e) =>
    setProfileHabilidades(
      e.target.value
    )
  }
  style={{
    width: "100%",
    height: "90px",
    padding: "10px",
    marginBottom: "10px",
  }}
/>

        <textarea
          placeholder="Descripción"
          value={
            profileDescripcion
          }
          onChange={(e) =>
            setProfileDescripcion(
              e.target.value
            )
          }
          style={{
            width: "100%",

            height: "120px",

            padding: "10px",

            marginBottom: "10px",
          }}
        />

        <button
          onClick={saveProfile}
          style={{
            padding:
              "10px 20px",

            backgroundColor:
              "#720792",

            color: "white",

            border:
              "white solid 2px",

            borderRadius: "8px",

            cursor: "pointer",
          }}
        >
          Guardar perfil
        </button>

      </div>

      {/* LISTA PERFILES */}

      {profiles.map((profile) => (

        <div
          key={profile.id}

          style={{
            backgroundColor:
              "#001b44",

            border:
              "2px solid #ddd",

            borderRadius:
              "12px",

            padding: "15px",

            marginBottom: "20px",
          }}
        >

          <h2
            style={{
              color: "#e7eb0f",
            }}
          >
            {profile.nombre}
          </h2>

          <p
            style={{
              color: "white",
            }}
          >
            📍 Puerto:
            {" "}
            {profile.puerto}
          </p>

          <p
            style={{
              color: "white",
            }}
          >
            ⛵ Experiencia:
            {" "}
            {
              profile.experiencia
            }
          </p>

          <p
            style={{
              color: "white",
            }}
          >
            📅 Disponibilidad:
            {" "}
            {
              profile.disponibilidad
            }
          </p>
<p
  style={{
    color: "white",
  }}
>
  🧭 Rol:
  {" "}
  {profile.rol}
</p>

<p
  style={{
    color: "white",
  }}
>
  🎓 Titulación:
  {" "}
  {profile.titulacion}
</p>

<p
  style={{
    color: "white",
  }}
>
  🌊 Millas:
  {" "}
  {profile.millas}
</p>

<p
  style={{
    color: "white",
  }}
>
  ⛵ Navegación:
  {" "}
  {
    profile.tipo_navegacion
  }
</p>

<p
  style={{
    color: "white",
  }}
>
  🌍 Idiomas:
  {" "}
  {profile.idiomas}
</p>

<p
  style={{
    color: "white",
  }}
>
  🛠️ Habilidades:
  {" "}
  {
    profile.habilidades
  }
</p>
          <p
            style={{
              color: "white",
            }}
          >
            📝
            {" "}
            {
              profile.descripcion
            }
          </p>

          {user?.id !==
            profile.id && (

            <div
              style={{
                display: "flex",

                justifyContent:
                  "center",

                marginTop: "16px",
              }}
            >

              <button
                onClick={async () => {

                  const conversacionId =
                    await obtenerOCrearConversacion(
                      user.id,
                      profile.id
                    );

                  navigate(
                    `/conversacion/${conversacionId}`
                  );
                }}

                style={{
                  width: "100%",

                  padding: "14px",

                  background:
                    "#0d7a32",

                  color:
                    "white",

                  border:
                    "none",

                  borderRadius:
                    "10px",

                  cursor:
                    "pointer",

                  fontWeight:
                    "bold",

                  fontSize:
                    "16px",
                }}
              >
                💬 CHAT
              </button>

            </div>

          )}

        </div>

      ))}

      <BottomNav />

    </div>
  );
}