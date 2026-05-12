import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Home() {

  // USER

  const [user, setUser] = useState(null);

  // LOGIN

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // POSTS

  const [posts, setPosts] = useState([]);

  const [text, setText] = useState("");

  const [image, setImage] = useState(null);

  useEffect(() => {

    fetchPosts();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

  }, []);

  // FETCH POSTS

  async function fetchPosts() {

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setPosts(data);
    }
  }

  // LOGIN

  const signUp = async () => {

    const { error } =
      await supabase.auth.signUp({

        email,
        password,

        options: {
          data: {
            nombre:
              email.split("@")[0],
          },
        },

      });

    if (error) {
      alert(error.message);
    } else {
      alert("Usuario registrado");
    }
  };

  const signIn = async () => {

    const { data, error } =
      await supabase.auth
        .signInWithPassword({

          email,
          password,

        });

    if (error) {

      alert(error.message);

    } else {

      setUser(data.user);

    }
  };

  const signOut = async () => {

    await supabase.auth.signOut();

    setUser(null);
  };

  // ADD POST

  const addPost = async () => {

    if (!user) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    if (
      !text.trim() &&
      !image
    ) return;

    let imageUrl = "";

    if (image) {

      const fileName =
        `${Date.now()}-${image.name}`;

      const { error } =
        await supabase.storage
          .from("posts")
          .upload(
            fileName,
            image
          );

      if (error) {

        alert(error.message);

        return;
      }

      imageUrl =
        `https://cqfxomvrkkaegtfkboun.supabase.co/storage/v1/object/public/posts/${fileName}`;
    }

    const { error } =
      await supabase
        .from("posts")
        .insert([
          {
            text,
            user_name:
              user.user_metadata
                ?.nombre ||
              user.email,
            user_id: user.id,
            image_url: imageUrl,
          },
        ]);

    if (error) {

      alert(error.message);

      return;
    }

    setText("");
    setImage(null);

    fetchPosts();
  };

  // DELETE POST

  const deletePost = async (
    id,
    imageUrl
  ) => {

    if (imageUrl) {

      const fileName =
        imageUrl.split(
          "/posts/"
        )[1];

      await supabase.storage
        .from("posts")
        .remove([fileName]);
    }

    await supabase
      .from("posts")
      .delete()
      .eq("id", id);

    fetchPosts();
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
          textAlign: "center",
          marginBottom: "30px",
        }}
      >

        <img
          src="/logo.jpeg"
          alt="logo"
          style={{
            width: "250px",
            marginBottom: "10px",
          }}
        />

        <h1
          style={{
            color: "#fe5d01",
          }}
        >
          CLUB FURIA
        </h1>

        <p
          style={{
            color: "#e7eb0f",
          }}
        >
          Comunidad social de armadores y tripulaciones
        </p>

      </div>

      {/* MENU */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >

        <Link
          to="/barcos"
          style={{
            flex: 1,
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >

            <h3
              style={{
                color: "#f20b2a",
              }}
            >
              ⛵ BARCOS
            </h3>

            <p
              style={{
                color: "#0261e6",
              }}
            >
              Registro de flota Furia
            </p>

          </div>

        </Link>

        <Link
          to="/tripulacion"
          style={{
            flex: 1,
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >

            <h3
              style={{
                color: "#f20b2a",
              }}
            >
              👥 TRIPULACION
            </h3>

            <p
              style={{
                color: "#0261e6",
              }}
            >
              Armadores y tripulantes
            </p>

          </div>

        </Link>

        <Link
          to="/actividades"
          style={{
            flex: 1,
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >

            <h3
              style={{
                color: "#f20b2a",
              }}
            >
              📅 ACTIVIDADES
            </h3>

            <p
              style={{
                color: "#0261e6",
              }}
            >
              Salidas y calendario
            </p>

          </div>

        </Link>

      </div>

      {/* NUEVOS MENUS */}

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >

        <Link
          to="/recursos"
          style={{
            flex: 1,
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >

            <h3
              style={{
                color: "#f20b2a",
              }}
            >
              📚 RECURSOS
            </h3>

            <p
              style={{
                color: "#0261e6",
              }}
            >
              Fichas, manuales y logos
            </p>

          </div>

        </Link>

        <Link
          to="/bricos"
          style={{
            flex: 1,
            textDecoration: "none",
          }}
        >

          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
            }}
          >

            <h3
              style={{
                color: "#f20b2a",
              }}
            >
              🔧 BRICOS
            </h3>

            <p
              style={{
                color: "#0261e6",
              }}
            >
              Reparaciones y mejoras
            </p>

          </div>

        </Link>

      </div>

      {/* LOGIN */}

      {!user ? (

        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >

          <h3>
            Acceso Armadores
          </h3>

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
              padding: "10px",
              marginBottom: "10px",
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
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >

            <button onClick={signIn}>
              Entrar
            </button>

            <button onClick={signUp}>
              Registrarse
            </button>

          </div>

        </div>

      ) : (

        <div
          style={{
            marginBottom: "20px",
            color: "white",
          }}
        >

          Conectado como:
          {" "}
          {user.user_metadata
            ?.nombre ||
            user.email}

          <button
            onClick={signOut}
            style={{
              marginLeft: "10px",
            }}
          >
            Salir
          </button>

        </div>

      )}

      {/* NUEVO POST */}

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Escribe una publicación..."
        style={{
          width: "100%",
          height: "100px",
          marginTop: "20px",
        }}
      />

      <label
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#720792",
          color: "white",
          border:
            "white solid 2px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >

        FOTO

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(
              e.target.files[0]
            )
          }
          style={{
            display: "none",
          }}
        />

      </label>

      <button
        onClick={addPost}
        style={{
          marginTop: "10px",
          marginLeft: "10px",
          padding: "10px 20px",
          backgroundColor: "#720792",
          color: "white",
          border:
            "white solid 2px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Publicar
      </button>

      {image && (

        <img
          src={URL.createObjectURL(image)}
          alt=""
          style={{
            width: "100%",
            marginTop: "10px",
            borderRadius: "10px",
          }}
        />

      )}

      {/* POSTS */}

      <div
        style={{
          marginTop: "30px",
        }}
      >

        {posts.map((post) => (

          <div
            key={post.id}
            style={{
              padding: "15px",
              border:
                "2px solid #ddd",
              marginBottom: "12px",
              backgroundColor:
                "#001b44",
            }}
          >

            <div
              style={{
                fontSize: "14px",
                color: "#ece806",
                marginBottom: "5px",
              }}
            >
              {post.user_name}
            </div>

            {user?.id ===
              post.user_id && (

              <button
                onClick={() =>
                  deletePost(
                    post.id,
                    post.image_url
                  )
                }
                style={{
                  marginTop: "10px",
                  backgroundColor:
                    "#aa2222",
                  color: "white",
                  border: "none",
                  padding:
                    "8px 14px",
                  borderRadius:
                    "8px",
                  cursor: "pointer",
                }}
              >
                Borrar
              </button>

            )}

            <div
              style={{
                color: "white",
                marginTop: "10px",
              }}
            >
              {post.text}
            </div>

            {post.image_url && (

              <img
                src={
                  post.image_url
                }
                alt=""
                style={{
                  width: "100%",
                  marginTop:
                    "10px",
                  borderRadius:
                    "10px",
                }}
              />

            )}

          </div>

        ))}

      </div>

    </div>

  );
}