const { PREFIX } = require(`${BASE_DIR}/config`);
const { WarningError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "get-id",
  description: "Devuelve el ID completo de un grupo en formato JID.",
  commands: ["get-id", "get-group-id", "id-get", "id-group"],
  usage: `${PREFIX}get-id`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, sendSuccessReply, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("Este comando debe usarse dentro de un grupo.");
    }

    await sendSuccessReply(`*ID del grupo*: ${remoteJid}`);
  },
};
