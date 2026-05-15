import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BottomNav from "../components/BottomNav";

export default function Bricos() {

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
  ] = useState("MOTOR");

  const [imagen, setImagen] =
    useState(null);

  const [archivo, setArchivo] =
    useState(null);

  const [busqueda, setBusqueda] =
    useState("");

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
        .from("bricos")
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
    PUBLICAR
    ==========================================
  */

  async function publicar() {

    if (
      !titulo ||
      !descripcion
    ) {

      alert(
        "Completa título y descripción"
      );

      return;
    }

    let imageUrl = "";
    let fileUrl = "";

    /*
      ==========================================
      SUBIR IMAGEN
      ==========================================
    */

    if (imagen) {

      const imageName =
        `${Date.now()}-${imagen.name}`;

      const {
        error: imageError,
      } =
        await supabase.storage
          .from("bricos")
          .upload(
            imageName,
            imagen
          );

      if (imageError) {

        alert(
          "Error subiendo imagen"
        );

        return;
      }

      const imageData =
        supabase.storage
          .from("bricos")
          .getPublicUrl(
            imageName
          );

      imageUrl =
        imageData.data.publicUrl;
    }

    /*
      ==========================================
      SUBIR ARCHIVO
      ==========================================
    */

    if (archivo) {

      const fileName =
        `${Date.now()}-${archivo.name}`;

      const {
        error: fileError,
      } =
        await supabase.storage
          .from("bricos")
          .upload(
            fileName,
            archivo
          );

      if (fileError) {

        alert(
          "Error subiendo archivo"
        );

        return;
      }

      const fileData =
        supabase.storage
          .from("bricos")
          .getPublicUrl(
            fileName
          );

      fileUrl =
        fileData.data.publicUrl;
    }

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
      INSERT
      ==========================================
    */

    const { error } =
      await supabase
        .from("bricos")
        .insert([
          {
            titulo,
            descripcion,
            categoria,

            imagen: imageUrl,

            archivo: fileUrl,

            usuario:
              user?.email ||
              "usuario",
          },
        ]);

    if (error) {

      alert(
        "Error guardando brico"
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
      "MOTOR"
    );

    setImagen(null);

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
        "¿Eliminar brico?"
      );

    if (!confirmar) return;

    const { error } =
      await supabase
        .from("bricos")
        .delete()
        .eq("id", id);

    if (error) {

      alert(
        "Error eliminando"
      );

      return;
    }

    cargarPosts();
  }

  /*
    ==========================================
    FILTROS
    ==========================================
  */

  const filteredPosts =
    posts.filter((post) => {

      const coincideBusqueda =

        post.titulo
          ?.toLowerCase()
          .includes(
            busqueda.toLowerCase()
          )

        ||

        post.descripcion
          ?.toLowerCase()
          .includes(
            busqueda.toLowerCase()
          );

      const coincideCategoria =

        filtroCategoria ===
        "TODOS"

          ? true

          : post.categoria ===
            filtroCategoria;

      return (
        coincideBusqueda &&
        coincideCategoria
      );
    });

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
          🔧 BRICOS
        </h1>

        <p
          style={{
            opacity: 0.9,

            fontSize: isMobile
              ? "16px"
              : "20px",
          }}
        >
          Bricolaje y mejoras Furia
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
          placeholder="Título del brico"
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
          placeholder="Descripción del brico"
          value={descripcion}
          onChange={(e) =>
            setDescripcion(
              e.target.value
            )
          }
          style={{
            width: "100%",

            minHeight: "140px",

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

          <option>MOTOR</option>

          <option>INTERIOR</option>

          <option>BIMINI</option>

          <option>ELECTRICIDAD</option>

          <option>PINTURAS</option>

          <option>OTROS</option>

        </select>

        {/* IMAGEN */}

        <div
          style={{
            marginBottom: "14px",
          }}
        >

          <div
            style={{
              marginBottom: "8px",

              opacity: 0.9,
            }}
          >
            Imagen principal
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImagen(
                e.target.files[0]
              )
            }
            style={{
              color: "white",
            }}
          />

        </div>

        {/* ARCHIVO */}

        <div
          style={{
            marginBottom: "22px",
          }}
        >

          <div
            style={{
              marginBottom: "8px",

              opacity: 0.9,
            }}
          >
            PDF o documento
          </div>

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
          PUBLICAR BRICO
        </button>

      </div>

      {/* BUSCADOR */}

      <input
        placeholder="🔍 Buscar brico..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(
            e.target.value
          )
        }
        style={{
          width: "100%",

          maxWidth: "1000px",

          display: "block",

          margin:
            "0 auto 22px auto",

          padding: "14px",

          borderRadius: "16px",

          border: "none",

          boxSizing:
            "border-box",
        }}
      />

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
          "MOTOR",
          "INTERIOR",
          "BIMINI",
          "ELECTRICIDAD",
          "PINTURAS",
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

      {/* POSTS */}

      <div
        style={{
          maxWidth: "1000px",

          margin: "0 auto",

          display: "flex",

          flexDirection: "column",

          gap: "22px",
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
                  "24px",

                overflow:
                  "hidden",

                border:
                  "1px solid rgba(255,255,255,0.12)",
              }}
            >

              {/* IMAGEN */}

              {post.imagen && (

                <img
                  src={
                    post.imagen
                  }
                  alt=""
                  style={{
                    width: "100%",

                    maxHeight:
                      "420px",

                    objectFit:
                      "cover",
                  }}
                />

              )}

              {/* CONTENIDO */}

              <div
                style={{
                  padding:
                    isMobile
                      ? "18px"
                      : "24px",
                }}
              >

                <h2
                  style={{
                    color:
                      "#fe5d01",

                    fontSize:
                      isMobile
                        ? "28px"
                        : "34px",

                    marginBottom:
                      "14px",
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
                      "18px",

                    fontWeight:
                      "bold",
                  }}
                >
                  {
                    post.categoria
                  }
                </div>

                {/* DESCRIPCIÓN */}

                <p
                  style={{
                    lineHeight:
                      1.7,

                    marginBottom:
                      "22px",

                    opacity: 0.95,
                  }}
                >
                  {
                    post.descripcion
                  }
                </p>

                {/* BOTONES */}

                <div
                  style={{
                    display:
                      "flex",

                    flexWrap:
                      "wrap",

                    gap: "12px",
                  }}
                >

                  {/* VER */}

                  {post.archivo && (

                    <a
                      href={
                        post.archivo
                      }
                      target="_blank"
                      rel="noopener noreferrer"
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
                        VER PDF
                      </button>

                    </a>

                  )}

                  {/* DESCARGAR */}

                  {post.archivo && (

                    <a
                      href={
                        post.archivo
                      }
                      download
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

                  )}

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

            </div>

          )
        )}

      </div>

      <BottomNav />

    </div>

  );
}