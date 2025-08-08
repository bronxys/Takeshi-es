const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const path = require("node:path");

module.exports = {
  name: "send-sticker-from-file",
  description: "Ejemplo de cómo enviar un sticker desde un archivo local",
  commands: ["send-sticker-from-file"],
  usage: `${PREFIX}send-sticker-from-file`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendStickerFromFile, sendReact }) => {
    await sendReact("🏷️");

    await delay(3000);

    await sendReply("Voy a enviar un sticker desde un archivo local");

    await delay(3000);

    await sendStickerFromFile(
      path.join(ASSETS_DIR, "samples", "sample-sticker.webp")
    );

    await delay(3000);

    await sendReply("También puedes usar otros stickers del proyecto:");

    await delay(3000);

    await sendStickerFromFile(
      path.join(ASSETS_DIR, "samples", "sample-sticker.webp")
    );

    await delay(3000);

    await sendReply(
      "Para enviar stickers desde archivo, usa la función sendStickerFromFile(filePath, quoted).\n\n" +
        "Esto es útil cuando tienes stickers almacenados localmente en el servidor."
    );

    await delay(3000);

    await sendReply(
      "💡 **Consejo:** El formato ideal para stickers es .webp. Otros formatos pueden necesitar conversión."
    );
  },
};
