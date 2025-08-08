/**
 * Desenvolvido por: MRX
 * Refatorado por: Dev Gui
 *
 * @author Dev Gui
 */
const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const Ffmpeg = require(`${BASE_DIR}/services/ffmpeg`);

module.exports = {
  name: "pixel",
  description:
    "Genero una edición que convierte la imagen que envíes a pixel-art",
  commands: ["pixel", "pixel-art", "px"],
  usage: `${PREFIX}pixel (marca la imagen) o ${PREFIX}pixel (responde la imagen)`,
  handle: async ({
    isImage,
    downloadImage,
    sendSuccessReact,
    sendWaitReact,
    sendImageFromFile,
    webMessage,
  }) => {
    if (!isImage) {
      throw new InvalidParameterError(
        "¡Necesitas marcar una imagen o responder a una imagen!"
      );
    }

    await sendWaitReact();
    const filePath = await downloadImage(webMessage);
    const ffmpeg = new Ffmpeg();

    try {
      const outputPath = await ffmpeg.applyPixelation(filePath);
      await sendSuccessReact();
      await sendImageFromFile(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Error al aplicar el efecto pixel");
    } finally {
      await ffmpeg.cleanup(filePath);
    }
  },
};
