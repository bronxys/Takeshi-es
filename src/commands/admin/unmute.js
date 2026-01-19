/**
 * Desarrollado por: Mkg
 * Refactorizado por: Dev Gui
 *
 * @author Dev Gui
 */
import { PREFIX } from "../../config.js";
import { DangerError, WarningError } from "../../errors/index.js";
import { checkIfMemberIsMuted, unmuteMember } from "../../utils/database.js";
import { toUserJidOrLid } from "../../utils/index.js";

export default {
  name: "unmute",
  description: "Le quita el silencio a un miembro del grupo",
  commands: ["unmute", "desilenciar"],
  usage: `${PREFIX}unmute @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */ handle: async ({
    remoteJid,
    sendSuccessReply,
    args,
    isGroup,
    replyJid,
  }) => {
    if (!isGroup) {
      throw new DangerError("Este comando solo se puede usar en grupos.");
    }

    if (!args.length && !replyJid) {
      throw new DangerError(
        `Necesitas mencionar a un usuario para quitarle el silencio.\n\nEjemplo: ${PREFIX}unmute @usuario`,
      );
    }

    const userId = replyJid ? replyJid : toUserJidOrLid(args[0]);

    if (!checkIfMemberIsMuted(remoteJid, userId)) {
      throw new WarningError("¡Este usuario no está silenciado!");
    }

    unmuteMember(remoteJid, userId);

    await sendSuccessReply(
      "¡Se le ha quitado el silencio al usuario con éxito!",
    );
  },
};
