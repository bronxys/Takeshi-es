const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const fs = require("node:fs");
const path = require("node:path");
const { getBuffer } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "send-audio-from-buffer",
  description: "Ejemplo de cómo enviar un audio a través de un buffer",
  commands: ["send-audio-from-buffer"],
  usage: `${PREFIX}send-audio-from-buffer`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendAudioFromBuffer, sendReact }) => {
    await sendReact("🔈");

    await delay(3000);

    await sendReply(
      "Voy a enviar un audio desde un buffer extraído de una URL, lo enviaré como reproducción de archivo."
    );

    await delay(3000);

    await sendAudioFromBuffer(
      await getBuffer(
        "https://api.spiderx.com.br/storage/samples/sample-audio.mp3"
      )
    );

    await delay(3000);

    await sendReply(
      "Ahora enviaré un audio desde un buffer extraído de un archivo, pero como si yo hubiera grabado el audio."
    );

    await delay(3000);

    await sendAudioFromBuffer(
      fs.readFileSync(path.join(ASSETS_DIR, "samples", "sample-audio.mp3")),
      true
    );

    await delay(3000);

    await sendReply(
      "Ahora enviaré un audio desde un buffer extraído de un archivo, pero sin mencionar encima de tu mensaje."
    );

    await delay(3000);

    await sendAudioFromBuffer(
      fs.readFileSync(path.join(ASSETS_DIR, "samples", "sample-audio.mp3")),
      false,
      false
    );

    await delay(3000);

    await sendReply(
      "Y finalmente, enviaré un audio desde un buffer extraído de una URL, como si yo lo hubiera grabado, pero sin mencionar encima de tu mensaje."
    );

    await delay(3000);

    await sendAudioFromBuffer(
      await getBuffer(
        "https://api.spiderx.com.br/storage/samples/sample-audio.mp3"
      ),
      true,
      false
    );
  },
};
