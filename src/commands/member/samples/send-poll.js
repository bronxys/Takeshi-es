const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "send-poll",
  description: "Ejemplo de cómo enviar encuestas/votaciones en grupos",
  commands: ["send-poll"],
  usage: `${PREFIX}send-poll`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendPoll, sendReply, sendReact }) => {
    await sendReact("📊");

    await delay(2000);

    await sendPoll(
      "Encuesta de opción única: ¿Cuál es tu opción preferida?",
      [
        { optionName: "Opción 1" },
        { optionName: "Opción 2" },
        { optionName: "Opción 3" },
      ],
      true
    );

    await delay(2000);

    await sendPoll(
      "Encuesta de opción múltiple: ¿Qué comidas te gustan?",
      [
        { optionName: "Pizza 🍕" },
        { optionName: "Hamburguesa 🍔" },
        { optionName: "Sushi 🍣" },
        { optionName: "Ensalada 🥗" },
        { optionName: "Helado 🍦" },
      ],
      false
    );

    await delay(2000);

    await sendReply(
      "Puedes crear tus propias encuestas fácilmente usando la función sendPoll(title, options, singleChoice)."
    );
  },
};
