const { PREFIX } = require(`${BASE_DIR}/config`);
const { delay } = require("baileys");
const { onlyNumbers } = require(`${BASE_DIR}/utils`);

module.exports = {
  name: "get-message-data",
  description:
    "Ejemplo avanzado de cómo obtener información detallada del mensaje actual o mensaje citado, incluyendo análisis de medios, menciones y metadatos técnicos",
  commands: ["get-message-data", "metadados", "info-msg"],
  usage: `${PREFIX}get-message-data [responde un mensaje para obtener sus metadatos detallados]`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({
    sendReply,
    sendReact,
    sendText,
    webMessage,
    userJid,
    remoteJid,
    isGroup,
    isImage,
    isVideo,
    isSticker,
    isReply,
    fullMessage,
    commandName,
    args,
    fullArgs,
    prefix,
    replyJid,
    getGroupMetadata,
  }) => {
    await sendReply(JSON.stringify(webMessage, null, 2));

    await delay(2000);

    await sendReact("📊");

    await delay(2000);

    await sendReply("🔍 Obteniendo metadatos del mensaje...");

    let targetMessage = webMessage;
    let isAnalyzingReply = false;

    if (
      isReply &&
      webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
    ) {
      targetMessage = {
        ...webMessage,
        message:
          webMessage.message.extendedTextMessage.contextInfo.quotedMessage,
        key: {
          ...webMessage.key,
          participant:
            webMessage.message.extendedTextMessage.contextInfo.participant ||
            replyJid,
          id: webMessage.message.extendedTextMessage.contextInfo.stanzaId,
        },
        messageTimestamp:
          webMessage.message.extendedTextMessage.contextInfo.quotedMessage
            .messageTimestamp || webMessage.messageTimestamp,
        pushName:
          webMessage.message.extendedTextMessage.contextInfo.pushName ||
          "Usuario",
      };
      isAnalyzingReply = true;
    }

    const analysisType = isAnalyzingReply ? "mensaje citado" : "mensaje actual";
    await sendReply(`🔍 Analizando metadatos del *${analysisType}*:`);

    await delay(2000);

    const targetUserJid = isAnalyzingReply ? replyJid : userJid;
    const targetUserNumber = onlyNumbers(targetUserJid);

    const messageText = isAnalyzingReply
      ? getMessageText(targetMessage)
      : fullMessage;
    const messageType = getAdvancedMessageType(
      targetMessage,
      isAnalyzingReply,
      {
        isImage: isAnalyzingReply
          ? getMediaType(targetMessage) && targetMessage.message.imageMessage
          : isImage,
        isVideo: isAnalyzingReply
          ? getMediaType(targetMessage) && targetMessage.message.videoMessage
          : isVideo,
        isSticker: isAnalyzingReply
          ? getMediaType(targetMessage) && targetMessage.message.stickerMessage
          : isSticker,
      }
    );
    const mediaInfo = getEnhancedMediaInfo(targetMessage, isAnalyzingReply);
    const messageFlags = getMessageFlags(targetMessage, isAnalyzingReply, {
      isImage: isAnalyzingReply
        ? getMediaType(targetMessage) && targetMessage.message.imageMessage
        : isImage,
      isVideo: isAnalyzingReply
        ? getMediaType(targetMessage) && targetMessage.message.videoMessage
        : isVideo,
      isSticker: isAnalyzingReply
        ? getMediaType(targetMessage) && targetMessage.message.stickerMessage
        : isSticker,
    });

    const basicInfo = `📋 *Información del ${
      analysisType.charAt(0).toUpperCase() + analysisType.slice(1)
    }:*

🆔 *Identificación:*
• Usuario: @${targetUserNumber}
• JID: \`${targetUserJid}\`
• Chat: \`${remoteJid}\`
• ID del mensaje: \`${targetMessage.key?.id || "N/A"}\`
• Marca de tiempo: ${new Date(
      (targetMessage.messageTimestamp || 0) * 1000
    ).toLocaleString("es-ES")}

📱 *Contexto:*
• Es grupo: ${isGroup ? "Sí" : "No"}
• Tipo de mensaje: ${messageType}
• Nombre del remitente: ${targetMessage.pushName || "N/A"}
• Enviado por el bot: ${targetMessage.key?.fromMe ? "Sí" : "No"}
• Es difusión: ${targetMessage.broadcast ? "Sí" : "No"}

🏷️ *Banderas de medios:*
${messageFlags}`;

    await sendText(basicInfo, [targetUserJid]);

    await delay(3000);

    const contentInfo = `💬 *Contenido del Mensaje:*

📝 *Texto:*
${messageText ? `"${messageText}"` : "Sin texto"}

🎯 *Detalles del Tipo:*
${mediaInfo}

⚡ *Datos del Comando Actual:*
• Nombre: ${commandName}
• Prefijo: ${prefix}
• Argumentos: ${args.length > 0 ? args.join(", ") : "Ninguno"}
• Args completos: ${fullArgs || "Ninguno"}
• Es respuesta: ${isReply ? "Sí" : "No"}`;

    await sendReply(contentInfo);

    await delay(3000);

    if (isGroup) {
      try {
        const groupMetadata = await getGroupMetadata();
        const participant = groupMetadata?.participants?.find(
          (p) => p.id === targetUserJid
        );

        const groupInfo = `👥 *Información del Grupo:*

📊 *Participante:*
• Estado: ${participant?.admin ? `Admin (${participant.admin})` : "Miembro"}
• Nombre del grupo: ${groupMetadata?.subject || "N/A"}
• Total de participantes: ${groupMetadata?.participants?.length || 0}

🔧 *Configuración:*
• Solo admins: ${groupMetadata?.announce ? "Sí" : "No"}
• Aprobación para unirse: ${groupMetadata?.restrict ? "Sí" : "No"}`;

        await sendReply(groupInfo);
        await delay(3000);
      } catch (error) {
        console.error("Error al obtener metadatos del grupo:", error);
      }
    }

    if (isReply) {
      const quotedMentions =
        webMessage.message?.extendedTextMessage?.contextInfo?.quotedMessage
          ?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const replyInfo = `🔗 *Información de Respuesta:*

📎 *Contexto:*
• Respondiendo a: @${onlyNumbers(replyJid)}
• ID del mensaje original: \`${
        webMessage.message?.extendedTextMessage?.contextInfo?.stanzaId || "N/A"
      }\`
• Analizando: ${isAnalyzingReply ? "Mensaje citado" : "Tu mensaje de comando"}
• Menciones en el mensaje citado: ${
        quotedMentions.length > 0
          ? `${quotedMentions.length} usuario(s)`
          : "Ninguna"
      }

🔍 *Análisis Detallado:*
• Tipo del mensaje citado: ${getMessageType(targetMessage)}
• Tiene multimedia: ${getMediaType(targetMessage) ? "Sí" : "No"}
• Fecha del mensaje citado: ${new Date(
        (targetMessage.messageTimestamp || 0) * 1000
      ).toLocaleString("es-ES")}`;

      await sendText(replyInfo, [replyJid]);
      await delay(3000);
    }

    await delay(3000);

    await sendReply(
      `💡 *Consejos de Uso:*

🎯 *Para desarrolladores:*
• Usa \`isReply\` para detectar respuestas
• \`replyJid\` contiene el JID del usuario citado
• \`webMessage.message.extendedTextMessage.contextInfo\` tiene datos del mensaje citado
• \`getGroupMetadata()\` proporciona información detallada del grupo

🔄 *Experimenta:*
• Responde un mensaje con este comando
• Úsalo en diferentes tipos de medios
• Prueba en grupos y conversaciones privadas`
    );
  },
};

function getMessageText(message) {
  const msg = message.message;
  if (!msg) return null;

  return (
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    msg.documentMessage?.caption ||
    msg.audioMessage?.caption ||
    null
  );
}

function getAdvancedMessageType(message, isAnalyzingReply, systemFlags = {}) {
  const msg = message.message;
  if (!msg) return "Desconocido";

  const basicType = getMessageType(message);

  let typeDetails = basicType;

  if (msg.extendedTextMessage?.contextInfo?.quotedMessage) {
    typeDetails += " (con cita)";
  }

  if (msg.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    typeDetails += " (con menciones)";
  }

  if (
    systemFlags.isImage ||
    msg.imageMessage?.isGif ||
    msg.videoMessage?.gifPlayback
  ) {
    if (msg.imageMessage?.isGif || msg.videoMessage?.gifPlayback) {
      typeDetails += " (GIF)";
    }
  }

  if (msg.audioMessage?.ptt) {
    typeDetails = "Audio (nota de voz)";
  }

  const flags = [];
  if (systemFlags.isImage && !isAnalyzingReply) flags.push("📸");
  if (systemFlags.isVideo && !isAnalyzingReply) flags.push("🎥");
  if (systemFlags.isSticker && !isAnalyzingReply) flags.push("🏷️");

  if (flags.length > 0) {
    typeDetails += ` ${flags.join("")}`;
  }

  return typeDetails;
}

function getEnhancedMediaInfo(message) {
  const msg = message.message;
  if (!msg) return "Sin medios";

  if (msg.imageMessage) {
    const isGif = msg.imageMessage.isGif ? " (GIF)" : "";
    return `📸 Imagen${isGif}
• Tamaño: ${formatFileSize(msg.imageMessage.fileLength)}
• Dimensiones: ${msg.imageMessage.width || "N/A"}x${
      msg.imageMessage.height || "N/A"
    }
• Mimetype: ${msg.imageMessage.mimetype || "N/A"}
• SHA256: ${msg.imageMessage.fileSha256 ? "✅" : "❌"}
• Leyenda: ${msg.imageMessage.caption || "Sin leyenda"}`;
  }

  if (msg.videoMessage) {
    const isGif = msg.videoMessage.gifPlayback ? " (GIF)" : "";
    return `🎥 Video${isGif}
• Tamaño: ${formatFileSize(msg.videoMessage.fileLength)}
• Duración: ${msg.videoMessage.seconds || "N/A"}s
• Dimensiones: ${msg.videoMessage.width || "N/A"}x${
      msg.videoMessage.height || "N/A"
    }
• Mimetype: ${msg.videoMessage.mimetype || "N/A"}
• SHA256: ${msg.videoMessage.fileSha256 ? "✅" : "❌"}
• Leyenda: ${msg.videoMessage.caption || "Sin leyenda"}`;
  }

  if (msg.audioMessage) {
    const isPtt = msg.audioMessage.ptt ? " (Nota de voz)" : "";
    return `🔊 Audio${isPtt}
• Tamaño: ${formatFileSize(msg.audioMessage.fileLength)}
• Duración: ${msg.audioMessage.seconds || "N/A"}s
• Mimetype: ${msg.audioMessage.mimetype || "N/A"}
• SHA256: ${msg.audioMessage.fileSha256 ? "✅" : "❌"}
• Waveform: ${msg.audioMessage.waveform ? "✅" : "❌"}`;
  }

  if (msg.documentMessage) {
    return `📄 Documento
• Nombre: ${msg.documentMessage.fileName || "N/A"}
• Tamaño: ${formatFileSize(msg.documentMessage.fileLength)}
• Mimetype: ${msg.documentMessage.mimetype || "N/A"}
• SHA256: ${msg.documentMessage.fileSha256 ? "✅" : "❌"}
• Páginas: ${msg.documentMessage.pageCount || "N/A"}`;
  }

  if (msg.stickerMessage) {
    const isAnimated = msg.stickerMessage.isAnimated ? " (Animado)" : "";
    return `🏷️ Sticker${isAnimated}
• Tamaño: ${formatFileSize(msg.stickerMessage.fileLength)}
• Dimensiones: ${msg.stickerMessage.width || "N/A"}x${
      msg.stickerMessage.height || "N/A"
    }
• Mimetype: ${msg.stickerMessage.mimetype || "N/A"}
• SHA256: ${msg.stickerMessage.fileSha256 ? "✅" : "❌"}`;
  }

  if (msg.contactMessage) {
    return `👤 Contacto
• Nombre: ${msg.contactMessage.displayName || "N/A"}
• VCard: ${msg.contactMessage.vcard ? "✅" : "❌"}`;
  }

  if (msg.locationMessage) {
    return `📍 Ubicación
• Latitud: ${msg.locationMessage.degreesLatitude || "N/A"}
• Longitud: ${msg.locationMessage.degreesLongitude || "N/A"}
• Nombre: ${msg.locationMessage.name || "N/A"}
• Dirección: ${msg.locationMessage.address || "N/A"}`;
  }

  return "Texto sin medios";
}

function getMessageFlags(message) {
  const msg = message.message;
  if (!msg) return "Ninguna bandera detectada";

  const flags = [];

  if (msg.imageMessage) flags.push("📸 Imagen");
  if (msg.videoMessage) flags.push("🎥 Video");
  if (msg.audioMessage) flags.push("🔊 Audio");
  if (msg.documentMessage) flags.push("📄 Documento");
  if (msg.stickerMessage) flags.push("🏷️ Sticker");
  if (msg.contactMessage) flags.push("👤 Contacto");
  if (msg.locationMessage) flags.push("📍 Ubicación");

  if (msg.imageMessage?.isGif || msg.videoMessage?.gifPlayback)
    flags.push("🎭 GIF");
  if (msg.audioMessage?.ptt) flags.push("🎤 Nota de voz");
  if (msg.stickerMessage?.isAnimated) flags.push("✨ Sticker animado");

  if (msg.extendedTextMessage?.contextInfo?.quotedMessage)
    flags.push("💬 Con cita");
  if (msg.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
    flags.push(
      `👥 ${msg.extendedTextMessage.contextInfo.mentionedJid.length} mención(es)`
    );
  }

  if (message.key?.fromMe) flags.push("🤖 Enviado por el bot");
  if (message.broadcast) flags.push("📡 Difusión");

  return flags.length > 0 ? flags.join("\n• ") : "Ninguna bandera especial";
}

function formatFileSize(bytes) {
  if (!bytes) return "N/A";

  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

function getMessageType(message) {
  const msg = message.message;
  if (!msg) return "Desconocido";

  if (msg.conversation) return "Texto simple";
  if (msg.extendedTextMessage) return "Texto extendido";
  if (msg.imageMessage) return "Imagen";
  if (msg.videoMessage) return "Video";
  if (msg.audioMessage) return "Audio";
  if (msg.documentMessage) return "Documento";
  if (msg.stickerMessage) return "Sticker";
  if (msg.locationMessage) return "Ubicación";
  if (msg.contactMessage) return "Contacto";

  return Object.keys(msg)[0] || "Desconocido";
}

function getMediaType(message) {
  const msg = message.message;
  if (!msg) return false;

  return !!(
    msg.imageMessage ||
    msg.videoMessage ||
    msg.audioMessage ||
    msg.documentMessage ||
    msg.stickerMessage
  );
}
