import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Home() {

  const navigate = useNavigate();

  /*
    ==========================================
    AUTH
    ==========================================
  */

  const [session, setSession] =
    useState(null);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  /*
    ==========================================
    POSTS
    ==========================================
  */

  const [posts, setPosts] =
    useState([]);

  const [nuevoPost, setNuevoPost] =
    useState("");

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(({ data }) => {

        setSession(
          data.session
        );
      });

    cargarPosts();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          setSession(session);
        }
      );

    return () =>
      subscription.unsubscribe();

  }, []);

  /*
    ==========================================
    LOGIN
    ==========================================
  */

  async function login() {

    if (!email || !password) {

      alert(
        "Introduce email y contraseña"
      );

      return;
    }

    const { error } =
      await supabase.auth.signInWithPassword({

        email,

        password,
      });

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Sesión iniciada"
    );
  }

  /*
    ==========================================
    REGISTRO
    ==========================================
  */

  async function registrarse() {

    if (!email || !password) {

      alert(
        "Introduce email y contraseña"
      );

      return;
    }

    if (password.length < 6) {

      alert(
        "La contraseña debe tener mínimo 6 caracteres"
      );

      return;
    }

    const { error } =
      await supabase.auth.signUp({

        email,

        password,

        options: {

          emailRedirectTo:
            window.location.origin,
        },
      });

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Cuenta creada correctamente. Revisa tu correo para confirmar el registro."
    );
  }

  /*
    ==========================================
    POSTS
    ==========================================
  */

  async function cargarPosts() {

    const { data } =
      await supabase
        .from("posts")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (data) {

      setPosts(data);
    }
  }

  async function publicarPost() {

    if (!session) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    if (!nuevoPost.trim()) {

      return;
    }

    const { error } =
      await supabase
        .from("posts")
        .insert([
          {
            texto: nuevoPost,

            usuario:
              session.user.email,
          },
        ]);

    if (error) {

      alert(error.message);

      return;
    }

    setNuevoPost("");

    cargarPosts();
  }

  async function borrarPost(id) {

    const confirmar =
      window.confirm(
        "¿Eliminar comentario?"
      );

    if (!confirmar) return;

    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    cargarPosts();
  }

  /*
    ==========================================
    RESPONSIVE
    ==========================================
  */

  const isMobile =
    window.innerWidth < 768;

  /*
    ==========================================
    PERSONALIZACIÓN
    ==========================================
  */

  const TITLE_COLOR = "#fe5d01";

  const TEXT_COLOR = "#e0f406";

  const BACKGROUND_TOP =
    "#021224";

  const BACKGROUND_MIDDLE =
    "#08203b";

  const BACKGROUND_BOTTOM =
    "#0c3157";

  const HEADER_TITLE_SIZE =
    isMobile
      ? "42px"
      : "64px";

  const HEADER_SUBTITLE_SIZE =
    isMobile
      ? "16px"
      : "20px";

  const BUTTON_TITLE_SIZE =
    isMobile
      ? "28px"
      : "36px";

  const BUTTON_DESCRIPTION_SIZE =
    isMobile
      ? "16px"
      : "18px";

  const LOGO_WIDTH =
    isMobile
      ? "280px"
      : "280px";

  /*
    ==========================================
    BOTONES
    ==========================================
  */

  const buttons = [
    {
      title: "BARCOS",
      description:
        "Modelos, fichas y fotos de la flota Furia",
      path: "/barcos",
      image: "/buttons/boats.png",
    },

    {
      title: "TRIPULACIÓN",
      description:
        "Armadores y tripulantes",
      path: "/tripulacion",
      image:
        "/buttons/tripulacion.png",
    },

    {
      title: "ACTIVIDADES",
      description:
        "Regatas, encuentros y navegación",
      path: "/actividades",
      image:
        "/buttons/actividades.png",
    },

    {
      title: "RECURSOS",
      description:
        "Manuales, documentación y enlaces útiles",
      path: "/recursos",
      image:
        "/buttons/recursos.png",
    },

    {
      title: "COMPRAVENTA",
      description:
        "Compra y venta de material náutico",
      path: "/compraventa",
      image:
        "/buttons/compraventa.png",
    },

    {
      title: "BRICOS",
      description:
        "Mejoras, reparaciones y proyectos DIY",
      path: "/bricos",
      image:
        "/buttons/bricos.png",
    },
  ];

  return (

    <div
      style={{
        minHeight: "100vh",

        background: `linear-gradient(
          to bottom,
          ${BACKGROUND_TOP} 0%,
          ${BACKGROUND_MIDDLE} 45%,
          ${BACKGROUND_BOTTOM} 100%
        )`,

        padding:
          isMobile
            ? "20px 14px 40px"
            : "25px 20px 50px",

        fontFamily:
          "Arial, sans-serif",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          textAlign: "center",

          marginBottom:
            isMobile
              ? "35px"
              : "45px",
        }}
      >

        <img
          src="/logo.jpeg"
          alt="Club Furia"
          style={{
            width: LOGO_WIDTH,

            marginBottom:
              "19px",

            filter:
              "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
          }}
        />

        <h1
          style={{
            color:
              TITLE_COLOR,

            fontSize:
              HEADER_TITLE_SIZE,

            fontWeight:
              "bold",

            margin: 0,

            letterSpacing:
              "4px",

            lineHeight:
              "1.2",

            marginBottom:
              "24px",

            textShadow:
              "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          CLUB FURIA
        </h1>

        <p
          style={{
            color:
              TEXT_COLOR,

            fontSize:
              HEADER_SUBTITLE_SIZE,

            opacity: 0.95,

            margin: 0,

            lineHeight:
              "1.8",

            letterSpacing:
              "0.5px",

            padding:
              isMobile
                ? "0 10px"
                : 0,
          }}
        >
          Comunidad de armadores y amantes de los veleros Furia
        </p>

      </div>

      {/* LOGIN */}

      <div
        style={{
          maxWidth: "420px",

          margin:
            "0 auto 40px auto",
        }}
      >

        {!session ? (

          <div
            style={{
              background:
                "rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(10px)",

              border:
                "1px solid rgba(255,255,255,0.12)",

              borderRadius:
                "20px",

              padding:
                isMobile
                  ? "18px"
                  : "24px",

              boxShadow:
                "0 8px 20px rgba(0,0,0,0.25)",
            }}
          >

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom:
                  "14px",
                borderRadius:
                  "12px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                background:
                  "rgba(255,255,255,0.92)",
                boxSizing:
                  "border-box",
              }}
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px",
                marginBottom:
                  "18px",
                borderRadius:
                  "12px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                background:
                  "rgba(255,255,255,0.92)",
                boxSizing:
                  "border-box",
              }}
            />

            <button
              onClick={login}
              style={{
                width: "100%",
                padding: "15px",
                borderRadius:
                  "14px",
                border: "none",
                background:
                  TITLE_COLOR,
                color: "white",
                fontSize: "18px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
                marginBottom:
                  "12px",
              }}
            >
              ENTRAR
            </button>

            <button
              onClick={
                registrarse
              }
              style={{
                width: "100%",
                padding: "15px",
                borderRadius:
                  "14px",
                border: "none",
                background:
                  "#720792",
                color: "white",
                fontSize: "18px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
              }}
            >
              REGISTRARSE
            </button>

          </div>

        ) : (

          <div
            style={{
              background:
                "rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(10px)",

              border:
                "1px solid rgba(255,255,255,0.12)",

              borderRadius:
                "20px",

              padding:
                "20px",

              boxShadow:
                "0 8px 20px rgba(0,0,0,0.25)",

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap: "12px",

              flexWrap:
                "wrap",
            }}
          >

            <div
              style={{
                color: "white",

                fontSize:
                  "18px",

                fontWeight:
                  "bold",
              }}
            >
              Conectado:
              {" "}
              {session.user.email}
            </div>

            <button
              onClick={() =>
                supabase.auth.signOut()
              }
              style={{
                padding:
                  "10px 18px",
                borderRadius:
                  "12px",
                border:
                  "none",
                background:
                  "#fe5d01",
                color:
                  "white",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
              }}
            >
              SALIR
            </button>

          </div>

        )}

      </div>

      {/* BOTONES */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection:
            "column",
          gap: "20px",
        }}
      >

        {buttons.map(
          (button, index) => (

            <div
              key={index}
              onClick={() =>
                navigate(
                  button.path
                )
              }
              style={{
                borderRadius:
                  "24px",
                overflow:
                  "hidden",
                cursor:
                  "pointer",
                border:
                  "1px solid rgba(255,255,255,0.25)",

                background:
                  "linear-gradient(to right, #08203b 0%, #06192d 60%, #03101d 100%)",

                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.35)",

                display:
                  "flex",

                flexDirection:
                  isMobile
                    ? "column"
                    : "row",

                minHeight:
                  isMobile
                    ? "320px"
                    : "190px",
              }}
            >

              {/* IMAGEN */}

              <div
                style={{
                  width:
                    isMobile
                      ? "100%"
                      : "42%",

                  height:
                    isMobile
                      ? "190px"
                      : "auto",

                  overflow:
                    "hidden",

                  flexShrink: 0,
                }}
              >

                <img
                  src={
                    button.image
                  }
                  alt={
                    button.title
                  }
                  style={{
                    width: "100%",
                    height:
                      "100%",
                    objectFit:
                      "cover",
                  }}
                />

              </div>

              {/* TEXTO */}

              <div
                style={{
                  flex: 1,

                  display:
                    "flex",

                  flexDirection:
                    "column",

                  justifyContent:
                    "center",

                  padding:
                    isMobile
                      ? "24px 22px 30px"
                      : "0 40px",

                  background:
                    "linear-gradient(to right, rgba(8,32,59,0.15), rgba(2,12,25,0.92))",
                }}
              >

                <div
                  style={{
                    color:
                      TITLE_COLOR,

                    fontSize:
                      BUTTON_TITLE_SIZE,

                    fontWeight:
                      "bold",

                    marginBottom:
                      "14px",

                    textShadow:
                      "0 3px 10px rgba(0,0,0,0.7)",

                    letterSpacing:
                      "1px",

                    textAlign:
                      isMobile
                        ? "center"
                        : "left",
                  }}
                >
                  {button.title}
                </div>

                <div
                  style={{
                    color:
                      TEXT_COLOR,

                    fontSize:
                      BUTTON_DESCRIPTION_SIZE,

                    lineHeight:
                      1.5,

                    textShadow:
                      "0 2px 8px rgba(0,0,0,0.7)",

                    textAlign:
                      isMobile
                        ? "center"
                        : "left",
                  }}
                >
                  {
                    button.description
                  }
                </div>

              </div>

            </div>

          )
        )}

      </div>

      {/* POSTS COMUNIDAD */}

      <div
        style={{
          maxWidth: "1100px",

          margin:
            "60px auto 0 auto",
        }}
      >

        <h2
          style={{
            color:
              TITLE_COLOR,

            fontSize:
              isMobile
                ? "34px"
                : "42px",

            marginBottom:
              "25px",

            textAlign:
              "center",
          }}
        >
          COMUNIDAD
        </h2>

        {/* NUEVO POST */}

        {session && (

          <div
            style={{
              background:
                "rgba(255,255,255,0.08)",

              border:
                "1px solid rgba(255,255,255,0.12)",

              borderRadius:
                "22px",

              padding:
                isMobile
                  ? "18px"
                  : "24px",

              marginBottom:
                "28px",
            }}
          >

            <textarea
              placeholder="Escribe un comentario..."

              value={nuevoPost}

              onChange={(e) =>
                setNuevoPost(
                  e.target.value
                )
              }

              style={{
                width: "100%",

                minHeight:
                  "120px",

                padding:
                  "16px",

                borderRadius:
                  "16px",

                border:
                  "none",

                resize:
                  "vertical",

                fontSize:
                  "16px",

                marginBottom:
                  "18px",

                boxSizing:
                  "border-box",
              }}
            />

            <button
              onClick={
                publicarPost
              }

              style={{
                background:
                  TITLE_COLOR,

                color:
                  "white",

                border:
                  "none",

                padding:
                  "14px 24px",

                borderRadius:
                  "14px",

                fontWeight:
                  "bold",

                cursor:
                  "pointer",

                fontSize:
                  "16px",
              }}
            >
              PUBLICAR
            </button>

          </div>

        )}

        {/* POSTS */}

        <div
          style={{
            display: "flex",

            flexDirection:
              "column",

            gap: "22px",
          }}
        >

          {posts.map((post) => (

            <div
              key={post.id}

              style={{
                background:
                  "rgba(255,255,255,0.08)",

                border:
                  "1px solid rgba(255,255,255,0.12)",

                borderRadius:
                  "22px",

                padding:
                  isMobile
                    ? "18px"
                    : "24px",
              }}
            >

              <div
                style={{
                  color:
                    TITLE_COLOR,

                  fontWeight:
                    "bold",

                  marginBottom:
                    "14px",

                  fontSize:
                    "17px",
                }}
              >
                {post.usuario}
              </div>

              <div
                style={{
                  color:
                    "white",

                  lineHeight:
                    1.7,

                  fontSize:
                    isMobile
                      ? "16px"
                      : "18px",

                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {post.texto}
              </div>

              {session?.user?.email ===
                post.usuario && (

                <button
                  onClick={() =>
                    borrarPost(
                      post.id
                    )
                  }

                  style={{
                    marginTop:
                      "18px",

                    background:
                      "#b3261e",

                    border:
                      "none",

                    color:
                      "white",

                    padding:
                      "10px 16px",

                    borderRadius:
                      "12px",

                    cursor:
                      "pointer",

                    fontWeight:
                      "bold",
                  }}
                >
                  BORRAR
                </button>

              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}