const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");

module.exports = {
  name: "get-group-data",
  description: "Ejemplo de cómo obtener información detallada del grupo",
  commands: ["get-group-data"],
  usage: `${PREFIX}get-group-data`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendReply,
    sendReact,
    sendErrorReply,
    getGroupMetadata,
    isGroup,
    socket,
    remoteJid,
  }) => {
    await sendReact("👥");

    await delay(3000);

    if (!isGroup) {
      return await sendErrorReply("¡Este comando solo funciona en grupos!");
    }

    await sendReply("Voy a obtener la información del grupo actual:");

    await delay(3000);

    try {
      const groupMetadata = await getGroupMetadata();

      const groupInfo = `👥 *Información del Grupo:*

📝 *Básico:*
• Nombre: ${groupMetadata.subject}
• Descripción: ${groupMetadata.desc || "Sin descripción"}
• ID: ${groupMetadata.id}

👤 *Participantes:*
• Total: ${groupMetadata.participants.length} miembros
• Admins: ${groupMetadata.participants.filter((p) => p.admin).length}
• Miembros: ${groupMetadata.participants.filter((p) => !p.admin).length}

⚙️ *Configuración:*
• Creado el: ${new Date(groupMetadata.creation * 1000).toLocaleDateString(
        "es-ES"
      )}
• Dueño: ${groupMetadata.owner || "N/A"}
• Solo admins pueden enviar: ${groupMetadata.announce ? "Sí" : "No"}
• Aprobación para unirse: ${groupMetadata.restrict ? "Sí" : "No"}`;

      await sendReply(groupInfo);

      await delay(3000);

      const admins = groupMetadata.participants.filter((p) => p.admin);

      if (admins.length > 0) {
        const adminList =
          `👑 *Administradores (${admins.length}):*\n\n` +
          admins
            .map(
              (admin, index) =>
                `${index + 1}. @${admin.id.split("@")[0]} ${
                  admin.admin === "superadmin" ? "(Creador)" : "(Admin)"
                }`
            )
            .join("\n");

        await socket.sendMessage(remoteJid, {
          text: adminList,
          mentions: admins.map((admin) => admin.id),
        });
      }

      await delay(3000);

      await sendReply(
        "💡 *Funciones útiles:*\n\n" +
          "• `socket.groupMetadata(jid) o getGroupMetadata()` - Obtiene metadatos del grupo\n" +
          "• `groupMetadata.participants` - Lista participantes\n" +
          "• `groupMetadata.subject` - Nombre del grupo\n" +
          "• `groupMetadata.desc` - Descripción del grupo"
      );
    } catch (error) {
      await sendErrorReply(
        `Error al obtener datos del grupo: ${error.message}`
      );
    }
  },
};
