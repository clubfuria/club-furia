import { useNavigate }
from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "../supabase";

export default function Home() {

  const navigate =
    useNavigate();

  /*
  ==========================================
  RESPONSIVE
  ==========================================
  */

  const isMobile =
    window.innerWidth < 768;

  /*
  ==========================================
  AUTH
  ==========================================
  */

  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

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

    async function iniciar() {

      const { data } =
        await supabase.auth.getSession();

      setSession(
        data.session
      );

      setLoading(false);

      if (data.session) {

        cargarNotificaciones();
      }

      cargarPosts();
    }

    iniciar();

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

    if (
      !email ||
      !password
    ) {

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

    if (
      !email ||
      !password
    ) {

      alert(
        "Introduce email y contraseña"
      );

      return;
    }

    if (
      password.length < 6
    ) {

      alert(
        "La contraseña debe tener mínimo 6 caracteres"
      );

      return;
    }

    if (
      !aceptaPrivacidad
    ) {

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
  LOGOUT
  ==========================================
  */

  async function logout() {

    await supabase.auth.signOut();

    setSession(null);

    localStorage.clear();

    window.location.href = "/";
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
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

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

    if (
      !nuevoPost.trim()
    ) {

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

  async function borrarPost(
    id
  ) {

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

    if (!session) return;

    const { data } =
      await supabase
        .from(
          "notificaciones"
        )
        .select("*")
        .eq(
          "user_id",
          session.user.id
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
NOTIFICACIONES
==========================================
*/

async function cargarNotificaciones() {

  const { data: authData } =
    await supabase.auth.getSession();

  const currentSession =
    authData.session;

  if (!currentSession)
    return;

  const { data, error } =
    await supabase
      .from(
        "notificaciones"
      )
      .select("*")
      .eq(
        "user_id",
        currentSession.user.id
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      );

  if (error) {

    console.log(error);

    return;
  }

  setNotifications(
    data || []
  );
}

async function borrarNotificacion(
  id
) {

  const confirmar =
    window.confirm(
      "¿Borrar notificación?"
    );

  if (!confirmar)
    return;

  const { error } =
    await supabase
      .from(
        "notificaciones"
      )
      .delete()
      .eq("id", id);

  if (error) {

    console.log(error);

    alert(error.message);

    return;
  }

  setNotifications(
    notifications.filter(
      (n) => n.id !== id
    )
  );
}

  /*
  ==========================================
  ESTILOS
  ==========================================
  */

  const TITLE_COLOR =
    "#fe5d01";

  const TEXT_COLOR =
    "#e0f406";

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

      image:
        "/buttons/boats.png",
    },

    {
      title:
        "TRIPULACIÓN",

      description:
        "Armadores y tripulantes",

      path:
        "/tripulacion",

      image:
        "/buttons/tripulacion.png",
    },

    {
      title:
        "ACTIVIDADES",

      description:
        "Regatas y navegación",

      path:
        "/actividades",

      image:
        "/buttons/actividades.png",
    },

    {
      title:
        "RECURSOS",

      description:
        "Documentación útil",

      path:
        "/recursos",

      image:
        "/buttons/recursos.png",
    },

    {
      title:
        "COMPRAVENTA",

      description:
        "Compra y venta",

      path:
        "/compraventa",

      image:
        "/buttons/compraventa.png",
    },

    {
      title:
        "BRICOS",

      description:
        "DIY y reparaciones",

      path:
        "/bricos",

      image:
        "/buttons/bricos.png",
    },
  ];

  if (loading) {

    return null;
  }

  return (

    <div
      style={{
        minHeight: "100vh",

        background:
          `linear-gradient(
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
          textAlign:
            "center",

          marginBottom:
            "40px",
        }}
      >

        <img
          src="/logo.jpeg"

          alt="Club Furia"

          style={{
            width:
              isMobile
                ? "240px"
                : "320px",
          }}
        />

        <h1
          style={{
            color:
              TITLE_COLOR,

            fontSize:
              isMobile
                ? "42px"
                : "64px",

            marginTop:
              "10px",
          }}
        >
          CLUB FURIA
        </h1>

      </div>

      {/* LOGIN */}

      {!session ? (

        <div
          style={{
            maxWidth:
              "400px",

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

              marginBottom:
                "12px",

              borderRadius:
                "10px",

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

              marginBottom:
                "12px",

              borderRadius:
                "10px",

              border: "none",
            }}
          />

          <button
            onClick={login}

            style={{
              width: "100%",

              padding: "14px",

              marginBottom:
                "10px",

              border: "none",

              borderRadius:
                "10px",

              background:
                TITLE_COLOR,

              color: "white",

              fontWeight:
                "bold",
            }}
          >
            ENTRAR
          </button>

          <div
            style={{
              marginBottom:
                "16px",

              color: "white",

              fontSize:
                "14px",

              background:
                "rgba(255,255,255,0.08)",

              padding: "14px",

              borderRadius:
                "12px",

              border:
                "1px solid rgba(255,255,255,0.15)",
            }}
          >

            <label
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: "12px",

                lineHeight:
                  1.5,

                cursor:
                  "pointer",
              }}
            >

              <input
                type="checkbox"

                checked={
                  aceptaPrivacidad
                }

                onChange={(e) =>
                  setAceptaPrivacidad(
                    e.target.checked
                  )
                }

                style={{
                  width: "22px",

                  height: "22px",

                  cursor:
                    "pointer",
                }}
              />

              <span>

                Acepto la{" "}

                <a
                  href="/privacidad"

                  target="_blank"

                  rel="noreferrer"

                  style={{
                    color:
                      "#e0f406",

                    fontWeight:
                      "bold",
                  }}
                >
                  política de privacidad
                </a>

              </span>

            </label>

          </div>

          <button
            onClick={
              registrarse
            }

            style={{
              width: "100%",

              padding: "14px",

              border: "none",

              borderRadius:
                "10px",

              background:
                "#720792",

              color: "white",

              fontWeight:
                "bold",
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

            borderRadius:
              "20px",

            padding: "20px",

            display: "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            gap: "12px",

            flexWrap:
              "wrap",

            marginBottom:
              "30px",
          }}
        >

          <div
            style={{
              color:
                "white",

              fontWeight:
                "bold",
            }}
          >
            Conectado:
            {" "}
            {
              session.user.email
            }
          </div>

          <button
            onClick={logout}

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

      {/* NOTIFICACIONES */}

      {session &&
        notifications.length > 0 && (

        <div
          style={{
            maxWidth:
              "900px",

            margin:
              "0 auto 30px auto",

            background:
              "rgba(255,255,255,0.08)",

            borderRadius:
              "20px",

            padding:
              "20px",
          }}
        >

          <h2
            style={{
              color:
                "#fe5d01",

              marginBottom:
                "16px",
            }}
          >
            🔔 NOTIFICACIONES
          </h2>

          {notifications.map(
            (n) => (

              <div
                key={n.id}

                style={{
                  background:
                    "rgba(255,255,255,0.06)",

                  padding:
                    "12px 16px",

                  borderRadius:
                    "12px",

                  marginBottom:
                    "10px",

                  color:
                    "white",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",

                    flexDirection:
                      isMobile
                        ? "column"
                        : "row",

                    justifyContent:
                      "space-between",

                    alignItems:
                      isMobile
                        ? "flex-start"
                        : "center",

                    gap: "12px",
                  }}
                >

                  <span>
                    {n.mensaje}
                  </span>

                  <div
                    style={{
                      display:
                        "flex",

                      gap:
                        "8px",

                      flexWrap:
                        "wrap",
                    }}
                  >

                    {n.from_user &&
                      n.actividad_id && (

                      <button
                        onClick={() =>
                          navigate(
                            `/chat/${n.actividad_id}/${n.from_user}`
                          )
                        }

                        style={{
                          background:
                            "#720792",

                          color:
                            "white",

                          border:
                            "none",

                          borderRadius:
                            "8px",

                          padding:
                            "8px 14px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "bold",
                        }}
                      >
                        💬 RESPONDER
                      </button>

                    )}

                    <button
                      onClick={() =>
                        borrarNotificacion(
                          n.id
                        )
                      }

                      style={{
                        background:
                          "#aa2222",

                        color:
                          "white",

                        border:
                          "none",

                        borderRadius:
                          "8px",

                        padding:
                          "8px 14px",

                        cursor:
                          "pointer",

                        fontWeight:
                          "bold",
                      }}
                    >
                      ✖ BORRAR
                    </button>

                  </div>

                </div>

              </div>

            )
          )}

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

          marginBottom:
            "50px",
        }}
      >

        {buttons.map(
          (button) => (

            <div
              key={
                button.title
              }

              onClick={(e) => {

                e.preventDefault();

                e.stopPropagation();

                if (!session) {

                  alert(
                    "Debes iniciar sesión"
                  );

                  return false;
                }

                navigate(
                  button.path
                );

              }}

              style={{
                background:
                  "rgba(255,255,255,0.08)",

                borderRadius:
                  "20px",

                overflow:
                  "hidden",

                border:
                  "1px solid rgba(255,255,255,0.12)",

                cursor:
                  session
                    ? "pointer"
                    : "not-allowed",

                opacity:
                  session
                    ? 1
                    : 0.45,
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
                  width:
                    "100%",

                  height:
                    "220px",

                  objectFit:
                    "cover",
                }}
              />

              <div
                style={{
                  padding:
                    "20px",
                }}
              >

                <h2
                  style={{
                    color:
                      TITLE_COLOR,
                  }}
                >
                  {
                    button.title
                  }
                </h2>

                <p
                  style={{
                    color:
                      "white",
                  }}
                >
                  {
                    button.description
                  }
                </p>

              </div>

            </div>

          )
        )}

      </div>

      {/* POSTS */}

      <div
        style={{
          maxWidth:
            "800px",

          margin:
            "0 auto",
        }}
      >

        <h2
          style={{
            color:
              TITLE_COLOR,

            marginBottom:
              "20px",
          }}
        >
          PUBLICACIONES
        </h2>

        {session && (

          <div
            style={{
              marginBottom:
                "30px",
            }}
          >

            <textarea
              value={
                nuevoPost
              }

              onChange={(e) =>
                setNuevoPost(
                  e.target.value
                )
              }

              placeholder="Escribe algo..."

              style={{
                width:
                  "100%",

                minHeight:
                  "120px",

                padding:
                  "14px",

                borderRadius:
                  "12px",

                border:
                  "none",

                marginBottom:
                  "10px",
              }}
            />

            <button
              onClick={
                publicarPost
              }

              style={{
                padding:
                  "14px 24px",

                border:
                  "none",

                borderRadius:
                  "12px",

                background:
                  TITLE_COLOR,

                color:
                  "white",

                fontWeight:
                  "bold",
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

              borderRadius:
                "16px",

              padding:
                "18px",

              marginBottom:
                "18px",

              color:
                "white",
            }}
          >

            <div
              style={{
                fontWeight:
                  "bold",

                marginBottom:
                  "10px",

                color:
                  TEXT_COLOR,
              }}
            >
              {
                post.usuario
                  ?.split("@")[0]
              }
            </div>

            <div>
              {post.texto}
            </div>

            {session?.user
              ?.email ===
              post.usuario && (

              <button
                onClick={() =>
                  borrarPost(
                    post.id
                  )
                }

                style={{
                  marginTop:
                    "14px",

                  padding:
                    "8px 14px",

                  border:
                    "none",

                  borderRadius:
                    "10px",

                  background:
                    "#aa0000",

                  color:
                    "white",
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