import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  /*
    ==========================================
    PERSONALIZACIÓN RÁPIDA
    Cambia aquí colores y tamaños
    ==========================================
  */

  // COLORES
  const TITLE_COLOR = "#fe5d01";
  const TEXT_COLOR = "#eff306";
  const BACKGROUND_TOP = "#021224";
  const BACKGROUND_MIDDLE = "#08203b";
  const BACKGROUND_BOTTOM = "#0c3157";

  // TAMAÑOS
  const HEADER_TITLE_SIZE = "64px";
  const HEADER_SUBTITLE_SIZE = "20px";

  const BUTTON_TITLE_SIZE = "36px";
  const BUTTON_DESCRIPTION_SIZE = "18px";

  // LOGO
  const LOGO_WIDTH = "280px";

  /*
    ==========================================
    BOTONES
    ==========================================
  */

  const buttons = [
    {
      title: "BOATS",
      description: "Modelos, fichas y fotos de la flota Furia",
      path: "/boats",
      image: "/buttons/boats.png",
    },

    {
      title: "TRIPULACIÓN",
      description: "Armadores y tripulantes",
      path: "/tripulacion",
      image: "/buttons/tripulacion.png",
    },

    {
      title: "ACTIVIDADES",
      description: "Regatas, encuentros y navegación",
      path: "/actividades",
      image: "/buttons/actividades.png",
    },

    {
      title: "RECURSOS",
      description: "Manuales, documentación y enlaces útiles",
      path: "/recursos",
      image: "/buttons/recursos.png",
    },

    {
      title: "BRICOS",
      description: "Mejoras, reparaciones y proyectos DIY",
      path: "/bricos",
      image: "/buttons/bricos.png",
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
        padding: "25px 20px 50px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ==========================================
          CABECERA
      ========================================== */}

      <div
        style={{
          textAlign: "center",
          marginBottom: "45px",
        }}
      >
        <img
          src="/logo.jpeg"
          alt="Club Furia"
          style={{
            width: LOGO_WIDTH,
            marginBottom: "18px",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))",
          }}
        />

        <h1
          style={{
            color: TITLE_COLOR,
            fontSize: HEADER_TITLE_SIZE,
            fontWeight: "bold",
            margin: 0,
            letterSpacing: "4px",
            lineHeight: "1.2",
            marginBottom: "22px",
            textShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          CLUB FURIA
        </h1>

        <p
          style={{
            color: TEXT_COLOR,
            fontSize: HEADER_SUBTITLE_SIZE,
            opacity: 0.95,
            margin: 0,
            lineHeight: "1.8",
            letterSpacing: "0.5px",
          }}
        >
          Comunidad de armadores y amantes de los veleros Furia
        </p>
      </div>

      {/* ==========================================
          LOGIN
      ========================================== */}

      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto 40px auto",
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "14px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: "rgba(255,255,255,0.92)",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="Contraseña"
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "18px",
            borderRadius: "12px",
            border: "none",
            outline: "none",
            fontSize: "16px",
            background: "rgba(255,255,255,0.92)",
            boxSizing: "border-box",
          }}
        />

        <button
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "14px",
            border: "none",
            background: TITLE_COLOR,
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.25s",
          }}
        >
          ENTRAR
        </button>
      </div>

      {/* ==========================================
          BOTONES
      ========================================== */}

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {buttons.map((button, index) => (
          <div
            key={index}
            onClick={() => navigate(button.path)}
            style={{
              position: "relative",
              height: "190px",
              borderRadius: "24px",
              overflow: "hidden",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.25)",
              background:
                "linear-gradient(to right, #08203b 0%, #06192d 60%, #03101d 100%)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.01)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {/* ==========================================
                IMAGEN
            ========================================== */}

            <div
              style={{
                width: "42%",
                height: "100%",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={button.image}
                alt={button.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* ==========================================
                TEXTO
            ========================================== */}

            <div
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "0 40px",
                background:
                  "linear-gradient(to right, rgba(8,32,59,0.15), rgba(2,12,25,0.92))",
              }}
            >
              <div
                style={{
                  color: TITLE_COLOR,
                  fontSize: BUTTON_TITLE_SIZE,
                  fontWeight: "bold",
                  marginBottom: "14px",
                  textShadow: "0 3px 10px rgba(0,0,0,0.7)",
                  letterSpacing: "1px",
                }}
              >
                {button.title}
              </div>

              <div
                style={{
                  color: TEXT_COLOR,
                  fontSize: BUTTON_DESCRIPTION_SIZE,
                  lineHeight: 1.5,
                  textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                  maxWidth: "500px",
                }}
              >
                {button.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}