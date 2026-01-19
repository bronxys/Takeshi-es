import { delay } from "baileys";
import fs from "node:fs";
import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { getBuffer } from "../../../utils/index.js";

export default {
  name: "send-gif-from-buffer",
  description: "Ejemplo de cómo enviar gifs desde buffers",
  commands: ["send-gif-from-buffer"],
  usage: `${PREFIX}send-gif-from-buffer`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendGifFromBuffer, sendReact, userJid }) => {
    await sendReact("💾");

    await delay(3000);

    await sendReply("Voy a enviar gifs desde buffers (archivo local y URL)");

    await delay(3000);

    const fileBuffer = fs.readFileSync(
      path.join(ASSETS_DIR, "samples", "sample-video.mp4"),
    );

    await sendGifFromBuffer(fileBuffer);

    await delay(3000);

    await sendReply("Ahora desde un buffer obtenido de una URL:");

    await delay(3000);

    const urlBuffer = await getBuffer(
      "https://api.spiderx.com.br/storage/samples/sample-video.mp4",
    );

    await sendGifFromBuffer(urlBuffer, "¡GIF cargado de URL a buffer!");

    await delay(3000);

    await sendReply("Con mención:");

    await delay(3000);

    await sendGifFromBuffer(
      fileBuffer,
      `@${userJid.split("@")[0]} ¡este gif provino de un buffer!`,
      [userJid],
    );

    await delay(3000);

    await sendReply("Y sin responder a tu mensaje:");

    await delay(3000);

    await sendGifFromBuffer(
      fileBuffer,
      "GIF de buffer sin respuesta",
      null,
      false,
    );

    await delay(3000);

    await sendReply(
      "Para enviar imágenes desde archivo, usa la función sendGifFromBuffer(buffer, caption, [mentions], quoted).\n\n" +
        "¡Esto es útil para gifs generados dinámicamente o convertidos de otros formatos!",
    );

    await delay(3000);

    await sendReply(
      "💾 *Ventajas de los buffers:*\n\n" +
        "• Procesamiento en memoria\n" +
        "• Conversión de formatos\n" +
        "• Manipulación de datos\n" +
        "• Caché temporal\n\n" +
        "💡 *Consejo:* ¡Los buffers son útiles para GIFs generados dinámicamente o convertidos!",
    );
  },
};
