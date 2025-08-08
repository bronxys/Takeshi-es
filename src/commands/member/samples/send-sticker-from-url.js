const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "send-sticker-from-url",
  description: "Ejemplo de cómo enviar un sticker desde una URL",
  commands: ["send-sticker-from-url"],
  usage: `${PREFIX}send-sticker-from-url`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendStickerFromURL, sendReact }) => {
    await sendReact("🏷️");

    await delay(3000);

    await sendReply("Voy a enviar un sticker desde una URL");

    await delay(3000);

    await sendStickerFromURL(
      "https://api.spiderx.com.br/storage/samples/sample-sticker.webp"
    );

    await delay(3000);

    await sendReply(
      "Para enviar stickers desde URL, usa la función sendStickerFromURL(url, quoted).\n\n" +
        "Esto es útil cuando tienes stickers alojados en línea u obtenidos de APIs."
    );

    await delay(3000);

    await sendReply(
      "💡 **Consejo:** Asegúrate de que la URL apunte a un archivo .webp válido para garantizar la compatibilidad."
    );
  },
};
