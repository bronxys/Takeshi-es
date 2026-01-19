import { PREFIX } from "../../config.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "close",
  description: "Cierra el grupo.",
  commands: ["close", "close-group"],
  usage: `${PREFIX}close`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "announcement");
      await sendSuccessReply("¡Grupo cerrado con éxito!");
    } catch (error) {
      await sendErrorReply(
        "¡Para cerrar el grupo, necesito ser administrador del mismo!",
      );
      errorLog(
        `¡Ocurrió un error al cerrar el grupo! Causa: ${JSON.stringify(
          error,
          null,
          2,
        )}`,
      );
    }
  },
};
