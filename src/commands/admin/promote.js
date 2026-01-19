import { PREFIX } from "../../config.js";
import { isGroup, onlyNumbers } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "promover",
  description: "Promueve a un usuario a administrador del grupo",
  commands: ["promover", "promove", "promote", "add-adm"],
  usage: `${PREFIX}promover @usuario`,
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
        "Por favor, mencione a un usuario para promover.",
      );
    }

    const userLid = args[0] ? `${onlyNumbers(args[0])}@lid` : null;

    try {
      await socket.groupParticipantsUpdate(remoteJid, [userLid], "promote");

      await sendSuccessReply("¡Usuario promovido con éxito!");
    } catch (error) {
      errorLog(`Erro ao promover usuário: ${error.message}`);
      await sendErrorReply(
        "Ocurrió un error al intentar promover al usuario. ¡Necesito ser administrador del grupo para promover a otros usuarios!",
      );
    }
  },
};
