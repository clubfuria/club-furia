import {
  Ship,
  Users,
  CalendarDays,
  FileText,
  Wrench,
  ShoppingBag,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = window.innerWidth < 768;

  const items = [
    {
      label: "BOATS",
      path: "/barcos",
      icon: Ship,
    },

    {
      label: "TRIPU",
      path: "/tripulacion",
      icon: Users,
    },

    {
      label: "ACTIV",
      path: "/actividades",
      icon: CalendarDays,
    },

    {
      label: "RECUR",
      path: "/recursos",
      icon: FileText,
    },

    {
      label: "BRICOS",
      path: "/bricos",
      icon: Wrench,
    },

    {
      label: "COMPRA",
      path: "/compraventa",
      icon: ShoppingBag,
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

        backdropFilter: "blur(12px)",

        borderTop: "1px solid rgba(255,255,255,0.12)",

        display: "flex",

        justifyContent: "space-around",

        alignItems: "center",

        padding: isMobile ? "10px 4px 8px" : "12px 10px",

        zIndex: 999,
      }}
    >
      {items.map((item) => {
        const active = location.pathname === item.path;

        const Icon = item.icon;

        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",

              flexDirection: "column",

              alignItems: "center",

              justifyContent: "center",

              cursor: "pointer",

              width: isMobile ? "16%" : "100px",
            }}
          >
            {/* ICONO */}

            <div
              style={{
                width: isMobile ? "48px" : "56px",

                height: isMobile ? "48px" : "56px",

                borderRadius: "18px",

                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                marginTop: active ? "-24px" : "-16px",

                background: active
                  ? "#fe5d01"
                  : "rgba(255,255,255,0.08)",

                border: active
                  ? "2px solid white"
                  : "1px solid rgba(255,255,255,0.12)",

                boxShadow: active
                  ? "0 0 18px rgba(254,93,1,0.55)"
                  : "0 4px 10px rgba(0,0,0,0.35)",

                transition: "0.25s",
              }}
            >
              <Icon
                size={isMobile ? 24 : 28}
                color="white"
              />
            </div>

            {/* TEXTO */}

            <div
              style={{
                marginTop: "8px",

                color: active ? "#fe5d01" : "white",

                fontSize: isMobile ? "10px" : "13px",

                fontWeight: active ? "bold" : "normal",

                textAlign: "center",

                letterSpacing: "0.5px",
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}