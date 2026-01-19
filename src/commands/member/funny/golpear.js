import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "golpear",
  description: "Golpea a un usuario con un puñetazo.",
  commands: ["golpear", "soca", "soco", "socao"],
  usage: `${PREFIX}socar @usuario`,
  /**
   * @param {CommandHandleProps} props
   */
  handle: async ({
    sendGifFromFile,
    sendErrorReply,
    userLid,
    replyLid,
    args,
    isReply,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "¡Necesitas mencionar o marcar a un miembro!",
      );
    }

    const targetLid = isReply
      ? replyLid
      : args[0]
        ? `${onlyNumbers(args[0])}@lid`
        : null;

    if (!targetLid) {
      await sendErrorReply(
        "Necesitas mencionar a un usuario o responder a un mensaje para darle un puñetazo.",
      );

      return;
    }

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    await sendGifFromFile(
      path.resolve(
        ASSETS_DIR,
        "images",
        "funny",
        "some-guy-getting-punch-anime-punching-some-guy-anime.mp4",
      ),
      `@${userNumber} ¡le dio un puñetazo bombástico a @${targetNumber}!`,
      [userLid, targetLid],
    );
  },
};
