/**
 * Desarrollado por: Mkg
 * Refactorizado por: Dev Gui
 *
 * @author Dev Gui
 */
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "schedule-message",
  description:
    "Programa un mensaje para ser enviado después de un tiempo definido.",
  commands: ["schedule", "schedule-message"],
  usage: `${PREFIX}schedule-message mensaje / tiempo
 
Ejemplo: ${PREFIX}schedule-message Reunión mañana / 10m`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendErrorReply, sendSuccessReply, sendText }) => {
    if (args.length !== 2) {
      return await sendErrorReply(
        `Formato incorrecto. Usa: ${PREFIX}agendar-mensaje mensaje / tiempo
        
Ejemplo: ${PREFIX}agendar-mensaje Reunión mañana / 10m`
      );
    }

    const rawTime = args[1].trim();

    const message = args[0].trim();

    let timeInMs = 0;

    if (/^\d+s$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 1000;
    } else if (/^\d+m$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 60 * 1000;
    } else if (/^\d+h$/.test(rawTime)) {
      timeInMs = parseInt(rawTime) * 60 * 60 * 1000;
    } else {
      return await sendErrorReply(
        `Formato de tiempo inválido.
Usa:\n• 10s para 10 segundos\n• 5m para 5 minutos\n• 2h para 2 horas`
      );
    }

    if (!message || message.trim() === "" || isNaN(timeInMs) || timeInMs <= 0) {
      return await sendErrorReply(
        "Mensaje inválido o tiempo no especificado correctamente."
      );
    }

    await sendSuccessReply(
      `⌚ Mensaje programado para dentro de ${rawTime}...`
    );

    setTimeout(async () => {
      await sendText(`⏰ *Mensaje programado:*\n\n${message}`);
    }, timeInMs);
  },
};
