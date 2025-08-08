const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const path = require("node:path");
const fs = require("node:fs");
const { getBuffer } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "send-sticker-from-buffer",
  description: "Ejemplo de cómo enviar un sticker desde un buffer",
  commands: ["send-sticker-from-buffer"],
  usage: `${PREFIX}send-sticker-from-buffer`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendReact, sendStickerFromBuffer }) => {
    await sendReact("🏷️");

    await delay(3000);

    await sendReply("Voy a enviar un sticker desde un buffer de archivo local");

    await delay(3000);

    const stickerBuffer = fs.readFileSync(
      path.join(ASSETS_DIR, "samples", "sample-sticker.webp")
    );

    await sendStickerFromBuffer(stickerBuffer);

    await delay(3000);

    await sendReply(
      "Ahora voy a enviar un sticker desde un buffer de URL y sin mencionar el mensaje"
    );

    await delay(3000);

    const urlBuffer = await getBuffer(
      "https://api.spiderx.com.br/storage/samples/sample-sticker.webp"
    );

    await sendStickerFromBuffer(urlBuffer, false);

    await delay(3000);

    await sendReply(
      "Para enviar stickers desde un buffer, usa la función sendStickerFromBuffer(buffer, quoted)."
    );

    await delay(3000);

    await sendReply(
      "💡 **Consejo:** Los buffers son útiles para stickers generados dinámicamente o convertidos de otros formatos."
    );
  },
};
