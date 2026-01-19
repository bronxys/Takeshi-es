/**
 * Desenvolvido por: Mkg
 * Refatorado por: Dev Gui
 *
 * @author Dev Gui
 */
import { PREFIX } from "../../config.js";
import { DangerError, WarningError } from "../../errors/index.js";
import { checkIfMemberIsMuted, unmuteMember } from "../../utils/database.js";

export default {
  name: "unmute",
  description: "Desactiva el silencio de un miembro del grupo",
  commands: ["unmute", "desmutar"],
  usage: `${PREFIX}unmute @usuario`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({ remoteJid, sendSuccessReply, args, isGroup, replyLid }) => {
    if (!isGroup) {
      throw new DangerError("Este comando solo puede ser utilizado en grupos.");
    }
    if (!args.length) {
      throw new DangerError(
        `Necesitas mencionar a un usuario para quitar el silencio.\n\nEjemplo: ${PREFIX}unmute @fulano`,
      );
    }
    const userId = replyLid
      ? replyLid
      : args[0]
        ? `${args[0].replace(/[^0-9]/g, "")}@lid`
        : null;
    if (!checkIfMemberIsMuted(remoteJid, userId)) {
      throw new WarningError("¡Este usuario no está silenciado!");
    }
    unmuteMember(remoteJid, userId);
    await sendSuccessReply("¡Usuario reactivado con éxito!");
  },
};
