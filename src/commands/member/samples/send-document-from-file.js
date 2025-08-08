const { PREFIX, ASSETS_DIR } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const path = require("node:path");

module.exports = {
  name: "send-document-from-file",
  description: "Ejemplo de cómo enviar documentos desde archivos locales",
  commands: ["send-document-from-file"],
  usage: `${PREFIX}send-document-from-file`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendReply, sendDocumentFromFile, sendReact }) => {
    await sendReact("📄");

    await delay(3000);

    await sendReply(
      "Voy a enviar diferentes tipos de documentos desde archivos locales"
    );

    await delay(3000);

    await sendDocumentFromFile(
      path.join(ASSETS_DIR, "samples", "sample-document.pdf"),
      "application/pdf",
      "documento-ejemplo.pdf"
    );

    await delay(3000);

    await sendDocumentFromFile(
      path.join(ASSETS_DIR, "samples", "sample-text.txt"),
      "text/plain",
      "archivo-texto-ejemplo.txt"
    );

    await delay(3000);

    await sendDocumentFromFile(
      path.join(ASSETS_DIR, "samples", "sample-document.txt"),
      "text/plain",
      "otro-documento.txt"
    );

    await delay(3000);

    await sendReply(
      "También puedes enviar documentos con mimetype predeterminado:"
    );

    await delay(3000);

    await sendDocumentFromFile(
      path.join(ASSETS_DIR, "samples", "sample-document.pdf")
    );

    await delay(3000);

    await sendReply(
      "Para enviar documentos desde un archivo, usa la función sendDocumentFromFile(filePath, mimetype, fileName).\n\n" +
        "Esto es útil cuando tienes documentos almacenados localmente en el servidor."
    );

    await delay(3000);

    await sendReply(
      "💡 *Consejo:* Puedes especificar el mimetype para diferentes tipos: PDF, TXT, DOC, XLS, etc."
    );
  },
};
