const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "send-image-from-url",
  description: "Ejemplo de cómo enviar una imagen desde una URL",
  commands: ["send-image-from-url"],
  usage: `${PREFIX}send-image-from-url`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendImageFromURL, sendReact, userJid }) => {
    await sendReact("🖼️");

    await delay(3000);

    await sendReply("Voy a enviar una imagen desde una URL");

    await delay(3000);

    await sendImageFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-image.jpg",
      "Esta es una leyenda para la imagen de la URL"
    );

    await delay(3000);

    await sendReply("También puedes enviar imágenes de URL sin leyenda:");

    await delay(3000);

    await sendImageFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-image.jpg"
    );

    await delay(3000);

    await sendReply("Ahora voy a enviar una imagen de URL mencionándote:");

    await delay(3000);

    await sendImageFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-image.jpg",
      `¡Logo de Takeshi Bot para ti ${userJid.split("@")[0]}!`,
      [userJid]
    );

    await sendReply(
      "Para enviar imágenes de URL, usa la función sendImageFromURL(url, caption, [mentions], quoted).\n\n" +
        "Esto es útil cuando tienes imágenes alojadas en línea u obtenidas de APIs."
    );
  },
};
