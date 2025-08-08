/**
 * Desarrollado por: Mkg
 * Refactorizado por: Dev Gui
 *
 * @author Dev Gui
 */
const { exec } = require("child_process");
const { isBotOwner } = require(`${BASE_DIR}/middlewares`);
const { PREFIX } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "exec",
  description: "Ejecuta comandos de la terminal directamente desde el bot.",
  commands: ["exec"],
  usage: `${PREFIX}exec comando`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    fullArgs,
    sendSuccessReply,
    sendErrorReply,
    userJid,
    isLid,
  }) => {
    if (!isBotOwner({ userJid, isLid })) {
      throw new DangerError("¡Solo el dueño del bot puede usar este comando!");
    }

    if (!fullArgs) {
      throw new DangerError(`Uso correcto: ${PREFIX}exec comando`);
    }

    exec(fullArgs, (error, stdout) => {
      if (error) {
        return sendErrorReply(`Error al ejecutar: ${error.message}`);
      }

      const output = stdout || "Comando ejecutado sin salida.";

      return sendSuccessReply(
        `Resultado:\n\`\`\`\n${output.trim().slice(0, 4000)}\n\`\`\``
      );
    });
  },
};
