const { imageAI } = require(`${BASE_DIR}/services/spider-x-api`);

const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "stable-diffusion-turbo",
  description: "Crea una imagen usando la IA Stable Diffusion Turbo",
  commands: [
    "stable-diffusion-turbo",
    "stable-dif-turbo",
    "stable-dif",
    "stable-diff-turbo",
    "stable-diff",
    "stable-diffusion",
    "stable-difusion-turbo",
    "stable-difusion",
  ],
  usage: `${PREFIX}stable-diffusion-turbo descripción`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    sendWaitReply,
    sendWarningReply,
    sendImageFromURL,
    sendSuccessReact,
    fullArgs,
  }) => {
    if (!args[0]) {
      return sendWarningReply(
        "Necesitas proporcionar una descripción para la imagen."
      );
    }

    await sendWaitReply("generando imagen...");

    const data = await imageAI("stable-diffusion-turbo", fullArgs);

    if (!data?.image) {
      return sendWarningReply(
        "¡No fue posible generar la imagen! Intenta nuevamente más tarde."
      );
    }

    await sendSuccessReact();
    await sendImageFromURL(data.image);
  },
};
