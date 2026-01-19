import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "set-name",
  description: "Cambia el nombre del grupo y guarda el nombre antiguo",
  commands: ["set-name", "set-group-name", "mudar-nome-grupo", "nome-grupo"],
  usage: `${PREFIX}set-name nuevo nombre del grupo`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    fullArgs,
    remoteJid,
    socket,
    sendErrorReply,
    sendSuccessReply,
    sendWaitReply,
    isGroup,
  }) => {
    if (!isGroup) {
      throw new WarningError("Este comando solo puede usarse en grupos.");
    }

    if (!fullArgs) {
      throw new InvalidParameterError(
        "¡Necesitas proporcionar un nuevo nombre para el grupo!",
      );
    }

    const minLength = 3;
    const maxLength = 40;

    if (fullArgs.length < minLength || fullArgs.length > maxLength) {
      throw new InvalidParameterError(
        `¡El nombre del grupo debe tener entre ${minLength} y ${maxLength} caracteres!`,
      );
    }

    try {
      await sendWaitReply("Cambiando el nombre del grupo...");

      const groupMetadata = await socket.groupMetadata(remoteJid);
      const oldName = groupMetadata.subject;

      await socket.groupUpdateSubject(remoteJid, fullArgs);

      await sendSuccessReply(
        `¡Nombre del grupo cambiado con éxito!\n\n*Antiguo*: ${oldName}\n\n*Nuevo*: ${fullArgs}`,
      );
    } catch (error) {
      errorLog("Error al cambiar el nombre del grupo:", error);
      await sendErrorReply(
        "Fallo al cambiar el nombre del grupo. Verifica si tengo permiso de administrador.",
      );
    }
  },
};
