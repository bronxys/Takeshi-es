import { PREFIX } from "../../config.js";
import { InvalidParameterError, WarningError } from "../../errors/index.js";
import {
  isActiveGroupRestriction,
  updateIsActiveGroupRestriction,
} from "../../utils/database.js";

export default {
  name: "anti-event",
  description:
    "Activa/desactiva la función anti-evento en el grupo, eliminando el mensaje de evento si está activo.",
  commands: ["anti-event", "anti-evento", "anti-eventos"],
  usage: `${PREFIX}anti-event (1/0)`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ remoteJid, isGroup, args, sendSuccessReply }) => {
    if (!isGroup) {
      throw new WarningError("¡Este comando solo debe usarse en grupos!");
    }

    if (!args.length) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (encender o apagar)!",
      );
    }

    const antiEventOn = args[0] == "1";
    const antiEventOff = args[0] == "0";

    if (!antiEventOn && !antiEventOff) {
      throw new InvalidParameterError(
        "¡Necesitas escribir 1 o 0 (encender o apagar)!",
      );
    }

    const hasActive =
      antiEventOn && isActiveGroupRestriction(remoteJid, "anti-event");

    const hasInactive =
      antiEventOff && !isActiveGroupRestriction(remoteJid, "anti-event");

    if (hasActive || hasInactive) {
      throw new WarningError(
        `¡La función anti-evento ya está ${
          antiEventOn ? "activada" : "desactivada"
        }!`,
      );
    }

    updateIsActiveGroupRestriction(remoteJid, "anti-event", antiEventOn);

    const status = antiEventOn ? "activada" : "desactivada";

    await sendSuccessReply(`¡Anti-evento ${status} con éxito!`);
  },
};
