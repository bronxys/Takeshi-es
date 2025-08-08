const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "group-functions",
  description: "Ejemplo de cómo usar las funciones utilitarias de grupo",
  commands: ["group-functions"],
  usage: `${PREFIX}group-functions`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendReply,
    sendReact,
    sendErrorReply,
    isGroup,
    getGroupMetadata,
    getGroupName,
    getGroupOwner,
    getGroupParticipants,
    getGroupAdmins,
    socket,
    remoteJid,
  }) => {
    await sendReact("👥");

    await delay(3000);

    if (!isGroup) {
      return await sendErrorReply("¡Este comando solo funciona en grupos!");
    }

    await sendReply("Voy a demostrar las funciones utilitarias de grupo:");

    await delay(3000);

    const groupName = await getGroupName();
    await sendReply(`📝 *Nombre del grupo:* ${groupName}`);

    await delay(3000);

    const groupOwner = await getGroupOwner();
    if (groupOwner) {
      await socket.sendMessage(remoteJid, {
        text: `👑 *Dueño del grupo:* @${groupOwner.split("@")[0]}`,
        mentions: [groupOwner],
      });
    }

    await delay(3000);

    const participants = await getGroupParticipants();
    await sendReply(`👤 *Total de participantes:* ${participants.length}`);

    await delay(3000);

    const admins = await getGroupAdmins();
    if (admins.length > 0) {
      const adminList = admins
        .map((admin) => `@${admin.split("@")[0]}`)
        .join(", ");
      await socket.sendMessage(remoteJid, {
        text: `👮 *Administradores (${admins.length}):*\n${adminList}`,
        mentions: admins,
      });
    } else {
      await sendReply("👮 *Ningún administrador encontrado.*");
    }

    await delay(3000);

    const metadata = await getGroupMetadata();
    if (metadata) {
      const creationDate = new Date(
        metadata.creation * 1000
      ).toLocaleDateString("es-ES");
      const announce = metadata.announce ? "Sí" : "No";
      const restrict = metadata.restrict ? "Sí" : "No";

      await sendReply(
        `📊 *Metadatos del grupo:*\n\n` +
          `• ID: ${metadata.id}\n` +
          `• Creado el: ${creationDate}\n` +
          `• Solo admins envían: ${announce}\n` +
          `• Aprobación para unirse: ${restrict}\n` +
          `• Descripción: ${metadata.desc || "Sin descripción"}`
      );
    }

    await delay(3000);

    await sendReply(
      "💡 *Funciones disponibles:*\n\n" +
        "• `getGroupMetadata(remoteJid?)` - Metadatos completos\n" +
        "• `getGroupName(remoteJid?)` - Nombre del grupo\n" +
        "• `getGroupOwner(remoteJid?)` - Dueño del grupo\n" +
        "• `getGroupParticipants(remoteJid?)` - Lista de participantes\n" +
        "• `getGroupAdmins(remoteJid?)` - Lista de administradores\n\n" +
        "🔧 *Parámetro opcional:*\n" +
        "• `remoteJid` - ID del grupo/conversación (si no se proporciona, usa el grupo actual)"
    );
  },
};
