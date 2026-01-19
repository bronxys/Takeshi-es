import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import {
  activateOnlyAdmins,
  deactivateOnlyAdmins,
  isActiveOnlyAdmins,
} from "../../utils/database.js";

export default {
  name: "only-admin",
  description: "Permite que solo administradores utilicen mis comandos.",
  commands: [
    "only-admin",
    "only-adm",
    "only-administrator",
    "only-administrators",
    "only-admins",
    "so-adm",
    "so-admin",
    "so-administrador",
    "so-administradores",
    "so-admins",
  ],
  usage: `${PREFIX}only-admin 1`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ args, sendReply, sendSuccessReact, remoteJid }) => {
    if (!args.length) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (activar o desactivar)!",
      );
    }

    const onlyAdminOn = args[0] === "1";
    const onlyAdminOff = args[0] === "0";

    if (!onlyAdminOn && !onlyAdminOff) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (activar o desactivar)!",
      );
    }

    const hasActive = onlyAdminOn && isActiveOnlyAdmins(remoteJid);
    const hasInactive = onlyAdminOff && !isActiveOnlyAdmins(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `¡La función de solo administradores usar mis comandos ya está ${
          onlyAdminOn ? "activada" : "desactivada"
        }!`,
      );
    }

    if (onlyAdminOn) {
      activateOnlyAdmins(remoteJid);
    } else {
      deactivateOnlyAdmins(remoteJid);
    }

    await sendSuccessReact();

    const context = onlyAdminOn ? "activada" : "desactivada";

    await sendReply(
      `¡Función de solo administradores usar mis comandos ${context} con éxito!`,
    );
  },
};
