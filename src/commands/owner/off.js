const { PREFIX } = require(`${BASE_DIR}/config`);
const { deactivateGroup } = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "off",
  description: "Desactiva el bot en el grupo",
  commands: ["off"],
  usage: `${PREFIX}off`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, remoteJid, isGroup }) => {
    if (!isGroup) {
      throw new WarningError("Este comando debe usarse dentro de un grupo.");
    }

    deactivateGroup(remoteJid);

    await sendSuccessReply("¡Bot desactivado en el grupo!");
  },
};
