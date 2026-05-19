import { supabase }
from "../supabase";

export async function
obtenerOCrearConversacion(

  usuario1,
  usuario2

) {

  // BUSCAR CONVERSACIÓN EXISTENTE

  const { data:
    participantes1 }
    = await supabase

    .from(
      "conversacion_participantes"
    )

    .select(
      "conversacion_id"
    )

    .eq(
      "user_id",
      usuario1
    );

  const { data:
    participantes2 }
    = await supabase

    .from(
      "conversacion_participantes"
    )

    .select(
      "conversacion_id"
    )

    .eq(
      "user_id",
      usuario2
    );

  const ids1 =
    participantes1?.map(
      (p) =>
        p.conversacion_id
    ) || [];

  const ids2 =
    participantes2?.map(
      (p) =>
        p.conversacion_id
    ) || [];

  const comun =
    ids1.find(
      (id) =>
        ids2.includes(id)
    );

  // EXISTE

  if (comun) {

    return comun;
  }

  // CREAR CONVERSACIÓN

  const {
    data:
      nuevaConversacion,
  } = await supabase

    .from(
      "conversaciones"
    )

    .insert([
      {
        tipo:
          "privado",
      },
    ])

    .select()

    .single();

  const conversacionId =
    nuevaConversacion.id;

  // PARTICIPANTES

  await supabase
    .from(
      "conversacion_participantes"
    )
    .insert([

      {
        conversacion_id:
          conversacionId,

        user_id:
          usuario1,
      },

      {
        conversacion_id:
          conversacionId,

        user_id:
          usuario2,
      },

    ]);

  return conversacionId;
}