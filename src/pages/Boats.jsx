import BottomNav from "../components/BottomNav";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { obtenerOCrearConversacion } from "../utils/chatUtils";

export default function Boats() {

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

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

  const [boatEslora, setBoatEslora] =
    useState("");

  const [
    boatTipoNavegacion,
    setBoatTipoNavegacion,
  ] = useState("");

  const [
    boatElectronica,
    setBoatElectronica,
  ] = useState("");

  const [
    boatConfort,
    setBoatConfort,
  ] = useState("");

  const [
    boatSeguridad,
    setBoatSeguridad,
  ] = useState("");

  const [boatVelas, setBoatVelas] =
    useState("");

  const [boatMotor, setBoatMotor] =
    useState("");

  const [
    boatMejoras,
    setBoatMejoras,
  ] = useState("");

  const [
    boatDescripcion,
    setBoatDescripcion,
  ] = useState("");

  const [boatImage, setBoatImage] =
    useState(null);

  const [
    boatGallery,
    setBoatGallery,
  ] = useState([]);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState("");

  const [
    editingBoatId,
    setEditingBoatId,
  ] = useState(null);

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

  const nextBoat = () => {

    setSelectedImage("");

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

  const prevBoat = () => {

    setSelectedImage("");

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

  const addBoat = async () => {

    if (!user) {

      alert(
        "Debes iniciar sesión"
      );

      return;
    }

    let imageUrl = "";

    let galleryUrls = [];

    /*
    =======================================
    GALERÍA
    =======================================
    */

    if (
      boatGallery.length > 0
    ) {

      for (
        const file of boatGallery
      ) {

        const galleryFileName =
          `${Date.now()}-${file.name}`;

        const { error } =
          await supabase.storage
            .from("boats")
            .upload(
              galleryFileName,
              file
            );

        if (!error) {

          galleryUrls.push(
            `https://cqfxomvrkkaegtfkboun.supabase.co/storage/v1/object/public/boats/${galleryFileName}`
          );
        }
      }
    }

    /*
    =======================================
    FOTO PRINCIPAL
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

    const boatData = {

      name: boatName,

      model: boatModel,

      port: boatPort,

      tripulacion: boatCrew,

      email: boatEmail,

      telefono:
        boatTelefono,

      eslora:
        boatEslora,

      tipo_navegacion:
        boatTipoNavegacion,

      electronica:
        boatElectronica,

      confort:
        boatConfort,

      seguridad:
        boatSeguridad,

      velas:
        boatVelas,

      motor:
        boatMotor,

      mejoras:
        boatMejoras,

      descripcion:
        boatDescripcion,

      gallery_urls:
        galleryUrls,

      user_id: user.id,
    };

    if (imageUrl) {

      boatData.image_url =
        imageUrl;
    }

    /*
    =======================================
    EDITAR
    =======================================
    */

    if (editingBoatId) {

      const { error } =
        await supabase
          .from("boats")
          .update(boatData)
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

      /*
=====================================
NOTIFICAR BARCO ACTUALIZADO
=====================================
*/

const {
  data: profiles,
} =
  await supabase
    .from("profiles")
    .select("id");

if (profiles) {

  const notifications =

    profiles

      .filter(
        (p) =>
          p.id !== user.id
      )

      .map((p) => ({

        user_id: p.id,

        mensaje:
          `🔧 ${boatName} ha sido actualizado`,

      }));

  if (
    notifications.length > 0
  ) {

    await supabase
      .from(
        "notificaciones"
      )
      .insert(
        notifications
      );
  }
}

      setEditingBoatId(null);

    } else {

      /*
      =======================================
      NUEVO
      =======================================
      */

      const { error } =
        await supabase
          .from("boats")
          .insert([
            boatData,
          ]);

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Barco registrado"
      );

/*
=====================================
NOTIFICAR NUEVO BARCO
=====================================
*/

const {
  data: profiles,
} =
  await supabase
    .from("profiles")
    .select("id");

if (profiles) {

  const notifications =

    profiles

      .filter(
        (p) =>
          p.id !== user.id
      )

      .map((p) => ({

        user_id: p.id,

        mensaje:
          `⛵ Nuevo barco: ${boatName} en ${boatPort}`,

      }));

  if (
    notifications.length > 0
  ) {

    await supabase
      .from(
        "notificaciones"
      )
      .insert(
        notifications
      );
  }
}

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
    setBoatEslora("");
    setBoatTipoNavegacion("");
    setBoatElectronica("");
    setBoatConfort("");
    setBoatSeguridad("");
    setBoatVelas("");
    setBoatMotor("");
    setBoatMejoras("");
    setBoatDescripcion("");
    setBoatImage(null);
    setBoatGallery([]);

    fetchBoats();
  };

  const deleteBoat = async (
    id
  ) => {

    if (
      !window.confirm(
        "¿Borrar barco?"
      )
    ) {

      return;
    }

    await supabase
      .from("boats")
      .delete()
      .eq("id", id);

    fetchBoats();

    setCurrentBoat(0);
  };

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

    setBoatEslora(
      boat.eslora || ""
    );

    setBoatTipoNavegacion(
      boat.tipo_navegacion || ""
    );

    setBoatElectronica(
      boat.electronica || ""
    );

    setBoatConfort(
      boat.confort || ""
    );

    setBoatSeguridad(
      boat.seguridad || ""
    );

    setBoatVelas(
      boat.velas || ""
    );

    setBoatMotor(
      boat.motor || ""
    );

    setBoatMejoras(
      boat.mejoras || ""
    );

    setBoatDescripcion(
      boat.descripcion || ""
    );
  };

  const openChat = async (
    boat
  ) => {

    if (!user) {

      alert(
        "Inicia sesión"
      );

      return;
    }

    if (
      boat.user_id === user.id
    ) {

      return;
    }

    const conversacionId =
      await obtenerOCrearConversacion(
        user.id,
        boat.user_id
      );

    navigate(
      `/conversacion/${conversacionId}`
    );
  };

  return (

    <div
      style={{
        width: "100%",
        maxWidth: "950px",
        margin: "0 auto",
        padding:
          isMobile
            ? "16px"
            : "24px",
        boxSizing:
          "border-box",
        background:
          "linear-gradient(to bottom,#021224,#0c3157)",
        minHeight:
          "100vh",
        fontFamily:
          "Arial,sans-serif",
        paddingBottom:
          "100px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          flexWrap:
            "wrap",
          gap: "12px",
          marginBottom:
            "24px",
        }}
      >

        <h1
          style={{
            color:
              "#fe5d01",
            fontSize:
              isMobile
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
            borderRadius:
              "10px",
            textDecoration:
              "none",
            fontWeight:
              "bold",
          }}
        >
          INICIO
        </Link>

      </div>

      <input
        type="text"
        placeholder="Buscar barco"
        value={boatSearch}
        onChange={(e) =>
          setBoatSearch(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "12px",
          borderRadius:
            "10px",
          border: "none",
          marginBottom:
            "24px",
          boxSizing:
            "border-box",
        }}
      />

      {filteredBoats.length >
        0 && (

        <div
          style={{
            background:
              "rgba(255,255,255,0.08)",
            borderRadius:
              "20px",
            padding: "20px",
            marginBottom:
              "30px",
            border:
              "1px solid rgba(255,255,255,0.15)",
          }}
        >

          {filteredBoats[
            currentBoat
          ]?.image_url && (

            <>

              <img
                src={
                  selectedImage ||

                  filteredBoats[
                    currentBoat
                  ]?.image_url
                }

                alt=""

               style={{
  width: "100%",
  height: "520px",
  objectFit: "contain",
  backgroundColor: "#000",
  borderRadius: "16px",
  marginBottom: "20px",
}}
              />

              <div
                style={{
                  display:
                    "flex",
                  gap: "10px",
                  flexWrap:
                    "wrap",
                  marginBottom:
                    "20px",
                }}
              >

                <img
                  src={
                    filteredBoats[
                      currentBoat
                    ]?.image_url
                  }

                  alt=""

                  onClick={() =>
                    setSelectedImage(
                      ""
                    )
                  }

                  style={{
                    width:
                      "90px",
                    height:
                      "70px",
                    objectFit:
  "contain",
backgroundColor:
  "#000",
                    borderRadius:
                      "10px",
                    cursor:
                      "pointer",
                    border:
                      selectedImage ===
                      ""
                        ? "3px solid #fe5d01"
                        : "2px solid white",
                  }}
                />

                {filteredBoats[
                  currentBoat
                ]?.gallery_urls?.map(
                  (
                    img,
                    index
                  ) => (

                    <img
                      key={index}

                      src={img}

                      alt=""

                      onClick={() =>
                        setSelectedImage(
                          img
                        )
                      }

                      style={{
                        width:
                          "90px",
                        height:
                          "70px",
                        objectFit:
  "contain",
backgroundColor:
  "#000",
                        borderRadius:
                          "10px",
                        cursor:
                          "pointer",
                        border:
                          selectedImage ===
                          img
                            ? "3px solid #fe5d01"
                            : "2px solid white",
                      }}
                    />

                  )
                )}

              </div>

            </>

          )}

<div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  }}
>


  <div
  style={{
    display: "flex",
    justifyContent:
      "flex-end",
    marginBottom:
      "10px",
  }}
>

 
</div>

<h2
  style={{
    color:
      "#fe5d01",

    fontSize:
      isMobile
        ? "42px"
        : "54px",

    textAlign:
      "center",


 width: "100%",

    marginBottom:
      "20px",

    marginTop:
      "-40px",

    fontWeight:
      "bold",
  }}
>
  {
    filteredBoats[
      currentBoat
    ]?.name
  }
</h2>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    marginTop: "-5px",
  }}
>

  <button
    onClick={prevBoat}
    style={{
      padding: "12px 20px",
      border: "none",
      borderRadius: "12px",
      backgroundColor: "#2e05d1",
      color: "yellow",
      cursor: "pointer",
    }}
  >
    ← ANTERIOR
  </button>

  <div
    style={{
      color: "white",
      fontSize: "14px",
      opacity: 0.8,
    }}
  >
    Barco {currentBoat + 1} / {filteredBoats.length}
  </div>

  <button
    onClick={nextBoat}
    style={{
      padding: "12px 20px",
      border: "none",
      borderRadius: "12px",
      backgroundColor: "#2e05d1",
      color: "yellow",
      cursor: "pointer",
    }}
  >
    SIGUIENTE →
  </button>

</div>
</div>

          <p
            style={{
              color:
                "white",
            }}
          >
            ⛵ Modelo:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.model
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            📍 Puerto:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.port
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            👥 Tripulación:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.tripulacion
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            📏 Eslora:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.eslora
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            🌊 Navegación:{" "}
            {
              filteredBoats[
                currentBoat
              ]
                ?.tipo_navegacion
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            ⚡ Electrónica:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.electronica
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            🛏️ Confort:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.confort
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            🛟 Seguridad:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.seguridad
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            ⛵ Velas:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.velas
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            ⚙️ Motor:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.motor
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            🔧 Mejoras:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.mejoras
            }
          </p>

          <p
            style={{
              color:
                "white",
            }}
          >
            📝 Descripción:{" "}
            {
              filteredBoats[
                currentBoat
              ]?.descripcion
            }
          </p>



{/* BOTONES COMUNICACION */}

<div
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "20px",
  }}
>

  {user &&
    filteredBoats[currentBoat]?.user_id !== user.id && (

      <button
        onClick={() =>
          openChat(
            filteredBoats[currentBoat]
          )
        }
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "50%",
          backgroundColor: "#0d7a32",
          color: "white",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        💬
      </button>
  )}

  {filteredBoats[currentBoat]?.telefono && (

    <a
      href={`tel:${filteredBoats[currentBoat]?.telefono}`}
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "#0066cc",
        color: "white",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
      📞
    </a>
  )}

  {filteredBoats[currentBoat]?.email && (

    <a
      href={`mailto:${filteredBoats[currentBoat]?.email}`}
      style={{
        width: "52px",
        height: "52px",
        borderRadius: "50%",
        backgroundColor: "#fe5d01",
        color: "white",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "bold",
      }}
    >
      ✉️
    </a>
  )}

  {user &&
    filteredBoats[currentBoat]?.user_id === user.id && (

      <>
        <button
          onClick={() =>
            editBoat(
              filteredBoats[currentBoat]
            )
          }
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#f8fc05",
            color: "white",
            cursor: "pointer",
          }}
        >
          ✏️ EDITAR
        </button>

        <button
          onClick={() =>
            deleteBoat(
              filteredBoats[currentBoat].id
            )
          }
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "10px",
            backgroundColor: "#c70039",
            color: "white",
            cursor: "pointer",
          }}
        >
          🗑️ BORRAR
        </button>
      </>
  )}

</div>

        </div>

      )}

      <div
        style={{
          background:
            "rgba(255,255,255,0.08)",
          borderRadius:
            "20px",
          padding: "20px",
          marginBottom:
            "40px",
        }}
      >

        <h2
          style={{
            color:
              "white",
          }}
        >
          {editingBoatId
            ? "Editar barco"
            : "Añadir barco"}
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          value={boatName}
          onChange={(e) =>
            setBoatName(
              e.target.value
            )
          }
          style={inputStyle}
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
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Puerto"
          value={boatPort}
          onChange={(e) =>
            setBoatPort(
              e.target.value
            )
          }
          style={inputStyle}
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
          style={inputStyle}
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
          style={inputStyle}
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
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Eslora"
          value={boatEslora}
          onChange={(e) =>
            setBoatEslora(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Tipo navegación"
          value={
            boatTipoNavegacion
          }
          onChange={(e) =>
            setBoatTipoNavegacion(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <textarea
          placeholder="Electrónica"
          value={boatElectronica}
          onChange={(e) =>
            setBoatElectronica(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <textarea
          placeholder="Confort"
          value={boatConfort}
          onChange={(e) =>
            setBoatConfort(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <textarea
          placeholder="Seguridad"
          value={boatSeguridad}
          onChange={(e) =>
            setBoatSeguridad(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <textarea
          placeholder="Velas"
          value={boatVelas}
          onChange={(e) =>
            setBoatVelas(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <textarea
          placeholder="Motor"
          value={boatMotor}
          onChange={(e) =>
            setBoatMotor(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <textarea
          placeholder="Mejoras"
          value={boatMejoras}
          onChange={(e) =>
            setBoatMejoras(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <textarea
          placeholder="Descripción"
          value={boatDescripcion}
          onChange={(e) =>
            setBoatDescripcion(
              e.target.value
            )
          }
          style={textareaStyle}
        />

        <label
          style={
            uploadButtonStyle
          }
        >
          FOTO PRINCIPAL

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setBoatImage(
                e.target.files[0]
              )
            }
            style={{
              display:
                "none",
            }}
          />

        </label>

        <label
          style={{
            ...uploadButtonStyle,
            marginLeft:
              "10px",
          }}
        >
          GALERÍA

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setBoatGallery(
                Array.from(
                  e.target.files
                ).slice(0, 4)
              )
            }
            style={{
              display:
                "none",
            }}
          />

        </label>

        <div
          style={{
            marginTop:
              "20px",
          }}
        >

          <button
            onClick={addBoat}
            style={{
              padding:
                "14px 22px",
              border:
                "none",
              borderRadius:
                "12px",
              backgroundColor:
                "#fe5d01",
              color:
                "white",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >
            {editingBoatId
              ? "GUARDAR CAMBIOS"
              : "AÑADIR BARCO"}
          </button>

        </div>

      </div>

      <BottomNav />

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "none",
  boxSizing: "border-box",
};

const textareaStyle = {
  width: "100%",
  height: "90px",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "none",
  boxSizing: "border-box",
};

const uploadButtonStyle = {
  display: "inline-block",
  padding: "12px 20px",
  backgroundColor:
    "#0d7a32",
  color: "white",
  borderRadius: "10px",
  cursor: "pointer",
  marginBottom: "16px",
};