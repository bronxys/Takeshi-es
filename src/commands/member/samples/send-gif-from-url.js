const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "send-gif-from-url",
  description: "Ejemplo de cómo enviar gifs desde URLs externas",
  commands: ["send-gif-from-url"],
  usage: `${PREFIX}send-gif-from-url`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendGifFromURL, sendReact, userJid }) => {
    await sendReact("🌐");

    await delay(3000);

    await sendReply("Voy a enviar gifs desde URLs externas");

    await delay(3000);

    await sendGifFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-video.mp4"
    );

    await delay(3000);

    await sendReply("Ahora con subtítulo:");

    await delay(3000);

    await sendGifFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-video.mp4",
      "¡GIF cargado desde una URL externa!"
    );

    await delay(3000);

    await sendReply("Con mención:");

    await delay(3000);

    await sendGifFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-video.mp4",
      `¡Hola @${userJid.split("@")[0]}! ¡Mira qué genial este gif!`,
      [userJid]
    );

    await delay(3000);

    await sendReply("Y sin responder a tu mensaje:");

    await delay(3000);

    await sendGifFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-video.mp4",
      "GIF sin respuesta",
      undefined,
      false
    );

    await delay(3000);

    await sendReply(
      "Para enviar imágenes desde archivo, usa la función sendGifFromURL(url, caption, [mentions], quoted).\n\n" +
        "Esto es útil cuando tienes imágenes alojadas en línea u obtenidas de APIs."
    );

    await delay(3000);

    await sendReply(
      "🌐 *URLs útiles para GIFs:*\n\n" +
        "• Giphy: giphy.com\n" +
        "• Tenor: tenor.com\n" +
        "• APIs de GIFs online\n\n" +
        "💡 *Consejo:* ¡Asegúrate de que la URL apunte directamente al archivo de video!"
    );
  },
};
