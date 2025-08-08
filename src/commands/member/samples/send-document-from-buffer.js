const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const path = require("node:path");
const fs = require("node:fs");
const { getBuffer } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "send-document-from-buffer",
  description: "Ejemplo de cómo enviar documentos desde buffers",
  commands: ["send-document-from-buffer"],
  usage: `${PREFIX}send-document-from-buffer`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendReact, socket, remoteJid, webMessage }) => {
    await sendReact("📄");

    await delay(3000);

    await sendReply(
      "Voy a enviar documentos desde buffers (archivo local y URL)"
    );

    await delay(3000);

    const fileBuffer = fs.readFileSync(
      path.join(ASSETS_DIR, "samples", "sample-document.pdf")
    );

    await socket.sendMessage(
      remoteJid,
      {
        document: fileBuffer,
        mimetype: "application/pdf",
        fileName: "documento-desde-buffer-local.pdf",
      },
      { quoted: webMessage }
    );

    await delay(3000);

    await sendReply("Ahora voy a enviar un documento desde un buffer de URL");

    await delay(3000);

    const urlBuffer = await getBuffer(
      "https://api.spiderx.com.br/storage/samples/sample-text.txt"
    );

    await socket.sendMessage(
      remoteJid,
      {
        document: urlBuffer,
        mimetype: "text/plain",
        fileName: "archivo-desde-buffer-url.txt",
      },
      { quoted: webMessage }
    );

    await delay(3000);

    await sendReply(
      "También puedes enviar documentos de buffer con mimetype predeterminado:"
    );

    await delay(3000);

    await socket.sendMessage(
      remoteJid,
      {
        document: fileBuffer,
        fileName: "documento-buffer-predeterminado.pdf",
      },
      { quoted: webMessage }
    );

    await delay(3000);

    await sendReply(
      "Para enviar documentos de buffer, usa socket.sendMessage() directamente con el buffer.\n\n" +
        "Esto es útil cuando tienes documentos procesados en memoria o necesitas manipular el archivo antes de enviar."
    );

    await delay(3000);

    await sendReply(
      "💡 *Consejo:* Los buffers son útiles para documentos generados dinámicamente o cuando necesitas procesar el archivo antes del envío."
    );
  },
};
