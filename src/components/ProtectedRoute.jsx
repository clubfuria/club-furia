import { Navigate }
from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import { supabase }
from "../supabase";

import { registrarPush }
from "../utils/pushNotifications";

export default function ProtectedRoute({
  children,
}) {

alert("ProtectedRoute cargado");

  const [loading, setLoading] =
    useState(true);

  const [session, setSession] =
    useState(null);

  useEffect(() => {

    supabase.auth
      .getSession()
    .then(async ({ data }) => {

console.log(
  "SESSION:",
  data.session
);

  setSession(
    data.session
  );

  if (
    data.session?.user?.id
  ) {

console.log(
  "LLAMANDO registrarPush"
);


    await registrarPush(
      data.session.user.id
    );

  }

  setLoading(false);
});  

  }, []);

  if (loading) {

    return null;
  }

  if (!session) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
}