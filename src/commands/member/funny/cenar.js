import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "cenar",
  description: "Invita a un usuario a cenar.",
  commands: ["cenar", "janta"],
  usage: `${PREFIX}jantar @usuario`,
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
        "Necesitas mencionar a un usuario o responder a un mensaje para cenar.",
      );

      return;
    }

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "gintama-gintoki.mp4"),
      `@${userNumber} ¡fue a una cena con @${targetNumber}!`,
      [userLid, targetLid],
    );
  },
};
