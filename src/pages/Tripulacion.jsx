import BottomNav
from "../components/BottomNav";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Tripulacion() {

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

  // FETCH PROFILES

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

  // FETCH MY PROFILE

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
    }
  }

  // SAVE PROFILE

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
            },
          ]);

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Perfil guardado"
      );

      fetchProfiles();
    };

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#011135",
        minHeight: "100vh",
      }}
    >

      {/* CABECERA */}

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
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
            textDecoration: "none",
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
            📝
            {" "}
            {
              profile.descripcion
            }
          </p>

        </div>

      ))}
<BottomNav />
    </div>

  );
}