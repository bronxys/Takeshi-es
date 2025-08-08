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
  name: "mirror",
  description: "Invierte la posición de la imagen que envíes",
  commands: ["espelhar", "espejar", "mirror"],
  usage: `${PREFIX}mirror (marca la imagen) o ${PREFIX}mirror (responde la imagen)`,
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
      const outputPath = await ffmpeg.mirrorImage(filePath);
      await sendSuccessReact();
      await sendImageFromFile(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Error al aplicar el efecto de espejo");
    } finally {
      await ffmpeg.cleanup(filePath);
    }
  },
};
