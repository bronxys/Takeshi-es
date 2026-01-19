import ffmpeg from "fluent-ffmpeg";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_PREFIX, TEMP_DIR } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { getRandomName } from "../../utils/index.js";

export default {
  name: "reveal",
  description: "Revela una imagen o video con vista única",
  commands: ["reveal", "rv"],
  usage: `${DEFAULT_PREFIX}reveal (etiqueta la imagen/video) o ${DEFAULT_PREFIX}revelar (responde a la imagen/video).`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    isImage,
    isVideo,
    downloadImage,
    downloadVideo,
    webMessage,
    sendSuccessReact,
    sendWaitReact,
    sendImageFromFile,
    sendVideoFromFile,
  }) => {
    if (!isImage && !isVideo) {
      throw new InvalidParameterError(
        "¡Necesitas etiquetar una imagen/video o responder a una imagen/video para revelarla!",
      );
    }

    await sendWaitReact();

    const mediaCaption = `¡Aquí está tu ${
      isImage ? "imagen" : "video"
    } revelada!`;

    const outputPath = path.resolve(
      TEMP_DIR,
      `${getRandomName()}.${isImage ? "jpg" : "mp4"}`,
    );

    let inputPath;

    try {
      if (isImage) {
        inputPath = await downloadImage(webMessage, "input");

        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .outputOptions("-q:v 2")
            .on("end", async () => {
              await sendImageFromFile(outputPath, mediaCaption);
              await sendSuccessReact();
              resolve();
            })
            .on("error", (err) => {
              console.error("Error FFmpeg:", err);
              reject(err);
            })
            .save(outputPath);
        });
      } else if (isVideo) {
        inputPath = await downloadVideo(webMessage, "input");

        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .outputOptions("-c copy")
            .on("end", async () => {
              await sendVideoFromFile(outputPath, mediaCaption);
              await sendSuccessReact();
              resolve();
            })
            .on("error", (err) => {
              console.error("Error FFmpeg:", err);
              reject(err);
            })
            .save(outputPath);
        });
      }
    } catch (error) {
      console.error("Error general:", error);
      throw new Error(
        "Ocurrió un error al procesar el medio. Intenta de nuevo.",
      );
    } finally {
      const cleanFile = (filePath) => {
        if (filePath && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (cleanError) {
            console.error("Error al limpiar archivo:", cleanError);
          }
        }
      };

      cleanFile(inputPath);
      cleanFile(outputPath);
    }
  },
};
