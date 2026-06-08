import { getToken } from "firebase/messaging";
import { messaging, VAPID_KEY } from "../firebase";
import { supabase } from "../supabase";

export async function registrarPush(userId) {
    console.log("registrarPush ejecutado", userId);
  try {
    const permiso =
      await Notification.requestPermission();

    if (permiso !== "granted") {
      console.log("Permiso denegado");
      return;
    }

    const token = await getToken(
      
      messaging,
      {
        vapidKey: VAPID_KEY,
      }
    );

    console.log(
  "TOKEN OBTENIDO:",
  token
);

    if (!token) {
      console.log("No se obtuvo token");
      return;
    }

    console.log("TOKEN:", token);

console.log(
  "GUARDANDO TOKEN EN SUPABASE"
);

    await supabase
      .from("profiles")
      .update({
        push_token: token,
      })
      .eq("id", userId);

    console.log(
      "Push token guardado"
    );

  } catch (error) {
    console.error(error);
  }
}