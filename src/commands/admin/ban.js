import { BOT_LID, OWNER_LID, PREFIX } from "../../config.js";
import { DangerError, InvalidParameterError } from "../../errors/index.js";
import { onlyNumbers } from "../../utils/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "ban",
  description: "Elimino a un miembro del grupo",
  commands: ["ban", "kick"],
  usage: `${PREFIX}ban @mencionar_miembro 

o 

${PREFIX}ban (mencionando un mensaje)`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyLid,
    sendReply,
    userLid,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    try {
      if (!args.length && !isReply) {
        throw new InvalidParameterError(
          "¡Necesitas mencionar o marcar a un miembro!",
        );
      }

      if (args.length && !args[0].includes("@")) {
        throw new InvalidParameterError(
          '¡Necesitas mencionar a un miembro con "@"!',
        );
      }

      const userId = args[0] ? `${onlyNumbers(args[0])}@lid` : null;

      const memberToRemoveLid = isReply ? replyLid : userId;

      if (!memberToRemoveLid) {
        throw new InvalidParameterError("¡Miembro inválido!");
      }

      if (memberToRemoveLid === userLid) {
        throw new DangerError("¡No puedes eliminarte a ti mismo!");
      }

      const resolvedOwnerLid = OWNER_LID;

      if (resolvedOwnerLid && memberToRemoveLid === resolvedOwnerLid) {
        throw new DangerError("¡No puedes eliminar al dueño del bot!");
      }

      if (BOT_LID && memberToRemoveLid === BOT_LID) {
        throw new DangerError("¡No puedes eliminarme!");
      }

      await socket.groupParticipantsUpdate(
        remoteJid,
        [memberToRemoveLid],
        "remove",
      );

      await sendSuccessReact();
      await sendReply("¡Miembro eliminado con éxito!");
    } catch (error) {
      errorLog(JSON.stringify(error, null, 2));
      await sendErrorReply(
        `Ocurrió un error al eliminar al miembro: ${error.message}`,
      );
    }
  },
};
