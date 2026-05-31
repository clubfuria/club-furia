import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BottomNav from "../components/BottomNav";

export default function Recursos() {

  /*
    ==========================================
    RESPONSIVE
    ==========================================
  */

  const isMobile =
    window.innerWidth < 768;

  /*
    ==========================================
    ESTADOS
    ==========================================
  */

  const [posts, setPosts] =
    useState([]);

const [enlaces, setEnlaces] =
  useState([]);

const [vista, setVista] =
  useState("RECURSOS");

const [url, setUrl] =
  useState("");

  const [titulo, setTitulo] =
    useState("");

  const [
    descripcion,
    setDescripcion,
  ] = useState("");

  const [
    categoria,
    setCategoria,
  ] = useState(
    "MODELOS FURIA"
  );

  const [archivo, setArchivo] =
    useState(null);

  const [
    filtroCategoria,
    setFiltroCategoria,
  ] = useState("TODOS");

  const [userEmail, setUserEmail] =
    useState("");

  /*
    ==========================================
    CARGA INICIAL
    ==========================================
  */

  useEffect(() => {

  cargarPosts();

  cargarEnlaces();

  cargarUsuario();

}, []);

  /*
    ==========================================
    CARGAR USUARIO
    ==========================================
  */

  async function cargarUsuario() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (user) {

      setUserEmail(
        user.email
      );
    }
  }

  /*
    ==========================================
    CARGAR POSTS
    ==========================================
  */

  async function cargarPosts() {

    const { data, error } =
      await supabase
        .from("recursos")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error && data) {

      setPosts(data);
    }
  }

async function cargarEnlaces() {

  const { data, error } =
    await supabase
      .from("enlaces_interes")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (!error && data) {

    setEnlaces(data);
  }
}


  /*
    ==========================================
    SUBIR RECURSO
    ==========================================
  */

  async function publicar() {

    if (
      !titulo ||
      !descripcion ||
      !archivo
    ) {

      alert(
        "Completa todos los campos"
      );

      return;
    }

    let fileUrl = "";

    /*
      ==========================================
      SUBIR ARCHIVO
      ==========================================
    */

    const nombreArchivo =
      `${Date.now()}-${archivo.name}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("recursos")
        .upload(
          nombreArchivo,
          archivo
        );

    if (uploadError) {

      alert(
        "Error subiendo archivo"
      );

      console.log(uploadError);

      return;
    }

    const publicUrlData =
      supabase.storage
        .from("recursos")
        .getPublicUrl(
          nombreArchivo
        );

    fileUrl =
      publicUrlData.data.publicUrl;

    /*
      ==========================================
      USUARIO
      ==========================================
    */

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    /*
      ==========================================
      GUARDAR
      ==========================================
    */

    const { error } =
      await supabase
        .from("recursos")
        .insert([
          {
            titulo,
            descripcion,
            categoria,
            archivo: fileUrl,
            usuario:
              user?.email ||
              "usuario",
          },
        ]);

    if (error) {

      alert(
        "Error guardando recurso"
      );

      console.log(error);

      return;
    }

    /*
      ==========================================
      LIMPIAR
      ==========================================
    */

    setTitulo("");

    setDescripcion("");

    setCategoria(
      "MODELOS FURIA"
    );

    setArchivo(null);

    cargarPosts();
  }

async function publicarEnlace() {

  if (
    !titulo ||
    !descripcion ||
    !url
  ) {

    alert(
      "Completa todos los campos"
    );

    return;
  }

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  const { error } =
    await supabase
      .from("enlaces_interes")
      .insert([
        {
          titulo,
          descripcion,
          url,
          categoria,
          usuario:
            user?.email ||
            "usuario",
        },
      ]);

  if (error) {

    alert(
      "Error guardando enlace"
    );

    console.log(error);

    return;
  }

  setTitulo("");

  setDescripcion("");

  setUrl("");

  setCategoria(
    "OTROS"
  );

  cargarEnlaces();
}
  
  /*
    ==========================================
    ELIMINAR
    ==========================================
  */

  async function eliminarPost(
    id
  ) {

    const confirmar =
      window.confirm(
        "¿Eliminar recurso?"
      );

    if (!confirmar) return;

    const { error } =
      await supabase
        .from("recursos")
        .delete()
        .eq("id", id);

    if (error) {

      alert(
        "Error eliminando"
      );

      console.log(error);

      return;
    }

    cargarPosts();
  }

async function eliminarEnlace(
  id
) {

  const confirmar =
    window.confirm(
      "¿Eliminar enlace?"
    );

  if (!confirmar) return;

  const { error } =
    await supabase
      .from("enlaces_interes")
      .delete()
      .eq("id", id);

  if (error) {

    alert(
      "Error eliminando enlace"
    );

    console.log(error);

    return;
  }

  cargarEnlaces();
}

  /*
    ==========================================
    FILTRO
    ==========================================
  */

  const filteredPosts =

  
    filtroCategoria === "TODOS"

      ? posts

      : posts.filter(
          (post) =>
            post.categoria ===
            filtroCategoria
        );

        const filteredEnlaces =

  filtroCategoria === "TODOS"

    ? enlaces

    : enlaces.filter(
        (enlace) =>
          enlace.categoria ===
          filtroCategoria
      );

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(to bottom, #021224 0%, #08203b 45%, #0c3157 100%)",

        padding: isMobile
          ? "20px 14px 120px"
          : "25px 20px 120px",

        color: "white",

        fontFamily: "Arial",

        boxSizing: "border-box",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          textAlign: "center",

          marginBottom: "30px",
        }}
      >

        <h1
          style={{
            color: "#fe5d01",

            fontSize: isMobile
              ? "38px"
              : "52px",

            marginBottom: "12px",
          }}
        >
          📚 RECURSOS
        </h1>

        <p
          style={{
            opacity: 0.9,

            fontSize: isMobile
              ? "16px"
              : "20px",
          }}
        >
          Biblioteca técnica Furia
        </p>

        <div
  style={{
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "20px",
  }}
>

  <button
    onClick={() =>
      setVista("RECURSOS")
    }
    style={{
      background:
        vista === "RECURSOS"
          ? "#fe5d01"
          : "rgba(255,255,255,0.08)",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    📚 RECURSOS
  </button>

  <button
    onClick={() =>
      setVista("ENLACES")
    }
    style={{
      background:
        vista === "ENLACES"
          ? "#fe5d01"
          : "rgba(255,255,255,0.08)",
      color: "white",
      border: "none",
      padding: "12px 18px",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    🔗 ENLACES
  </button>

</div>

      </div>

      {/* FORMULARIO */}

      <div
        style={{
          maxWidth: "900px",

          margin:
            "0 auto 35px auto",

          background:
            "rgba(255,255,255,0.08)",

          padding: "22px",

          borderRadius: "22px",

          border:
            "1px solid rgba(255,255,255,0.12)",
        }}
      >

        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) =>
            setTitulo(
              e.target.value
            )
          }
          style={{
            width: "100%",

            padding: "14px",

            marginBottom: "14px",

            borderRadius: "14px",

            border: "none",

            boxSizing:
              "border-box",
          }}
        />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) =>
            setDescripcion(
              e.target.value
            )
          }
          style={{
            width: "100%",

            minHeight: "120px",

            padding: "14px",

            marginBottom: "14px",

            borderRadius: "14px",

            border: "none",

            boxSizing:
              "border-box",
          }}
        />

        {/* CATEGORÍA */}

        <select
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value
            )
          }
          style={{
            width: "100%",

            padding: "14px",

            marginBottom: "16px",

            borderRadius: "14px",

            border: "none",

            boxSizing:
              "border-box",
          }}
        >

          <option>
            MODELOS FURIA
          </option>

          <option>
            MOTORES
          </option>

          <option>
            VELAS
          </option>

          <option>
            REGLAJES
          </option>

          <option>
            OTROS
          </option>

        </select>


 {vista === "RECURSOS" ? (

  <div
    style={{
      marginBottom: "20px",
    }}
  >
    <input
      type="file"
      onChange={(e) =>
        setArchivo(
          e.target.files[0]
        )
      }
      style={{
        color: "white",
      }}
    />
  </div>

) : (

  <input
    placeholder="https://..."
    value={url}
    onChange={(e) =>
      setUrl(
        e.target.value
      )
    }
    style={{
      width: "100%",
      padding: "14px",
      marginBottom: "20px",
      borderRadius: "14px",
      border: "none",
      boxSizing: "border-box",
    }}
  />

)}

        {/* BOTÓN */}

       <button
  onClick={() =>
    vista === "RECURSOS"
      ? publicar()
      : publicarEnlace()
  }
  style={{
    width: "100%",
    background: "#fe5d01",
    color: "white",
    border: "none",
    padding: "16px",
    borderRadius: "16px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
  }}
>
  {vista === "RECURSOS"
    ? "SUBIR RECURSO"
    : "GUARDAR ENLACE"}
</button>

      </div>

      {/* FILTROS */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "center",

          flexWrap: "wrap",

          gap: "12px",

          marginBottom: "30px",
        }}
      >

        {[
          "TODOS",
          "MODELOS FURIA",
          "MOTORES",
          "VELAS",
          "REGLAJES",
          "OTROS",
        ].map((cat) => (

          <button
            key={cat}
            onClick={() =>
              setFiltroCategoria(
                cat
              )
            }
            style={{
              background:
                filtroCategoria ===
                cat
                  ? "#fe5d01"
                  : "rgba(255,255,255,0.08)",

              color: "white",

              border:
                "1px solid rgba(255,255,255,0.15)",

              padding:
                "10px 18px",

              borderRadius:
                "14px",

              cursor: "pointer",

              fontWeight: "bold",
            }}
          >
            {cat}
          </button>

        ))}

      </div>

      {/* LISTA */}

<div
  style={{
    maxWidth: "1000px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }}
>

  {vista === "RECURSOS" ? (

    filteredPosts.map((post) => (

      <div
        key={post.id}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >

          <div
            style={{
              color: "#fe5d01",
              fontSize:
                isMobile
                  ? "15px"
                  : "18px",
              fontWeight: "bold",
            }}
          >
            📄 {post.titulo}
          </div>

          <div
            style={{
              fontSize: "12px",
              opacity: 0.8,
              marginTop: "4px",
            }}
          >
            {post.categoria}
          </div>

        </div>

        <a
          href={post.archivo}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            style={{
              background: "#0d7a32",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
            }}
          >
            VER
          </button>
        </a>

      </div>

    ))

  ) : (

    filteredEnlaces.map((enlace) => (

      <div
        key={enlace.id}
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >

        <div
          style={{
            flex: 1,
          }}
        >

          <div
            style={{
              color: "#fe5d01",
              fontSize:
                isMobile
                  ? "15px"
                  : "18px",
              fontWeight: "bold",
            }}
          >
            🔗 {enlace.titulo}
          </div>

          <div
            style={{
              fontSize: "12px",
              opacity: 0.8,
            }}
          >
            {enlace.categoria}
          </div>

        </div>

        <a
          href={enlace.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            style={{
              background: "#1565c0",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "8px",
            }}
          >
            VISITAR
          </button>
        </a>

      </div>

    ))

  )}

</div>

      <BottomNav />

    </div>

  );
}