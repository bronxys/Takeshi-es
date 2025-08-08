const fs = require("node:fs");
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, DangerError } = require(`${BASE_DIR}/errors`);
const {
  isAnimatedSticker,
  processStaticSticker,
  processAnimatedSticker,
  addStickerMetadata,
} = require(`${BASE_DIR}/services/sticker`);
const { getRandomName } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "rename",
  description: "Añade nuevos metadatos al sticker.",
  commands: ["rename", "rn"],
  usage: `${PREFIX}rename paquete / autor (responde a un sticker)`,
  handle: async ({
    isSticker,
    downloadSticker,
    webMessage,
    sendWaitReact,
    sendSuccessReact,
    sendStickerFromFile,
    args,
  }) => {
    if (!isSticker) {
      throw new InvalidParameterError("¡Necesitas responder a un sticker!");
    }

    if (args.length !== 2) {
      throw new InvalidParameterError(
        "Necesitas proporcionar el paquete y el autor en el formato: paquete / autor"
      );
    }

    const pack = args[0];
    const author = args[1];

    if (!pack || !author) {
      throw new InvalidParameterError(
        "Necesitas proporcionar el paquete y el autor en el formato: paquete / autor"
      );
    }

    const minLength = 2;
    const maxLength = 50;

    if (pack.length < minLength || pack.length > maxLength) {
      throw new DangerError(
        `El paquete debe tener entre ${minLength} y ${maxLength} caracteres.`
      );
    }

    if (author.length < minLength || author.length > maxLength) {
      throw new DangerError(
        `El autor debe tener entre ${minLength} y ${maxLength} caracteres.`
      );
    }

    let finalStickerPath = null;

    await sendWaitReact();

    const inputPath = await downloadSticker(webMessage, getRandomName("webp"));

    try {
      const metadata = {
        username: pack,
        botName: author,
      };

      const isAnimated = await isAnimatedSticker(inputPath);

      if (isAnimated) {
        finalStickerPath = await processAnimatedSticker(
          inputPath,
          metadata,
          addStickerMetadata
        );
      } else {
        finalStickerPath = await processStaticSticker(
          inputPath,
          metadata,
          addStickerMetadata
        );
      }

      await sendSuccessReact();

      await sendStickerFromFile(finalStickerPath);
    } catch (error) {
      throw new Error(`Error al renombrar el sticker: ${error.message}`);
    } finally {
      if (fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (finalStickerPath && fs.existsSync(finalStickerPath)) {
        fs.unlinkSync(finalStickerPath);
      }
    }
  },
};
