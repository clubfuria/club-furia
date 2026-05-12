import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function App() {

  // POSTS
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  // BARCOS
  const [boats, setBoats] = useState([]);
  const [showBoats, setShowBoats] = useState(false);

  const [boatSearch, setBoatSearch] = useState("");

  const [boatName, setBoatName] = useState("");
  const [boatModel, setBoatModel] = useState("");
  const [boatPort, setBoatPort] = useState("");
  const [boatCrew, setBoatCrew] = useState("");
  const [boatImage, setBoatImage] = useState(null);

  // SALIDAS
  const [showSalidas, setShowSalidas] = useState(false);

  const [salidas, setSalidas] = useState([]);

  const [salidaTitulo, setSalidaTitulo] = useState("");
  const [salidaPuerto, setSalidaPuerto] = useState("");
  const [salidaFecha, setSalidaFecha] = useState("");
  const [salidaPlazas, setSalidaPlazas] = useState("");
  const [salidaDescripcion, setSalidaDescripcion] = useState("");



  // TRIPULANTES
  const [tripulantes, setTripulantes] = useState([]);
 
  // PROFILE
const [showProfile, setShowProfile] = useState(false);
  const [profileNombre, setProfileNombre] = useState("");
  const [profilePuerto, setProfilePuerto] = useState("");
  const [profileExperiencia, setProfileExperiencia] = useState("");
  const [profileDisponibilidad, setProfileDisponibilidad] = useState("");
  const [profileDescripcion, setProfileDescripcion] = useState("");

  // LOGIN
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {

    fetchPosts();
    fetchBoats();
    fetchSalidas();
    fetchTripulantes();
    fetchProfile();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

  }, []);

  // POSTS

  async function fetchPosts() {

    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setPosts(data);
    }
  }

  // BARCOS

  async function fetchBoats() {

    const { data } = await supabase
      .from("boats")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setBoats(data);
    }
  }

  // SALIDAS

  async function fetchSalidas() {

    const { data } = await supabase
      .from("salidas")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setSalidas(data);
    }
  }

  // TRIPULANTES

  async function fetchTripulantes() {

    const { data } = await supabase
      .from("salida_tripulantes")
      .select("*");

    if (data) {
      setTripulantes(data);
    }
  }
async function fetchProfile() {

  const currentUser = await supabase.auth.getUser();

  if (!currentUser.data.user) return;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", currentUser.data.user.id)
    .single();

  if (data) {
    setProfileNombre(data.nombre || "");
    setProfilePuerto(data.puerto || "");
    setProfileExperiencia(data.experiencia || "");
    setProfileDisponibilidad(data.disponibilidad || "");
    setProfileDescripcion(data.descripcion || "");
  }
}
  // LOGIN
const saveProfile = async () => {

  await supabase
    .from("profiles")
    .upsert([
      {
        id: user.id,
        nombre: profileNombre,
        puerto: profilePuerto,
        experiencia: profileExperiencia,
        disponibilidad: profileDisponibilidad,
        descripcion: profileDescripcion,
      },
    ]);

  alert("Perfil guardado");
};

  const signUp = async () => {

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre: email.split("@")[0],
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
      await supabase.auth.signInWithPassword({
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

  // CREAR POST

  const addPost = async () => {

    if (!text.trim() && !image) return;

    let imageUrl = "";

    if (image) {

      const fileName =
        Date.now() + "-" + image.name;

      await supabase.storage
        .from("posts")
        .upload(fileName, image);

      imageUrl =
        `https://cqfxomvrkkaegtfkboun.supabase.co/storage/v1/object/public/posts/${fileName}`;
    }

    await supabase
      .from("posts")
      .insert([
        {
          text: text,
          user_name:
            user.user_metadata?.nombre ||
            user.email,
          user_id: user.id,
          image_url: imageUrl,
        },
      ]);

    setText("");
    setImage(null);

    fetchPosts();
  };

  // BORRAR POST

  const deletePost = async (
    id,
    imageUrl
  ) => {

    if (imageUrl) {

      const fileName =
        imageUrl.split("/posts/")[1];

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
   // CREAR BARCO

  const addBoat = async () => {

    let imageUrl = "";

    if (boatImage) {

      const fileName =
        Date.now() + "-" + boatImage.name;

      await supabase.storage
        .from("boats")
        .upload(fileName, boatImage);

      imageUrl =
        `https://cqfxomvrkkaegtfkboun.supabase.co/storage/v1/object/public/boats/${fileName}`;
    }

    await supabase
      .from("boats")
      .insert([
        {
          name: boatName,
          model: boatModel,
          port: boatPort,
          tripulacion: boatCrew,
          image_url: imageUrl,
          user_id: user.id,
        },
      ]);

    setBoatName("");
    setBoatModel("");
    setBoatPort("");
    setBoatCrew("");
    setBoatImage(null);

    fetchBoats();
  };

  // BORRAR BARCO

  const deleteBoat = async (
    id,
    imageUrl
  ) => {

    if (imageUrl) {

      const fileName =
        imageUrl.split("/boats/")[1];

      await supabase.storage
        .from("boats")
        .remove([fileName]);
    }

    await supabase
      .from("boats")
      .delete()
      .eq("id", id);

    fetchBoats();
  };

  // CREAR SALIDA

  const addSalida = async () => {

    await supabase
      .from("salidas")
      .insert([
        {
          titulo: salidaTitulo,
          puerto: salidaPuerto,
          fecha: salidaFecha,
          plazas: salidaPlazas,
          descripcion: salidaDescripcion,
          user_id: user.id,
        },
      ]);

    setSalidaTitulo("");
    setSalidaPuerto("");
    setSalidaFecha("");
    setSalidaPlazas("");
    setSalidaDescripcion("");

    fetchSalidas();
  };

  // APUNTARSE A SALIDA

  const apuntarseSalida = async (
    salidaId
  ) => {

    await supabase
      .from("salida_tripulantes")
      .insert([
        {
          salida_id: salidaId,
          user_id: user.id,
          user_name:
            user.user_metadata?.nombre ||
            user.email,
        },
      ]);

    fetchTripulantes();

    alert("Te has apuntado a la salida");
  };

  // RETURN

  return (

    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
        backgroundColor: "#011135",
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

        {/* BARCOS */}

        <div
          onClick={() =>
            setShowBoats(!showBoats)
          }
          style={{
            flex: 1,
            minWidth: "180px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            cursor: "pointer",
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

        {/* TRIPULACION */}

        <div
  onClick={() => setShowProfile(!showProfile)}
  style={{
    flex: 1,
    minWidth: "180px",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    cursor: "pointer",
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

        {/* ACTIVIDADES */}

        <div
          onClick={() =>
            setShowSalidas(!showSalidas)
          }
          style={{
            flex: 1,
            minWidth: "180px",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "12px",
            cursor: "pointer",
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
              setEmail(e.target.value)
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
              setPassword(e.target.value)
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
          {user.user_metadata?.nombre ||
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
          border: "white solid 2px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >

        FOTO

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setImage(e.target.files[0])
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
          border: "white solid 2px",
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

      {/* FORMULARIO BARCOS */}

      {showBoats && (

        <div
          style={{
            backgroundColor: "#001b44",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              color: "white",
            }}
          >
            Registro de barcos
          </h2>

          <input
            type="text"
            placeholder="Nombre del barco"
            value={boatName}
            onChange={(e) =>
              setBoatName(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Modelo"
            value={boatModel}
            onChange={(e) =>
              setBoatModel(e.target.value)
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
            value={boatPort}
            onChange={(e) =>
              setBoatPort(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Tripulación"
            value={boatCrew}
            onChange={(e) =>
              setBoatCrew(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <label
            style={{
              display: "inline-block",
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#720792",
              color: "white",
              border: "white solid 2px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >

            FOTO BARCO

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setBoatImage(e.target.files[0])
              }
              style={{
                display: "none",
              }}
            />

          </label>

          <button
            onClick={addBoat}
            style={{
              marginLeft: "10px",
              padding: "10px 20px",
              backgroundColor: "#720792",
              color: "white",
              border: "white solid 2px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Guardar barco
          </button>

          <div
            style={{
              marginTop: "30px",
            }}
          >

            <input
              type="text"
              placeholder="Buscar por puerto o zona..."
              value={boatSearch}
              onChange={(e) =>
                setBoatSearch(e.target.value)
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "none",
              }}
            />

          </div>

        </div>

      )}
       {/* LISTA BARCOS */}

      {showBoats && (

  <div>

    {boats
      .filter((boat) =>
        boat.port
          ?.toLowerCase()
          .includes(
            boatSearch.toLowerCase()
          )
      )
      .map((boat) => (

        <div
          key={boat.id}
          style={{
            backgroundColor: "#001b44",
            border: "2px solid #ddd",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          {boat.image_url && (

            <img
              src={boat.image_url}
              alt=""
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />

          )}

          <h2
            style={{
              color: "#e7eb0f",
            }}
          >
            {boat.name}
          </h2>

          {user?.id === boat.user_id && (

            <button
              onClick={() =>
                deleteBoat(
                  boat.id,
                  boat.image_url
                )
              }
              style={{
                marginBottom: "10px",
                backgroundColor: "#aa2222",
                color: "white",
                border: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Borrar barco
            </button>

          )}

          <p style={{ color: "white" }}>
            Modelo: {boat.model}
          </p>

          <p style={{ color: "white" }}>
            Puerto: {boat.port}
          </p>

          <p style={{ color: "white" }}>
            Tripulación: {boat.tripulacion}
          </p>

        </div>

      ))}

  </div>

)}

{showProfile && (
  <div
    style={{
      backgroundColor: "#001b44",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "30px",
      marginBottom: "30px",
    }}
  >
    <h2 style={{ color: "white" }}>
      Perfil tripulación
    </h2>

    <input
      type="text"
      placeholder="Nombre"
      value={profileNombre}
      onChange={(e) => setProfileNombre(e.target.value)}
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
      onChange={(e) => setProfilePuerto(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
      }}
    />

    <input
      type="text"
      placeholder="Experiencia"
      value={profileExperiencia}
      onChange={(e) => setProfileExperiencia(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
      }}
    />

    <input
      type="text"
      placeholder="Disponibilidad"
      value={profileDisponibilidad}
      onChange={(e) => setProfileDisponibilidad(e.target.value)}
      style={{
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
      }}
    />

    <textarea
      placeholder="Descripción"
      value={profileDescripcion}
      onChange={(e) => setProfileDescripcion(e.target.value)}
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
        padding: "10px 20px",
        backgroundColor: "#720792",
        color: "white",
        border: "white solid 2px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      Guardar perfil
    </button>
  </div>
)}
      {/* SALIDAS */}

      {showSalidas && (

        <div
          style={{
            backgroundColor: "#001b44",
            padding: "20px",
            borderRadius: "12px",
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >

          <h2
            style={{
              color: "white",
            }}
          >
            Salidas y actividades
          </h2>

          <input
            type="text"
            placeholder="Título de la salida"
            value={salidaTitulo}
            onChange={(e) =>
              setSalidaTitulo(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Puerto de salida"
            value={salidaPuerto}
            onChange={(e) =>
              setSalidaPuerto(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Fecha"
            value={salidaFecha}
            onChange={(e) =>
              setSalidaFecha(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <input
            type="text"
            placeholder="Plazas disponibles"
            value={salidaPlazas}
            onChange={(e) =>
              setSalidaPlazas(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "10px",
            }}
          />

          <textarea
            placeholder="Descripción"
            value={salidaDescripcion}
            onChange={(e) =>
              setSalidaDescripcion(
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
            onClick={addSalida}
            style={{
              padding: "10px 20px",
              backgroundColor: "#720792",
              color: "white",
              border: "white solid 2px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Crear salida
          </button>

          <div
            style={{
              marginTop: "30px",
            }}
          >

            {salidas.map((salida) => (

              <div
                key={salida.id}
                style={{
                  backgroundColor: "#02235c",
                  padding: "15px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                }}
              >

                <h3
                  style={{
                    color: "#e7eb0f",
                  }}
                >
                  {salida.titulo}
                </h3>

                <p style={{ color: "white" }}>
                  📍 {salida.puerto}
                </p>

                <p style={{ color: "white" }}>
                  📅 {salida.fecha}
                </p>

                <p style={{ color: "white" }}>
                  👥 Plazas:
                  {" "}
                  {salida.plazas}
                </p>

                <p style={{ color: "white" }}>
                  {salida.descripcion}
                </p>

                <button
                  onClick={() =>
                    apuntarseSalida(
                      salida.id
                    )
                  }
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#0d7a32",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Apuntarme
                </button>

                <div
                  style={{
                    marginTop: "15px",
                  }}
                >

                  <p
                    style={{
                      color: "#e7eb0f",
                    }}
                  >
                    Tripulación apuntada:
                  </p>

                  {tripulantes
                    .filter(
                      (t) =>
                        t.salida_id ===
                        salida.id
                    )
                    .map((t) => (

                      <p
                        key={t.id}
                        style={{
                          color: "white",
                          marginLeft: "10px",
                        }}
                      >
                        • {t.user_name}
                      </p>

                    ))}

                </div>

              </div>

            ))}

          </div>

        </div>

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
              border: "2px solid #ddd",
              marginBottom: "12px",
              backgroundColor: "#001b44",
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

            {user?.id === post.user_id && (

              <button
                onClick={() =>
                  deletePost(
                    post.id,
                    post.image_url
                  )
                }
                style={{
                  marginTop: "10px",
                  backgroundColor: "#aa2222",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "8px",
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
                src={post.image_url}
                alt=""
                style={{
                  width: "100%",
                  marginTop: "10px",
                  borderRadius: "10px",
                }}
              />

            )}

          </div>

        ))}

      </div>

    </div>

  );
}  