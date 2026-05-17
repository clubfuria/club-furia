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

  const [boatEmail, setBoatEmail] =
    useState("");

  const [boatTelefono, setBoatTelefono] =
    useState("");

  const [boatImage, setBoatImage] =
    useState(null);

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
  =========================================
  FETCH BOATS
  =========================================
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
  =========================================
  BUSCADOR SIN ACENTOS
  =========================================
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
  =========================================
  NEXT
  =========================================
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
  =========================================
  PREV
  =========================================
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

  /*
  =========================================
  ADD / EDIT BOAT
  =========================================
  */

  const addBoat = async () => {

    if (!user) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    let imageUrl = "";

    /*
    =======================================
    SUBIR FOTO
    =======================================
    */

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

    /*
    =======================================
    EDITAR
    =======================================
    */

    if (editingBoatId) {

      const updateData = {

        name: boatName,

        model: boatModel,

        port: boatPort,

        tripulacion: boatCrew,

        email: boatEmail,

        telefono:
          boatTelefono,
      };

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

      /*
      =====================================
      NUEVO
      =====================================
      */

      const { error } =
        await supabase
          .from("boats")
          .insert([
            {
              name: boatName,

              model: boatModel,

              port: boatPort,

              tripulacion: boatCrew,

              email: boatEmail,

              telefono:
                boatTelefono,

              image_url: imageUrl,

              user_id: user.id,
            },
          ]);

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Barco registrado"
      );
    }

    /*
    =======================================
    LIMPIAR
    =======================================
    */

    setBoatName("");

    setBoatModel("");

    setBoatPort("");

    setBoatCrew("");

    setBoatEmail("");

    setBoatTelefono("");

    setBoatImage(null);

    fetchBoats();
  };

  /*
  =========================================
  DELETE
  =========================================
  */

  const deleteBoat = async (
    id,
    imageUrl
  ) => {

    if (
      !window.confirm(
        "¿Borrar barco?"
      )
    ) {

      return;
    }

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

    setCurrentBoat(0);
  };

  /*
  =========================================
  EDIT
  =========================================
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

    setBoatEmail(
      boat.email || ""
    );

    setBoatTelefono(
      boat.telefono || ""
    );
  };

  return (

    <div
      style={{
        width: "100%",
        maxWidth: "950px",

        margin: "0 auto",

        padding: isMobile
          ? "16px"
          : "24px",

        boxSizing: "border-box",

        background:
          "linear-gradient(to bottom,#021224,#0c3157)",

        minHeight: "100vh",

        fontFamily:
          "Arial,sans-serif",

        paddingBottom: "100px",
      }}
    >

      {/* CABECERA */}

      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: "12px",

          marginBottom: "24px",
        }}
      >

        <h1
          style={{
            color: "#fe5d01",

            fontSize: isMobile
              ? "34px"
              : "46px",

            margin: 0,
          }}
        >
          ⛵ FLOTA FURIA
        </h1>

        <Link
          to="/"
          style={{
            backgroundColor:
              "#720792",

            color: "white",

            padding:
              "10px 20px",

            borderRadius: "10px",

            textDecoration:
              "none",

            fontWeight: "bold",
          }}
        >
          INICIO
        </Link>

      </div>

      {/* CARRUSEL */}

      {filteredBoats.length > 0 && (

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",

            borderRadius:
              "20px",

            padding: "20px",

            marginBottom: "30px",

            border:
              "1px solid rgba(255,255,255,0.15)",
          }}
        >

          {filteredBoats[
            currentBoat
          ]?.image_url && (

            <img
              src={
                filteredBoats[
                  currentBoat
                ].image_url
              }
              alt=""
              style={{
                width: "100%",

                maxHeight:
                  "520px",

                objectFit:
                  "cover",

                borderRadius:
                  "16px",

                marginBottom:
                  "20px",
              }}
            />

          )}

          <h2
            style={{
              color: "#fe5d01",

              fontSize: isMobile
                ? "28px"
                : "38px",
            }}
          >
            {
              filteredBoats[
                currentBoat
              ]?.name
            }
          </h2>

          <p style={{ color: "white" }}>
            ⛵ Modelo:
            {" "}
            {
              filteredBoats[
                currentBoat
              ]?.model
            }
          </p>

          <p style={{ color: "white" }}>
            📍 Puerto:
            {" "}
            {
              filteredBoats[
                currentBoat
              ]?.port
            }
          </p>

          <p style={{ color: "white" }}>
            👥 Tripulación:
            {" "}
            {
              filteredBoats[
                currentBoat
              ]?.tripulacion
            }
          </p>

          {filteredBoats[
            currentBoat
          ]?.telefono && (

            <p style={{ color: "white" }}>
              📞 Teléfono:
              {" "}
              {
                filteredBoats[
                  currentBoat
                ]?.telefono
              }
            </p>

          )}

          {filteredBoats[
            currentBoat
          ]?.email && (

            <p
              style={{
                color: "white",

                wordBreak:
                  "break-word",
              }}
            >
              ✉️ Email:
              {" "}
              {
                filteredBoats[
                  currentBoat
                ]?.email
              }
            </p>

          )}

          {/* BOTONES */}

          {user?.id ===
            filteredBoats[
              currentBoat
            ]?.user_id && (

            <div
              style={{
                display: "flex",

                gap: "10px",

                flexWrap: "wrap",

                marginTop: "20px",
              }}
            >

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
                    "10px",

                  cursor: "pointer",
                }}
              >
                EDITAR
              </button>

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
                    "10px",

                  cursor: "pointer",
                }}
              >
                BORRAR
              </button>

            </div>

          )}

          {/* FLECHAS */}

          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              gap: "12px",

              marginTop: "30px",
            }}
          >

            <button
              onClick={prevBoat}
              style={{
                flex: 1,

                padding:
                  "12px",

                borderRadius:
                  "10px",

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
                  "12px",

                borderRadius:
                  "10px",

                border: "none",

                cursor: "pointer",
              }}
            >
              SIGUIENTE →
            </button>

          </div>

          {/* NUMERO BARCO */}

          <p
            style={{
              color: "white",

              textAlign: "center",

              marginTop: "18px",

              fontWeight: "bold",
            }}
          >
            Barco
            {" "}
            {currentBoat + 1}
            {" "}
            de
            {" "}
            {filteredBoats.length}
          </p>

        </div>

      )}

      {/* BUSCADOR */}

      <input
        type="text"
        placeholder="Buscar barco, modelo o puerto..."
        value={boatSearch}
        onChange={(e) => {

          setBoatSearch(
            e.target.value
          );

          setCurrentBoat(0);
        }}
        style={{
          width: "100%",

          padding: "14px",

          borderRadius: "12px",

          border: "none",

          marginBottom: "20px",

          boxSizing:
            "border-box",
        }}
      />

      {/* FORMULARIO */}

      <div
        style={{
          background:
            "rgba(255,255,255,0.08)",

          borderRadius:
            "20px",

          padding: "24px",

          marginBottom: "30px",

          border:
            "1px solid rgba(255,255,255,0.15)",
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
          placeholder="Nombre barco"
          value={boatName}
          onChange={(e) =>
            setBoatName(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            boxSizing:
              "border-box",
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
            padding: "12px",
            marginBottom: "12px",
            boxSizing:
              "border-box",
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
            padding: "12px",
            marginBottom: "12px",
            boxSizing:
              "border-box",
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
            padding: "12px",
            marginBottom: "12px",
            boxSizing:
              "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Email"
          value={boatEmail}
          onChange={(e) =>
            setBoatEmail(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            boxSizing:
              "border-box",
          }}
        />

        <input
          type="text"
          placeholder="Teléfono"
          value={boatTelefono}
          onChange={(e) =>
            setBoatTelefono(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            boxSizing:
              "border-box",
          }}
        />

        <label
          style={{
            display:
              "inline-block",

            padding:
              "12px 20px",

            backgroundColor:
              "#720792",

            color: "white",

            borderRadius:
              "10px",

            cursor: "pointer",

            marginBottom:
              "16px",
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
            backgroundColor:
              "#720792",

            color: "white",

            border: "none",

            padding:
              "14px 24px",

            borderRadius:
              "10px",

            cursor: "pointer",

            fontWeight: "bold",
          }}
        >
          {
            editingBoatId
              ? "ACTUALIZAR BARCO"
              : "GUARDAR BARCO"
          }
        </button>

      </div>

      {/* IMPRIMIR */}

      <button
        onClick={() =>
          window.print()
        }
        style={{
          backgroundColor:
            "#0d7a32",

          color: "white",

          border: "none",

          padding:
            "12px 22px",

          borderRadius: "10px",

          marginBottom: "24px",

          cursor: "pointer",

          fontWeight: "bold",
        }}
      >
        IMPRIMIR LISTADO
      </button>

      {/* TABLA */}

      <div
        style={{
          backgroundColor:
            "white",

          borderRadius:
            "20px",

          padding: "20px",

          overflowX: "auto",
        }}
      >

        <h2>
          LISTADO FLOTA
        </h2>

        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",
          }}
        >

          <thead>

            <tr>

              <th>Nombre</th>

              <th>Modelo</th>

              <th>Puerto</th>

              <th>Tripulación</th>

              <th>Teléfono</th>

              <th>Email</th>

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
                    {boat.telefono}
                  </td>

                  <td>
                    {boat.email}
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