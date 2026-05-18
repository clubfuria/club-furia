import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function Home() {

  const navigate = useNavigate();

  const isMobile =
    window.innerWidth < 768;

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

  const [
    aceptaPrivacidad,
    setAceptaPrivacidad,
  ] = useState(false);

  /*
    ==========================================
    POSTS
    ==========================================
  */

  const [posts, setPosts] =
    useState([]);

  const [nuevoPost, setNuevoPost] =
    useState("");

  /*
    ==========================================
    NOTIFICACIONES
    ==========================================
  */

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  useEffect(() => {

    supabase.auth
      .getSession()
      .then(({ data }) => {

        setSession(
          data.session
        );

        if (data.session) {
          cargarNotificaciones();
        }
      });

    cargarPosts();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          setSession(session);

          if (session) {
            cargarNotificaciones();
          } else {
            setNotifications([]);
          }
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

    if (!aceptaPrivacidad) {

      alert(
        "Debes aceptar la política de privacidad"
      );

      return;
    }

    const { error } =
      await supabase.auth.signUp({

        email,

        password,
      });

    if (error) {

      alert(error.message);

      return;
    }

    alert(
      "Cuenta creada correctamente"
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
    NOTIFICACIONES
    ==========================================
  */

  async function cargarNotificaciones() {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) return;

    const { data } =
      await supabase
        .from("notificaciones")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (data) {
      setNotifications(data);
    }
  }

  /*
    ==========================================
    ESTILOS
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

  /*
    ==========================================
    BOTONES
    ==========================================
  */

  const buttons = [
    {
      title: "BARCOS",
      description:
        "Modelos, fichas y fotos",
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
        "Regatas y navegación",
      path: "/actividades",
      image:
        "/buttons/actividades.png",
    },

    {
      title: "RECURSOS",
      description:
        "Documentación útil",
      path: "/recursos",
      image:
        "/buttons/recursos.png",
    },

    {
      title: "COMPRAVENTA",
      description:
        "Compra y venta",
      path: "/compraventa",
      image:
        "/buttons/compraventa.png",
    },

    {
      title: "BRICOS",
      description:
        "DIY y reparaciones",
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
          ${BACKGROUND_TOP},
          ${BACKGROUND_MIDDLE},
          ${BACKGROUND_BOTTOM}
        )`,

        padding: "20px",

        fontFamily:
          "Arial, sans-serif",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >

        <img
          src="/logo.jpeg"
          alt="Club Furia"
          style={{
            width: isMobile
              ? "240px"
              : "320px",
          }}
        />

        <h1
          style={{
            color: TITLE_COLOR,
            fontSize:
              isMobile
                ? "42px"
                : "64px",
            marginTop: "10px",
          }}
        >
          CLUB FURIA
        </h1>

      </div>

      {/* LOGIN */}

      {!session ? (

        <div
          style={{
            maxWidth: "400px",
            margin:
              "0 auto 40px auto",
          }}
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "12px",
              borderRadius: "10px",
              border: "none",
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
              marginBottom: "12px",
              borderRadius: "10px",
              border: "none",
            }}
          />

          <button
            onClick={login}
            style={{
              width: "100%",
              padding: "14px",
              marginBottom: "10px",
              border: "none",
              borderRadius: "10px",
              background: TITLE_COLOR,
              color: "white",
              fontWeight: "bold",
            }}
          >
            ENTRAR
          </button>

          <button
            onClick={registrarse}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#720792",
              color: "white",
              fontWeight: "bold",
            }}
          >
            REGISTRARSE
          </button>

        </div>

      ) : (

        <div
          style={{
            textAlign: "center",
            color: "white",
            marginBottom: "30px",
          }}
        >
          Conectado:
          {" "}
          {session.user.email}
        </div>

      )}

      {/* BOTONES */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            isMobile
              ? "1fr"
              : "1fr 1fr",

          gap: "20px",

          marginBottom: "50px",
        }}
      >

        {buttons.map((button) => (

          <div
            key={button.title}

            onClick={() =>
              navigate(button.path)
            }

            style={{
              background:
                "rgba(255,255,255,0.08)",

              borderRadius: "20px",

              overflow: "hidden",

              cursor: "pointer",

              border:
                "1px solid rgba(255,255,255,0.12)",
            }}
          >

            <img
              src={button.image}
              alt={button.title}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />

            <div
              style={{
                padding: "20px",
              }}
            >

              <h2
                style={{
                  color: TITLE_COLOR,
                  marginBottom: "10px",
                }}
              >
                {button.title}
              </h2>

              <p
                style={{
                  color: "white",
                  margin: 0,
                }}
              >
                {button.description}
              </p>

            </div>

          </div>

        ))}

      </div>

      {/* POSTS */}

      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >

        <h2
          style={{
            color: TITLE_COLOR,
            marginBottom: "20px",
          }}
        >
          PUBLICACIONES
        </h2>

        {session && (

          <div
            style={{
              marginBottom: "30px",
            }}
          >

            <textarea
              value={nuevoPost}
              onChange={(e) =>
                setNuevoPost(
                  e.target.value
                )
              }
              placeholder="Escribe algo..."
              style={{
                width: "100%",
                minHeight: "120px",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                marginBottom: "10px",
              }}
            />

            <button
              onClick={publicarPost}
              style={{
                padding: "14px 24px",
                border: "none",
                borderRadius: "12px",
                background: TITLE_COLOR,
                color: "white",
                fontWeight: "bold",
              }}
            >
              PUBLICAR
            </button>

          </div>

        )}

        {posts.map((post) => (

          <div
            key={post.id}

            style={{
              background:
                "rgba(255,255,255,0.08)",

              borderRadius: "16px",

              padding: "18px",

              marginBottom: "18px",

              color: "white",
            }}
          >

            <div
              style={{
                fontWeight: "bold",
                marginBottom: "11px",
                color: TEXT_COLOR,
              }}
            >
              {post.usuario?.split("@")[0]}
            </div>

            <div>
              {post.texto}
            </div>

            {session?.user?.email ===
              post.usuario && (

              <button
                onClick={() =>
                  borrarPost(post.id)
                }
                style={{
                  marginTop: "14px",
                  padding:
                    "8px 14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#aa0000",
                  color: "white",
                }}
              >
                ELIMINAR
              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}