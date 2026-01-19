/**
 * Desenvolvido por: Mkg
 * Refatorado por: Dev Gui
 *
 * @author Dev Gui
 */
import { BOT_LID, OWNER_LID, PREFIX } from "../../config.js";
import { DangerError } from "../../errors/index.js";
import { checkIfMemberIsMuted, muteMember } from "../../utils/database.js";
import { onlyNumbers } from "../../utils/index.js";

export default {
  name: "mute",
  description:
    "Silencia a un usuario en el grupo (elimina los mensajes del usuario automáticamente).",
  commands: ["mute", "mutar"],
  usage: `${PREFIX}mute @usuario o (responda al mensaje del usuario que desea silenciar)`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    args,
    remoteJid,
    replyLid,
    sendErrorReply,
    sendSuccessReply,
    getGroupMetadata,
    isGroup,
  }) => {
    if (!isGroup) {
      throw new DangerError("Este comando solo puede ser utilizado en grupos.");
    }

    if (!args.length && !replyLid) {
      throw new DangerError(
        `Necesitas mencionar a un usuario o responder al mensaje del usuario que deseas silenciar.\n\nEjemplo: ${PREFIX}mute @fulano`,
      );
    }

    const userId = replyLid
      ? replyLid
      : args[0]
        ? `${onlyNumbers(args[0])}@lid`
        : null;

    const targetUserNumber = onlyNumbers(userId);

    if (OWNER_LID && userId === OWNER_LID) {
      throw new DangerError("¡No puedes silenciar al dueño del bot!");
    }

    if (BOT_LID && userId === BOT_LID) {
      throw new DangerError("No puedes silenciar al bot.");
    }

    const groupMetadata = await getGroupMetadata();
    const isUserInGroup = groupMetadata.participants.some(
      (participant) => participant.id === userId,
    );

    if (!isUserInGroup) {
      return sendErrorReply(
        `El usuario @${targetUserNumber} no está en este grupo.`,
        [userId],
      );
    }

    const isTargetAdmin = groupMetadata.participants.some(
      (participant) => participant.id === userId && participant.admin,
    );

    if (isTargetAdmin) {
      throw new DangerError("No puedes silenciar a un administrador.");
    }

    if (checkIfMemberIsMuted(remoteJid, userId)) {
      return sendErrorReply(
        `El usuario @${targetUserNumber} ya está silenciado en este grupo.`,
        [userId],
      );
    }

    muteMember(remoteJid, userId);

    await sendSuccessReply(
      `¡@${targetUserNumber} fue silenciado con éxito en este grupo!`,
      [userId],
    );
  },
};
