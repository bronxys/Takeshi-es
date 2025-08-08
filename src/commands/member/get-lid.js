const { PREFIX } = require(`${BASE_DIR}/config`);
const { InvalidParameterError, WarningError } = require(`${BASE_DIR}/errors`);
const { onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "get-lid",
  description: "Devuelve el LID del contacto mencionado.",
  commands: ["get-lid"],
  usage: `${PREFIX}get-lid @etiqueta o +telefono`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendSuccessReply, socket }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "¡Debes mencionar a alguien o introducir un contacto!"
      );
    }

    const [result] = await socket.onWhatsApp(onlyNumbers(args[0]));

    if (!result) {
      throw new WarningError(
        "¡El número introducido no está registrado en WhatsApp!"
      );
    }

    const jid = result?.jid;
    const lid = result?.lid;

    await sendSuccessReply(`JID: ${jid}${lid ? `\nLID: ${lid}` : ""}`);
  },
};
