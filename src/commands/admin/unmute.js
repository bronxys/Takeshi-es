/**
 * Desarrollado por: Mkg
 * Refactorizado por: Dev Gui
 *
 * @author Dev Gui
 */
const { toUserJid, onlyNumbers } = require(`${BASE_DIR}/utils`);
const {
  checkIfMemberIsMuted,
  unmuteMember,
} = require(`${BASE_DIR}/utils/database`);
const { PREFIX } = require(`${BASE_DIR}/config`);

const { DangerError, WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "unmute",
  description: "Desactiva el silencio de un miembro del grupo",
  commands: ["unmute"],
  usage: `${PREFIX}unmute @usuario`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    remoteJid,
    sendSuccessReply,
    args,
    isGroup,
    isGroupWithLid,
    socket,
  }) => {
    if (!isGroup) {
      throw new DangerError("Este comando solo puede ser usado en grupos.");
    }

    if (!args.length) {
      throw new DangerError(
        `Necesitas mencionar a un usuario para desmutear.\n\nEjemplo: ${PREFIX}unmute @usuario`
      );
    }

    const targetUserNumber = onlyNumbers(args[0]);
    let targetUserJid = toUserJid(targetUserNumber);

    if (isGroupWithLid) {
      const [result] = await socket.onWhatsApp(targetUserNumber);
      targetUserJid = result?.lid;
    }

    if (!checkIfMemberIsMuted(remoteJid, targetUserJid)) {
      throw new WarningError("¡Este usuario no está silenciado!");
    }

    unmuteMember(remoteJid, targetUserJid);

    await sendSuccessReply("¡Usuario desmuteado con éxito!");
  },
};
