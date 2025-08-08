const { PREFIX } = require(`${BASE_DIR}/config`);
const { errorLog } = require(`${BASE_DIR}/utils/logger`);

module.exports = {
  name: "open",
  description: "Abre el grupo.",
  commands: ["open", "open-group"],
  usage: `${PREFIX}open`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ socket, remoteJid, sendSuccessReply, sendErrorReply }) => {
    try {
      await socket.groupSettingUpdate(remoteJid, "not_announcement");
      await sendSuccessReply("¡Grupo abierto con éxito!");
    } catch (error) {
      await sendErrorReply(
        "¡Para abrir el grupo, necesito ser administrador del mismo!"
      );
      errorLog(
        `¡Ocurrió un error al abrir el grupo! Causa: ${JSON.stringify(
          error,
          null,
          2
        )}`
      );
    }
  },
};
