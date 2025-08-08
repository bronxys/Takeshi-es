const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const {
  activateExitGroup,
  deactivateExitGroup,
  isActiveExitGroup,
} = require(`${BASE_DIR}/utils/database`);

module.exports = {
  name: "exit",
  description:
    "Activa/desactiva la función de envío de mensajes cuando alguien sale del grupo.",
  commands: ["exit"],
  usage: `${PREFIX}exit (1/0)`,
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

    const exit = args[0] === "1";
    const notExit = args[0] === "0";

    if (!exit && !notExit) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (activar o desactivar)!"
      );
    }

    const hasActive = exit && isActiveExitGroup(remoteJid);
    const hasInactive = notExit && !isActiveExitGroup(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `¡La función de salida ya está ${exit ? "activada" : "desactivada"}!`
      );
    }

    if (exit) {
      activateExitGroup(remoteJid);
    } else {
      deactivateExitGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = exit ? "activada" : "desactivada";

    await sendReply(
      `¡Función de envío de mensaje de salida ${context} con éxito!`
    );
  },
};
