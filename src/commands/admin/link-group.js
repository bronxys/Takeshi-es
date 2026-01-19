/**
 * Comando para obtener el link del grupo
 *
 * @author Valéria
 */
import { PREFIX } from "../../config.js";
import { DangerError } from "../../errors/index.js";
import { errorLog } from "../../utils/logger.js";

export default {
  name: "link-group",
  description: "Obtiene el link del grupo",
  commands: ["link-group", "link-gp"],
  usage: `${PREFIX}link-group`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    socket,
    sendReact,
    sendReply,
    sendErrorReply,
    remoteJid,
  }) => {
    try {
      const groupCode = await socket.groupInviteCode(remoteJid);

      if (!groupCode) {
        throw new DangerError("¡Necesito ser admin!");
      }

      const groupInviteLink = `https://chat.whatsapp.com/${groupCode}`;

      await sendReact("🪀");
      await sendReply(groupInviteLink);
    } catch (error) {
      errorLog(error);
      await sendErrorReply("¡Necesito ser admin!");
    }
  },
};
