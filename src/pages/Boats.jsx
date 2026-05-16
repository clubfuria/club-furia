import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Boats() {

  const [user, setUser] = useState(null);

  const [boats, setBoats] = useState([]);

  const [boatSearch, setBoatSearch] =
    useState("");

  const [currentBoat, setCurrentBoat] =
    useState(0);

  const [boatName, setBoatName] =
    useState("");

  const [boatModel, setBoatModel] =
    useState("");

  const [boatPort, setBoatPort] =
    useState("");

  const [boatCrew, setBoatCrew] =
    useState("");

  const [boatContacto, setBoatContacto] =
    useState("");

  const [boatImage, setBoatImage] =
    useState(null);

  // EDITAR
  const [editingBoatId, setEditingBoatId] =
    useState(null);

  const isMobile =
    window.innerWidth < 768;

  useEffect(() => {

    fetchBoats();

    supabase.auth.getUser().then(
      ({ data }) => {
        setUser(data.user);
      }
    );

  }, []);

  /*
    ==========================================
    FETCH
    ==========================================
  */

  async function fetchBoats() {

    const { data, error } =
      await supabase
        .from("boats")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (!error && data) {
      setBoats(data);
    }
  }

  /*
    ==========================================
    ADD / EDIT BOAT
    ==========================================
  */

  const addBoat = async () => {

    if (!user) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    let imageUrl = "";

    // SUBIR FOTO

    if (boatImage) {

      const fileName =
        `${Date.now()}-${boatImage.name}`;

      const { error } =
        await supabase.storage
          .from("boats")
          .upload(
            fileName,
            boatImage
          );

      if (error) {

        alert(error.message);

        return;
      }

      imageUrl =
        `https://cqfxomvrkkaegtfkboun.supabase.co/storage/v1/object/public/boats/${fileName}`;
    }

    // EDITAR

    if (editingBoatId) {

      const updateData = {

        name: boatName,

        model: boatModel,

        port: boatPort,

        tripulacion: boatCrew,

        contacto: boatContacto,
      };

      // SOLO CAMBIA FOTO
      // SI HAY NUEVA

      if (imageUrl) {

        updateData.image_url =
          imageUrl;
      }

      const { error } =
        await supabase
          .from("boats")
          .update(updateData)
          .eq(
            "id",
            editingBoatId
          );

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Barco actualizado"
      );

      setEditingBoatId(null);

    } else {

      // NUEVO BARCO

      const { error } =
        await supabase
          .from("boats")
          .insert([
            {
              name: boatName,

              model: boatModel,

              port: boatPort,

              tripulacion: boatCrew,

              contacto: boatContacto,

              image_url: imageUrl,

              user_id: user.id,
            },
          ]);

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Barco añadido"
      );
    }

    // LIMPIAR

    setBoatName("");
    setBoatModel("");
    setBoatPort("");
    setBoatCrew("");
    setBoatContacto("");
    setBoatImage(null);

    fetchBoats();
  };

  /*
    ==========================================
    DELETE
    ==========================================
  */

  const deleteBoat = async (
    id,
    imageUrl
  ) => {

    if (imageUrl) {

      const fileName =
        imageUrl.split(
          "/boats/"
        )[1];

      await supabase.storage
        .from("boats")
        .remove([fileName]);
    }

    await supabase
      .from("boats")
      .delete()
      .eq("id", id);

    fetchBoats();

    if (
      currentBoat >=
      boats.length - 1
    ) {

      setCurrentBoat(0);
    }
  };

  /*
    ==========================================
    EDITAR
    ==========================================
  */

  const editBoat = (boat) => {

    setEditingBoatId(boat.id);

    setBoatName(
      boat.name || ""
    );

    setBoatModel(
      boat.model || ""
    );

    setBoatPort(
      boat.port || ""
    );

    setBoatCrew(
      boat.tripulacion || ""
    );

    setBoatContacto(
      boat.contacto || ""
    );
  };

  /*
    ==========================================
    FILTRO
    ==========================================
  */

 const normalizeText = (text) => {

  return text
    ?.toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    );
};

const filteredBoats =
  boats.filter((boat) => {

    const search =
      normalizeText(
        boatSearch
      );

    return (

      normalizeText(
        boat.name
      )?.includes(search)

      ||

      normalizeText(
        boat.model
      )?.includes(search)

      ||

      normalizeText(
        boat.port
      )?.includes(search)
    );
  });
  /*
    ==========================================
    NEXT
    ==========================================
  */

  const nextBoat = () => {

    if (
      currentBoat <
      filteredBoats.length - 1
    ) {

      setCurrentBoat(
        currentBoat + 1
      );

    } else {

      setCurrentBoat(0);
    }
  };

  /*
    ==========================================
    PREV
    ==========================================
  */

  const prevBoat = () => {

    if (currentBoat > 0) {

      setCurrentBoat(
        currentBoat - 1
      );

    } else {

      setCurrentBoat(
        filteredBoats.length - 1
      );
    }
  };

  return (

    <div
      style={{
        width: "100%",
        maxWidth: "900px",

        margin: "0 auto",

        padding: isMobile
          ? "16px"
          : "20px",

        boxSizing: "border-box",

        overflowX: "hidden",

        fontFamily: "Arial",

        backgroundColor: "#011135",

        minHeight: "100vh",

        paddingBottom: "100px",
      }}
    >

      {/* CABECERA */}

      <div
        className="no-print"
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: "24px",

          gap: "12px",

          flexWrap: "wrap",
        }}
      >

        <h1
          style={{
            color: "#fe5d01",

            fontSize: isMobile
              ? "34px"
              : "42px",

            margin: 0,
          }}
        >
          ⛵ FLOTA FURIA
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
        className="no-print"
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
          {
            editingBoatId
              ? "Editar barco"
              : "Registrar barco"
          }
        </h2>

        <input
          type="text"
          placeholder="Nombre del barco"
          value={boatName}
          onChange={(e) =>
            setBoatName(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Modelo"
          value={boatModel}
          onChange={(e) =>
            setBoatModel(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Puerto base"
          value={boatPort}
          onChange={(e) =>
            setBoatPort(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Tripulación"
          value={boatCrew}
          onChange={(e) =>
            setBoatCrew(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Contacto"
          value={boatContacto}
          onChange={(e) =>
            setBoatContacto(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        {/* FOTO */}

        <label
          style={{
            display:
              "inline-block",

            marginTop: "10px",

            padding:
              "10px 20px",

            backgroundColor:
              "#720792",

            color: "white",

            border:
              "white solid 2px",

            borderRadius: "8px",

            cursor: "pointer",

            marginBottom: "12px",
          }}
        >

          FOTO BARCO

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setBoatImage(
                e.target.files[0]
              )
            }
            style={{
              display: "none",
            }}
          />

        </label>

        <br />

        <button
          onClick={addBoat}
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
          {
            editingBoatId
              ? "Actualizar barco"
              : "Guardar barco"
          }
        </button>

      </div>

      {/* BUSCADOR */}

      <input
        className="no-print"
        type="text"
        placeholder="Buscar por puerto..."
        value={boatSearch}
        onChange={(e) => {

          setBoatSearch(
            e.target.value
          );

          setCurrentBoat(0);
        }}
        style={{
          width: "100%",

          padding: "12px",

          marginBottom: "20px",

          borderRadius: "8px",

          border: "none",

          boxSizing: "border-box",
        }}
      />

      {/* IMPRIMIR */}

      <button
        className="no-print"
        onClick={() =>
          window.print()
        }
        style={{
          marginBottom: "20px",

          padding: "10px 20px",

          backgroundColor:
            "#0d7a32",

          color: "white",

          border: "none",

          borderRadius: "8px",

          cursor: "pointer",
        }}
      >
        IMPRIMIR LISTADO
      </button>

      {/* CARRUSEL */}

      {filteredBoats.length > 0 ? (

        <div
          className="no-print"
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

          {filteredBoats[currentBoat]
            ?.image_url && (

            <img
              src={
                filteredBoats[
                  currentBoat
                ].image_url
              }
              alt=""
              style={{
                width: "100%",

                maxWidth: "100%",

                borderRadius:
                  "10px",

                marginBottom:
                  "10px",

                maxHeight:
                  "500px",

                objectFit:
                  "cover",
              }}
            />

          )}

          <h2
            style={{
              color: "#e7eb0f",

              fontSize: isMobile
                ? "28px"
                : "32px",
            }}
          >
            {
              filteredBoats[
                currentBoat
              ]?.name
            }
          </h2>

          <p
            style={{
              color: "white",

              fontSize: "18px",
            }}
          >
            ⛵ Modelo:
            {" "}
            {
              filteredBoats[
                currentBoat
              ]?.model
            }
          </p>

          <p
            style={{
              color: "white",

              fontSize: "18px",
            }}
          >
            📍 Puerto:
            {" "}
            {
              filteredBoats[
                currentBoat
              ]?.port
            }
          </p>

          <p
            style={{
              color: "white",

              fontSize: "18px",
            }}
          >
            👥 Tripulación:
            {" "}
            {
              filteredBoats[
                currentBoat
              ]?.tripulacion
            }
          </p>

          <p
            style={{
              color: "white",

              fontSize: "18px",

              wordBreak: "break-word",
            }}
          >
            📞 Contacto:
            {" "}
            {
              filteredBoats[
                currentBoat
              ]?.contacto
            }
          </p>

          {/* BOTONES */}

          {user?.id ===
            filteredBoats[
              currentBoat
            ]?.user_id && (

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >

              <button
                onClick={() =>
                  deleteBoat(
                    filteredBoats[
                      currentBoat
                    ].id,

                    filteredBoats[
                      currentBoat
                    ].image_url
                  )
                }
                style={{
                  backgroundColor:
                    "#aa2222",

                  color: "white",

                  border: "none",

                  padding:
                    "10px 20px",

                  borderRadius:
                    "8px",

                  cursor: "pointer",
                }}
              >
                Borrar barco
              </button>

              <button
                onClick={() =>
                  editBoat(
                    filteredBoats[
                      currentBoat
                    ]
                  )
                }
                style={{
                  backgroundColor:
                    "#0d7a32",

                  color: "white",

                  border: "none",

                  padding:
                    "10px 20px",

                  borderRadius:
                    "8px",

                  cursor: "pointer",
                }}
              >
                Editar barco
              </button>

            </div>

          )}

          {/* FLECHAS */}

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              marginTop: "30px",

              gap: "10px",
            }}
          >

            <button
              onClick={prevBoat}
              style={{
                flex: 1,

                padding:
                  "12px 20px",

                fontSize: isMobile
                  ? "15px"
                  : "18px",

                borderRadius:
                  "8px",

                border: "none",

                cursor: "pointer",
              }}
            >
              ← ANTERIOR
            </button>

            <button
              onClick={nextBoat}
              style={{
                flex: 1,

                padding:
                  "12px 20px",

                fontSize: isMobile
                  ? "15px"
                  : "18px",

                borderRadius:
                  "8px",

                border: "none",

                cursor: "pointer",
              }}
            >
              SIGUIENTE →
            </button>

          </div>

          <p
            style={{
              textAlign: "center",

              marginTop: "15px",

              color: "white",
            }}
          >
            {currentBoat + 1}
            {" / "}
            {filteredBoats.length}
          </p>

        </div>

      ) : (

        <div
          style={{
            color: "white",

            textAlign: "center",

            marginTop: "40px",
          }}
        >
          No hay barcos
        </div>

      )}

      {/* TABLA */}

      <div
        style={{
          backgroundColor: "white",

          padding: "20px",

          borderRadius: "12px",

          marginTop: "40px",

          overflowX: "auto",
        }}
      >

        <h2>
          LISTADO FLOTA FURIA
        </h2>

        <table
          style={{
            width: "100%",

            maxWidth: "100%",

            borderCollapse:
              "collapse",

            tableLayout:
              "fixed",

            wordWrap:
              "break-word",
          }}
        >

          <thead>

            <tr>

              <th>Nombre</th>

              <th>Modelo</th>

              <th>Puerto</th>

              <th>Tripulación</th>

              <th>Contacto</th>

            </tr>

          </thead>

          <tbody>

            {filteredBoats.map(
              (boat) => (

                <tr key={boat.id}>

                  <td>{boat.name}</td>

                  <td>{boat.model}</td>

                  <td>{boat.port}</td>

                  <td>
                    {boat.tripulacion}
                  </td>

                  <td>
                    {boat.contacto}
                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

      <BottomNav />

    </div>

  );
}