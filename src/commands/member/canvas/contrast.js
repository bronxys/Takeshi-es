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
  name: "contrast",
  description:
    "Genero una edición que ajusta el contraste de la imagen que envíes",
  commands: ["contrast", "contraste", "contrastear", "hd", "to-hd"],
  usage: `${PREFIX}contrast (marca la imagen) o ${PREFIX}contraste (responde la imagen)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
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
      const outputPath = await ffmpeg.adjustContrast(filePath);
      await sendSuccessReact();
      await sendImageFromFile(outputPath);
    } catch (error) {
      console.error(error);
      throw new Error("Error al aplicar el efecto de contraste");
    } finally {
      await ffmpeg.cleanup(filePath);
    }
  },
};
