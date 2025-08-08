const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const path = require("node:path");

module.exports = {
  name: "send-gif-from-file",
  description: "Ejemplo de cómo enviar gifs desde archivos locales",
  commands: ["send-gif-from-file"],
  usage: `${PREFIX}send-gif-from-file`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendGifFromFile, sendReact, userJid }) => {
    await sendReact("🎬");

    await delay(3000);

    await sendReply("Voy a enviar gifs desde archivos locales");

    await delay(3000);

    await sendGifFromFile(path.join(ASSETS_DIR, "samples", "sample-video.mp4"));

    await delay(3000);

    await sendReply("Ahora con subtítulo:");

    await delay(3000);

    await sendGifFromFile(
      path.join(ASSETS_DIR, "samples", "sample-video.mp4"),
      "¡Este es un gif con subtítulo!"
    );

    await delay(3000);

    await sendReply("Ahora mencionándote:");

    await delay(3000);

    await sendGifFromFile(
      path.join(ASSETS_DIR, "samples", "sample-video.mp4"),
      `¡Hola @${userJid.split("@")[0]}! ¡Este gif es para ti!`,
      [userJid]
    );

    await delay(3000);

    await sendReply("Y ahora sin responder a tu mensaje:");

    await delay(3000);

    await sendGifFromFile(
      path.join(ASSETS_DIR, "samples", "sample-video.mp4"),
      "Gif sin respuesta/mención en el mensaje",
      null,
      false
    );

    await delay(3000);

    await sendReply(
      "Para enviar imágenes desde archivo, usa la función sendGifFromFile(url, caption, [mentions], quoted).\n\n" +
        "Esto es útil cuando tienes gifs almacenados localmente en el servidor."
    );
  },
};
