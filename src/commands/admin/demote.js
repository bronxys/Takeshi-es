import { PREFIX } from "../../config.js";
import { isGroup, toUserJidOrLid } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "demote",
  description: "Degrada a un administrador a miembro común",
  commands: ["demote"],
  usage: `${PREFIX}demote @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    remoteJid,
    socket,
    sendWarningReply,
    sendSuccessReply,
    sendErrorReply,
  }) => {
    if (!isGroup(remoteJid)) {
      return sendWarningReply(
        "¡Este comando solo puede ser usado en un grupo!",
      );
    }

    if (!args.length || !args[0]) {
      return sendWarningReply(
        "Por favor, etiqueta a un administrador para degradarlo.",
      );
    }

    const userId = toUserJidOrLid(args[0]);

    try {
      await socket.groupParticipantsUpdate(remoteJid, [userId], "demote");
      await sendSuccessReply("¡Usuario degradado con éxito!");
    } catch (error) {
      errorLog(`Error al degradar administrador: ${error.message}`);
      await sendErrorReply(
        "Ocurrió un error al intentar degradar al usuario. ¡Necesito ser administrador del grupo para degradar a otros administradores!",
      );
    }
  },
};
