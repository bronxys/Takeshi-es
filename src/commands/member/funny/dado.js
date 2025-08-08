/**
 * Desenvolvido por: Mkg
 * Refatorado por: Dev Gui
 *
 * @author Dev Gui
 */
const { delay } = require("baileys");

const { getRandomNumber } = require(`${BASE_DIR}/utils`);

const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { DangerError } = require(`${BASE_DIR}/errors`);
const path = require("node:path");

module.exports = {
  name: "dado",
  description:
    "¡Lanza un dado del 1 al 6 e intenta acertar el número para ganar!",
  commands: ["dado", "dice"],
  usage: `${PREFIX}dado número`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    args,
    sendWaitReply,
    sendReply,
    sendStickerFromURL,
    sendReact,
    webMessage,
  }) => {
    const number = parseInt(args[0]);

    if (!number || number < 1 || number > 6) {
      throw new DangerError(
        `¡Por favor, elige un número entre 1 y 6!\nEjemplo: ${PREFIX}dado 3`
      );
    }

    await sendWaitReply("🎲 Tirando el dado...");

    const result = getRandomNumber(1, 6);

    const pushName = webMessage?.pushName || "Usuário";

    await sendStickerFromURL(
      path.resolve(ASSETS_DIR, "stickers", "dice", `${result}.webp`)
    );

    await delay(2000);

    if (number === result) {
      await sendReact("🏆");
      await sendReply(
        `🎉 *${pushName} ¡GANÓ!* Apostaste al número *${number}* y el dado cayó en *${result}*! 🍀`
      );
    } else {
      await sendReact("😭");
      await sendReply(
        `💥 *${pushName} PERDIÓ...* Apostaste al *${number}* pero el dado cayó en *${result}*! Intenta de nuevo.`
      );
    }
  },
};
