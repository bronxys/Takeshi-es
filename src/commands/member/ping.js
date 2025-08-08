/**
 * Mejorado por: Mkg
 *
 * @author Dev Gui
 */
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "ping",
  description:
    "Verifica si el bot está en línea, el tiempo de respuesta y el tiempo de actividad.",
  commands: ["ping", "pong"],
  usage: `${PREFIX}ping`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendReact, startProcess, fullMessage }) => {
    const response = fullMessage.slice(1).startsWith("ping")
      ? "🏓 ¡Pong!"
      : "🏓 ¡Ping!";

    await sendReact("🏓");

    const uptime = process.uptime();

    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    const ping = Date.now() - startProcess;

    await sendReply(`${response}

📶 Velocidad de respuesta: ${ping}ms
⏱️ Tiempo de actividad: ${h}h ${m}m ${s}s`);
  },
};
