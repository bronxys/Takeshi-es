const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const path = require("node:path");
const fs = require("node:fs");
const { getBuffer } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "send-video-from-buffer",
  description: "Ejemplo de cómo enviar un video desde un buffer",
  commands: ["send-video-from-buffer"],
  usage: `${PREFIX}send-video-from-buffer`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendReact, sendVideoFromBuffer, userJid }) => {
    await sendReact("🎥");

    await delay(3000);

    await sendReply("Voy a enviar un video desde un buffer de archivo local");

    await delay(3000);

    const videoBuffer = fs.readFileSync(
      path.join(ASSETS_DIR, "samples", "sample-video.mp4")
    );

    await sendVideoFromBuffer(
      videoBuffer,
      "Aquí está el video del buffer local"
    );

    await delay(3000);

    await sendReply("Ahora voy a enviar un video desde un buffer de URL");

    await delay(3000);

    const urlBuffer = await getBuffer(
      "https://api.spiderx.com.br/storage/samples/sample-video.mp4"
    );

    await sendVideoFromBuffer(
      urlBuffer,
      "Aquí está el video del buffer de URL"
    );

    await delay(3000);

    await sendReply("También puedes enviar videos de buffer sin leyenda");

    await delay(3000);

    await sendVideoFromBuffer(videoBuffer);

    await delay(3000);

    await sendReply(
      "También videos de buffer con leyenda, mencionando al usuario:"
    );

    await delay(3000);

    await sendVideoFromBuffer(
      await getBuffer(
        "https://api.spiderx.com.br/storage/samples/sample-video.mp4"
      ),
      `¡Aquí está el video que pediste @${userJid.split("@")[0]}!`,
      [userJid]
    );

    await delay(3000);

    await sendReply(
      "Para enviar videos desde buffer, usa la función sendVideoFromBuffer(url, caption, [mentions], quoted).\n\n" +
        "Esto es útil cuando tienes videos alojados en línea u obtenidos de APIs."
    );
  },
};
