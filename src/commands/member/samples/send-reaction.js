const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "send-reaction",
  description: "Ejemplo de diferentes tipos de reacciones (emojis)",
  commands: ["send-reaction"],
  usage: `${PREFIX}send-reaction`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendReply,
    sendReact,
    sendSuccessReact,
    sendErrorReact,
    sendWarningReact,
    sendWaitReact,
  }) => {
    await sendReply(
      "Voy a demostrar diferentes tipos de reacciones disponibles:"
    );

    await delay(2000);

    await sendReply("Reacción personalizada:");
    await sendReact("🎉");

    await delay(2000);

    await sendReply("Reacción de éxito:");
    await sendSuccessReact();

    await delay(2000);

    await sendReply("Reacción de error:");
    await sendErrorReact();

    await delay(2000);

    await sendReply("Reacción de advertencia:");
    await sendWarningReact();

    await delay(2000);

    await sendReply("Reacción de espera:");
    await sendWaitReact();

    await delay(2000);

    await sendReply("Probando una secuencia de reacciones:");

    await sendReact("1️⃣");
    await delay(1000);
    await sendReact("2️⃣");
    await delay(1000);
    await sendReact("3️⃣");
    await delay(1000);
    await sendReact("🎯");

    await delay(2000);

    await sendReply(
      "🎭 *Tipos de reacción disponibles:*\n\n" +
        "• `sendReact(emoji)` - Reacción personalizada\n" +
        "• `sendSuccessReact()` - Reacción de éxito (✅)\n" +
        "• `sendErrorReact()` - Reacción de error (❌)\n" +
        "• `sendWarningReact()` - Reacción de advertencia (⚠️)\n" +
        "• `sendWaitReact()` - Reacción de espera (⏳)\n\n" +
        "¡Las reacciones son útiles para dar retroalimentación rápida al usuario!"
    );
  },
};
