import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import BottomNav from "../components/BottomNav";

export default function Compraventa() {
  /*
    ==========================================
    RESPONSIVE
    ==========================================
  */

  const isMobile = window.innerWidth < 768;

  /*
    ==========================================
    ESTADOS
    ==========================================
  */

  const [posts, setPosts] = useState([]);

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");

  // IMAGEN
  const [imagen, setImagen] = useState(null);

  // USUARIO
  const [userEmail, setUserEmail] = useState("");

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
    } = await supabase.auth.getUser();

    if (user) {
      setUserEmail(user.email);
    }
  }

  /*
    ==========================================
    CARGAR POSTS
    ==========================================
  */

  async function cargarPosts() {
    const { data, error } = await supabase
      .from("compraventa")
      .select("*")
      .order("created_at", { ascending: false });

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
    if (!titulo || !descripcion || !precio) {
      alert("Completa todos los campos");
      return;
    }

    let imageUrl = "";

    /*
      ==========================================
      SUBIR IMAGEN
      ==========================================
    */

    if (imagen) {
      const nombreArchivo = `${Date.now()}-${imagen.name}`;

      const { error: uploadError } = await supabase.storage
        .from("compraventa")
        .upload(nombreArchivo, imagen);

      if (uploadError) {
        alert("Error subiendo imagen");
        console.log(uploadError);
        return;
      }

      // URL PÚBLICA

      const publicUrlData = supabase.storage
        .from("compraventa")
        .getPublicUrl(nombreArchivo);

      imageUrl = publicUrlData.data.publicUrl;
    }

    /*
      ==========================================
      USUARIO
      ==========================================
    */

    const {
      data: { user },
    } = await supabase.auth.getUser();

    /*
      ==========================================
      GUARDAR POST
      ==========================================
    */

    const { error } = await supabase.from("compraventa").insert([
      {
        titulo,
        descripcion,
        precio,
        imagen: imageUrl,
        usuario: user?.email || "usuario",
      },
    ]);

    if (error) {
      alert("Error publicando anuncio");
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
    setPrecio("");
    setImagen(null);

    /*
      ==========================================
      RECARGAR
      ==========================================
    */

    cargarPosts();
  }

  /*
    ==========================================
    ELIMINAR
    ==========================================
  */

  async function eliminarPost(id) {
    const confirmar = window.confirm(
      "¿Eliminar este anuncio?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("compraventa")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error eliminando anuncio");
      console.log(error);
      return;
    }

    cargarPosts();
  }

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

        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ==========================================
          CABECERA
      ========================================== */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "35px",
        }}
      >
        <h1
          style={{
            color: "#fe5d01",

            fontSize: isMobile ? "38px" : "52px",

            marginBottom: "16px",

            letterSpacing: "3px",
          }}
        >
          COMPRAVENTA
        </h1>

        <p
          style={{
            fontSize: isMobile ? "16px" : "20px",

            opacity: 0.9,

            lineHeight: 1.6,
          }}
        >
          Material náutico entre armadores Furia
        </p>
      </div>

      {/* ==========================================
          FORMULARIO
      ========================================== */}

      <div
        style={{
          maxWidth: "900px",

          margin: "0 auto 35px auto",

          background: "rgba(255,255,255,0.08)",

          backdropFilter: "blur(10px)",

          border: "1px solid rgba(255,255,255,0.12)",

          borderRadius: "22px",

          padding: isMobile ? "18px" : "24px",

          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        {/* TITULO */}

        <input
          placeholder="Título del anuncio"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          style={{
            width: "100%",

            padding: "14px",

            marginBottom: "14px",

            borderRadius: "14px",

            border: "none",

            outline: "none",

            fontSize: "16px",

            boxSizing: "border-box",

            background: "rgba(255,255,255,0.95)",
          }}
        />

        {/* DESCRIPCIÓN */}

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          style={{
            width: "100%",

            minHeight: "130px",

            padding: "14px",

            marginBottom: "14px",

            borderRadius: "14px",

            border: "none",

            outline: "none",

            fontSize: "16px",

            resize: "vertical",

            boxSizing: "border-box",

            background: "rgba(255,255,255,0.95)",
          }}
        />

        {/* PRECIO */}

        <input
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={{
            width: "100%",

            padding: "14px",

            marginBottom: "18px",

            borderRadius: "14px",

            border: "none",

            outline: "none",

            fontSize: "16px",

            boxSizing: "border-box",

            background: "rgba(255,255,255,0.95)",
          }}
        />

        {/* SUBIR IMAGEN */}

        <div
          style={{
            marginBottom: "22px",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            style={{
              color: "white",
              fontSize: "16px",
            }}
          />
        </div>

        {/* BOTÓN */}

        <button
          onClick={publicar}
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
          PUBLICAR ANUNCIO
        </button>
      </div>

      {/* ==========================================
          POSTS
      ========================================== */}

      <div
        style={{
          maxWidth: "1000px",

          margin: "0 auto",

          display: "flex",

          flexDirection: "column",

          gap: "22px",
        }}
      >
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              background: "rgba(255,255,255,0.08)",

              borderRadius: "24px",

              overflow: "hidden",

              border: "1px solid rgba(255,255,255,0.12)",

              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >
            {/* IMAGEN */}

            {post.imagen && (
              <img
                src={post.imagen}
                alt={post.titulo}
                style={{
                  width: "100%",

                  height: isMobile ? "220px" : "320px",

                  objectFit: "cover",
                }}
              />
            )}

            {/* CONTENIDO */}

            <div
              style={{
                padding: isMobile ? "18px" : "24px",
              }}
            >
              {/* TITULO */}

              <h2
                style={{
                  color: "#fe5d01",

                  fontSize: isMobile ? "28px" : "34px",

                  marginBottom: "14px",
                }}
              >
                {post.titulo}
              </h2>

              {/* DESCRIPCIÓN */}

              <p
                style={{
                  lineHeight: 1.7,

                  fontSize: isMobile ? "16px" : "18px",

                  opacity: 0.95,

                  marginBottom: "20px",
                }}
              >
                {post.descripcion}
              </p>

              {/* FOOTER */}

              <div
                style={{
                  display: "flex",

                  justifyContent: "space-between",

                  alignItems: "center",

                  flexDirection: isMobile ? "column" : "row",

                  gap: isMobile ? "18px" : "0",
                }}
              >
                {/* PRECIO */}

                <div
                  style={{
                    fontSize: isMobile ? "30px" : "36px",

                    fontWeight: "bold",

                    color: "white",
                  }}
                >
                  {post.precio}
                </div>

                {/* USUARIO */}

                <div
                  style={{
                    background: "#fe5d01",

                    padding: "12px 18px",

                    borderRadius: "14px",

                    fontWeight: "bold",

                    fontSize: "15px",
                  }}
                >
                  {post.usuario}
                </div>
              </div>

              {/* ELIMINAR */}

              {userEmail === post.usuario && (
                <button
                  onClick={() => eliminarPost(post.id)}
                  style={{
                    marginTop: "18px",

                    width: "100%",

                    background: "#c62828",

                    border: "none",

                    padding: "14px",

                    borderRadius: "14px",

                    color: "white",

                    fontWeight: "bold",

                    fontSize: "16px",

                    cursor: "pointer",
                  }}
                >
                  ELIMINAR ANUNCIO
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ==========================================
          BOTTOM NAV
      ========================================== */}

      <BottomNav />
    </div>
  );
}