import fs from "node:fs";
import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../config.js";
import { InvalidParameterError } from "../../errors/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "set-menu-image",
  description: "Cambia la imagen del menú del bot",
  commands: ["set-menu-image", "set-image", "set-img-menu", "set-menu-img"],
  usage: `${PREFIX}set-menu-image (responde a una imagen)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    isImage,
    isReply,
    downloadImage,
    sendSuccessReply,
    sendErrorReply,
    webMessage,
  }) => {
    if (!isReply || !isImage) {
      throw new InvalidParameterError(
        "¡Necesitas responder a un mensaje que contenga una imagen!",
      );
    }

    try {
      const menuImagePath = path.join(ASSETS_DIR, "images", "takeshi-bot.png");

      let backupPath = "";

      if (fs.existsSync(menuImagePath)) {
        backupPath = path.join(ASSETS_DIR, "images", "takeshi-bot-backup.png");

        fs.copyFileSync(menuImagePath, backupPath);
      }

      const tempPath = await downloadImage(webMessage, "new-menu-image-temp");

      if (fs.existsSync(menuImagePath)) {
        fs.unlinkSync(menuImagePath);
      }

      fs.renameSync(tempPath, menuImagePath);

      await sendSuccessReply("¡Imagen del menú actualizada con éxito!");
    } catch (error) {
      errorLog(`Error al cambiar la imagen del menú: ${error}`);
      await sendErrorReply(
        "Ocurrió un error al intentar cambiar la imagen del menú. Por favor, intenta de nuevo.",
      );
    }
  },
};
