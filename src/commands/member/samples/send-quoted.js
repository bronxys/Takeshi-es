const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "send-quoted",
  description:
    "Ejemplo de diferentes tipos de respuestas (éxito, error, advertencia, espera)",
  commands: ["send-quoted"],
  usage: `${PREFIX}send-quoted`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendReply,
    sendSuccessReply,
    sendErrorReply,
    sendWarningReply,
    sendWaitReply,
    sendReact,
  }) => {
    await sendReact("💬");

    await delay(3000);

    await sendReply(
      "Voy a demostrar diferentes tipos de respuestas disponibles:"
    );

    await delay(3000);

    await sendSuccessReply("¡Este es un mensaje de éxito! ✅");

    await delay(3000);

    await sendErrorReply("¡Este es un mensaje de error! ❌");

    await delay(3000);

    await sendWarningReply("¡Este es un mensaje de advertencia! ⚠️");

    await delay(3000);

    await sendWaitReply("¡Este es un mensaje de espera! ⏳");

    await delay(3000);

    await sendReply("Y esta es una respuesta normal usando sendReply");

    await delay(3000);

    await sendReply(
      "📋 *Tipos de respuesta disponibles:*\n\n" +
        "• `sendReply()` - Respuesta normal\n" +
        "• `sendSuccessReply()` - Respuesta de éxito (con ✅)\n" +
        "• `sendErrorReply()` - Respuesta de error (con ❌)\n" +
        "• `sendWarningReply()` - Respuesta de advertencia (con ⚠️)\n" +
        "• `sendWaitReply()` - Respuesta de espera (con ⏳)\n\n" +
        "¡Usa cada una según el contexto apropiado!"
    );
  },
};
