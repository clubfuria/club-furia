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

        {/* ARCHIVO */}

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

        {/* BOTÓN */}

        <button
          onClick={publicar}
          style={{
            width: "100%",

            background:
              "#fe5d01",

            color: "white",

            border: "none",

            padding: "16px",

            borderRadius: "16px",

            fontSize: "18px",

            fontWeight: "bold",

            cursor: "pointer",
          }}
        >
          SUBIR RECURSO
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

          gap: "20px",
        }}
      >

        {filteredPosts.map(
          (post) => (

            <div
              key={post.id}
              style={{
                background:
                  "rgba(255,255,255,0.08)",

                borderRadius:
                  "22px",

                padding:
                  isMobile
                    ? "18px"
                    : "24px",

                border:
                  "1px solid rgba(255,255,255,0.12)",
              }}
            >

              {/* TITULO */}

              <h2
                style={{
                  color:
                    "#fe5d01",

                  marginBottom:
                    "12px",

                  fontSize:
                    isMobile
                      ? "28px"
                      : "34px",
                }}
              >
                {post.titulo}
              </h2>

              {/* CATEGORÍA */}

              <div
                style={{
                  display:
                    "inline-block",

                  background:
                    "#720792",

                  padding:
                    "8px 14px",

                  borderRadius:
                    "12px",

                  marginBottom:
                    "16px",

                  fontWeight:
                    "bold",
                }}
              >
                {post.categoria}
              </div>

              {/* DESCRIPCIÓN */}

              <p
                style={{
                  lineHeight: 1.7,

                  opacity: 0.95,

                  marginBottom:
                    "22px",
                }}
              >
                {post.descripcion}
              </p>

              {/* BOTONES */}

              <div
                style={{
                  display: "flex",

                  flexWrap: "wrap",

                  gap: "12px",
                }}
              >

                {/* VER */}

                <a
                  href={
                    post.archivo
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration:
                      "none",
                  }}
                >

                  <button
                    style={{
                      background:
                        "#0d7a32",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "12px 18px",

                      borderRadius:
                        "14px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",
                    }}
                  >
                    VER
                  </button>

                </a>

                {/* DESCARGAR */}

                <a
                  href={
                    post.archivo
                  }
                  download
                  style={{
                    textDecoration:
                      "none",
                  }}
                >

                  <button
                    style={{
                      background:
                        "#1565c0",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "12px 18px",

                      borderRadius:
                        "14px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",
                    }}
                  >
                    DESCARGAR
                  </button>

                </a>

                {/* ELIMINAR */}

                {userEmail ===
                  post.usuario && (

                  <button
                    onClick={() =>
                      eliminarPost(
                        post.id
                      )
                    }
                    style={{
                      background:
                        "#c62828",

                      color:
                        "white",

                      border:
                        "none",

                      padding:
                        "12px 18px",

                      borderRadius:
                        "14px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "bold",
                    }}
                  >
                    ELIMINAR
                  </button>

                )}

              </div>

            </div>

          )
        )}

      </div>

      <BottomNav />

    </div>

  );
}