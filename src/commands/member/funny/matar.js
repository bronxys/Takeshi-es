import path from "node:path";
import { ASSETS_DIR, PREFIX } from "../../../config.js";
import { InvalidParameterError } from "../../../errors/index.js";
import { onlyNumbers } from "../../../utils/index.js";

export default {
  name: "matar",
  description: "Mata a un usuario deseado.",
  commands: ["matar", "mata"],
  usage: `${PREFIX}matar @usuario`,
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
        "Necesitas mencionar a un usuario o responder a un mensaje para matar.",
      );

      return;
    }

    const userNumber = onlyNumbers(userLid);
    const targetNumber = onlyNumbers(targetLid);

    await sendGifFromFile(
      path.resolve(ASSETS_DIR, "images", "funny", "yumeko-mirai-nikki.mp4"),
      `@${userNumber} ¡mató brutalmente a @${targetNumber}!`,
      [userLid, targetLid],
    );
  },
};
