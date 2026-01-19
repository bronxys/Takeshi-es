import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import {
  activateWelcomeGroup,
  deactivateWelcomeGroup,
  isActiveWelcomeGroup,
} from "../../utils/database.js";

export default {
  name: "welcome",
  description: "Activa/desactiva la función de bienvenida en el grupo.",
  commands: ["welcome", "welkom", "welkon"],
  usage: `${PREFIX}welcome (1/0)`,
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

    const welcome = args[0] === "1";
    const notWelcome = args[0] === "0";

    if (!welcome && !notWelcome) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (activar o desactivar)!",
      );
    }

    const hasActive = welcome && isActiveWelcomeGroup(remoteJid);
    const hasInactive = notWelcome && !isActiveWelcomeGroup(remoteJid);

    if (hasActive || hasInactive) {
      throw new WarningError(
        `¡La función de bienvenida ya está ${
          welcome ? "activada" : "desactivada"
        }!`,
      );
    }

    if (welcome) {
      activateWelcomeGroup(remoteJid);
    } else {
      deactivateWelcomeGroup(remoteJid);
    }

    await sendSuccessReact();

    const context = welcome ? "activada" : "desactivada";

    await sendReply(`¡Función de bienvenida ${context} con éxito!`);
  },
};
