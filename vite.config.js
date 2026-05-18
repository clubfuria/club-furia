import { defineConfig }
from "vite";

import react
from "@vitejs/plugin-react";

import {
  VitePWA,
} from "vite-plugin-pwa";

export default defineConfig({

  plugins: [

    react(),

    VitePWA({

      registerType:
        "autoUpdate",

      devOptions: {
        enabled: true,
      },

      manifest: {

        name:
          "Club Furia",

        short_name:
          "ClubFuria",

        description:
          "Comunidad náutica Club Furia",

        theme_color:
          "#011135",

        background_color:
          "#011135",

        display:
          "standalone",

        start_url: "/",

        scope: "/",

        orientation:
          "portrait",

        icons: [

          {
            src: "/pwa-192.png",

            sizes:
              "192x192",

            type:
              "image/png",
          },

          {
            src: "/pwa-512.png",

            sizes:
              "512x512",

            type:
              "image/png",
          },

          {
            src: "/pwa-512.png",

            sizes:
              "512x512",

            type:
              "image/png",

            purpose:
              "maskable",
          },

        ],
      },
    }),
  ],
});