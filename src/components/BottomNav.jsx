import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    {
      label: "HOME",
      path: "/",
    },

    {
      label: "BOATS",
      path: "/barcos",
    },

    {
      label: "TRIPULACIÓN",
      path: "/tripulacion",
    },

    {
      label: "ACTIVIDADES",
      path: "/actividades",
    },

    {
      label: "RECURSOS",
      path: "/recursos",
    },

    {
      label: "BRICOS",
      path: "/bricos",
    },

    {
      label: "COMPRAVENTA",
      path: "/compraventa",
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,

        background: "rgba(2,18,36,0.96)",

        backdropFilter: "blur(10px)",

        borderTop: "1px solid rgba(255,255,255,0.12)",

        display: "flex",

        justifyContent: "space-around",

        alignItems: "center",

        padding: "12px 8px",

        zIndex: 999,
      }}
    >
      {items.map((item) => {
        const active = location.pathname === item.path;

        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: "none",

              border: "none",

              color: active ? "#fe5d01" : "white",

              fontSize: window.innerWidth < 768
                ? "11px"
                : "14px",

              fontWeight: active ? "bold" : "normal",

              cursor: "pointer",

              padding: "6px 8px",

              transition: "0.25s",

              letterSpacing: "0.5px",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}