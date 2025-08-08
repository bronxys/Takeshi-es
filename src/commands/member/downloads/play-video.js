const { PREFIX } = require(`${BASE_DIR}/config`);
const { play } = require(`${BASE_DIR}/services/spider-x-api`);
const { InvalidParameterError } = require(`${BASE_DIR}/errors`);

module.exports = {
  name: "play-video",
  description: "Descargo videos",
  commands: ["play-video", "pv"],
  usage: `${PREFIX}play-video MC Hariel`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendVideoFromURL,
    sendImageFromURL,
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendErrorReply,
  }) => {
    if (!fullArgs.length) {
      throw new InvalidParameterError("¡Necesitas decirme qué quieres buscar!");
    }

    if (fullArgs.includes("http://") || fullArgs.includes("https://")) {
      throw new InvalidParameterError(
        `¡No puedes usar enlaces para descargar videos! Usa ${PREFIX}yt-mp4 enlace`
      );
    }

    await sendWaitReact();

    try {
      const data = await play("video", fullArgs);

      if (!data) {
        await sendErrorReply("¡No se encontraron resultados!");
        return;
      }

      await sendSuccessReact();

      await sendImageFromURL(
        data.thumbnail,
        `*Título*: ${data.title}
        
*Descripción*: ${data.description}
*Duración en segundos*: ${data.total_duration_in_seconds}
*Canal*: ${data.channel.name}`
      );

      await sendVideoFromURL(data.url);
    } catch (error) {
      console.log(error);
      await sendErrorReply(JSON.stringify(error.message));
    }
  },
};
