const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "send-text",
  description:
    "Ejemplo de cómo enviar mensajes de texto simples y con menciones",
  commands: ["send-text"],
  usage: `${PREFIX}send-text`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendText, sendReact, userJid }) => {
    await sendReact("💬");

    await delay(3000);

    await sendReply("Voy a demostrar diferentes formas de enviar texto");

    await delay(3000);

    await sendText("Este es un mensaje de texto simple usando sendText");

    await delay(3000);

    await sendText(
      `¡Hola! Este mensaje te menciona: @${userJid.split("@")[0]}`,
      [userJid]
    );

    await delay(3000);

    await sendReply("Esta es una respuesta usando sendReply");

    await delay(3000);

    await sendText(
      "¡Puedes usar *negrita*, _cursiva_, ~tachado~ y ```código``` en el texto!"
    );

    await delay(3000);

    await sendText(
      "📝 *Diferencias entre las funciones:*\n\n" +
        "• `sendText()` - Envía texto simple, con opción de mencionar usuarios\n" +
        "• `sendReply()` - Envía texto como respuesta al mensaje actual\n\n" +
        "¡Ambas soportan el formato de WhatsApp!"
    );
  },
};
