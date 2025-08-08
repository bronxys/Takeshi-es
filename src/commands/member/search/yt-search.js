const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);

const { search } = require(`${BASE_DIR}/services/spider-x-api`);

module.exports = {
  name: "yt-search",
  description: "Consulta YouTube",
  commands: ["yt-search", "Youtube"],
  usage: `${PREFIX}yt-search MC Hariel`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ fullArgs, sendSuccessReply }) => {
    if (fullArgs.length <= 1) {
      throw new InvalidParameterError(
        "Necesitas proporcionar una búsqueda para YouTube."
      );
    }

    const maxLength = 100;

    if (fullArgs.length > maxLength) {
      throw new InvalidParameterError(
        `El tamaño máximo de la búsqueda es de ${maxLength} caracteres.`
      );
    }

    const data = await search("youtube", fullArgs);

    if (!data) {
      throw new WarningError(
        "No se pudieron encontrar resultados para la búsqueda."
      );
    }

    let text = "";

    for (const item of data) {
      text += `Título: *${item.title}*\n\n`;
      text += `Duración: ${item.duration}\n\n`;
      text += `Publicado el: ${item.published_at}\n\n`;
      text += `Vistas: ${item.views}\n\n`;
      text += `URL: ${item.url}\n\n-----\n\n`;
    }

    text = text.slice(0, -2);

    await sendSuccessReply(`*Búsqueda realizada*

*Término*: ${fullArgs}
      
*Resultados*
${text}`);
  },
};
