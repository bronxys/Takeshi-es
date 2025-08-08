const { PREFIX } = require(`${BASE_DIR}/config`);
const { gemini } = require(`${BASE_DIR}/services/spider-x-api`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "gemini",
  description: "¡Usa la inteligencia artificial de Google Gemini!",
  commands: ["gemini", "takeshi"],
  usage: `${PREFIX}gemini ¿con cuántos palos se hace una canoa?`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendSuccessReply, sendWaitReply, args }) => {
    const text = args[0];

    if (!text) {
      throw new InvalidParameterError("¡Necesitas decirme qué debo responder!");
    }

    await sendWaitReply();

    const responseText = await gemini(text);

    await sendSuccessReply(responseText);
  },
};
