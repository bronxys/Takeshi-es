import { PREFIX } from "../../config.js";
import { isGroup, onlyNumbers } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "rebaixar",
  description: "Degrada a um administrador a miembro común",
  commands: ["rebaixar", "rebaixa", "demote"],
  usage: `${PREFIX}rebaixar @usuario`,
  /**
   * @param {CommandHandleProps} props
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
        "¡Este comando solo puede ser utilizado en grupos!",
      );
    }
    if (!args.length || !args[0]) {
      return sendWarningReply(
        "Por favor, mencione a un administrador para degradar.",
      );
    }
    const userId = args[0] ? `${onlyNumbers(args[0])}@lid` : null;
    try {
      await socket.groupParticipantsUpdate(remoteJid, [userId], "demote");
      await sendSuccessReply("¡Usuario degradado con éxito!");
    } catch (error) {
      errorLog(`Erro ao rebaixar administrador: ${error.message}`);
      await sendErrorReply(
        "Ocurrió un error al intentar degradar al usuario. ¡Necesito ser administrador del grupo para degradar a otros administradores!",
      );
    }
  },
};
