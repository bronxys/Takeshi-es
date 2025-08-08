const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);
const {
  activateAutoResponderGroup,
  deactivateAutoResponderGroup,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "auto-responder",
  description: "Activa/desactiva la función de auto-respuesta en el grupo.",
  commands: ["auto-responder"],
  usage: `${PREFIX}auto-responder (1/0)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (activar o desactivar)!"
      );
    }

    const autoResponder = args[0] === "1";
    const notAutoResponder = args[0] === "0";

    if (!autoResponder && !notAutoResponder) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (activar o desactivar)!"
      );
    }

    if (autoResponder) {
      activateAutoResponderGroup(remoteJid);
    } else {
      deactivateAutoResponderGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = autoResponder ? "activado" : "desactivado";

    await sendReply(`¡Función de auto-respuesta ${context} con éxito!`);
  },
};
