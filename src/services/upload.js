/**
 * Servicios de subida de imagen y generación de enlace.
 *
 * @author Dev Gui
 */
const FormData = require("form-data");
const axios = require("axios");

exports.upload = async (imageBuffer, filename) => {
  try {
    if (!Buffer.isBuffer(imageBuffer)) {
      throw new Error("¡El primer parámetro debe ser un Buffer válido!");
    }

    if (typeof filename !== "string" || filename.trim() === "") {
      throw new Error("¡El segundo parámetro debe ser el nombre del archivo!");
    }

    if (imageBuffer.length === 0) {
      throw new Error("¡El búfer de la imagen está vacío!");
    }

    const API_KEY = "6d207e02198a847aa98d0a2a901485a5";
    const API_URL = "https://freeimage.host/api/1/upload";

    const formData = new FormData();
    formData.append("key", API_KEY);
    formData.append("action", "upload");
    formData.append("source", imageBuffer, {
      filename: filename,
      contentType: "image/jpeg",
    });
    formData.append("format", "json");

    const response = await axios.post(API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    const result = response.data;

    if (result.status_code !== 200) {
      throw new Error(
        `Error en la API: ${result.error?.message || "Error desconocido"}`
      );
    }

    return result.image.url;
  } catch (error) {
    console.error("Error en la subida de la imagen:", error.message);

    if (error.response) {
      return {
        success: false,
        error: `Error HTTP ${error.response.status}: ${error.response.statusText}`,
      };
    } else if (error.request) {
      return {
        success: false,
        error: "Error de red: No fue posible conectar con el servidor",
      };
    } else {
      return {
        success: false,
        error: error.message,
      };
    }
  }
};
