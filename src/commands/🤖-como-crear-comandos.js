/**
 * Este es un modelo de comando.
 * Copia y pega este archivo para crear un nuevo comando en una de las carpetas: admin, member u owner
 * Debes renombrarlo para que sea fácil de identificar en la carpeta de destino.
 *
 * Carpeta owner: Comandos que solo pueden ser ejecutados por el dueño del grupo/bot
 * Carpeta admin: Comandos que solo pueden ser ejecutados por administradores del grupo
 * Carpeta member: Comandos que pueden ser ejecutados por cualquier miembro del grupo
 *
 * Funciones y variables que pueden extraerse de handle en "handle: async ({ aquí })"
 * Lo que puedes extraer de handle está definido en src/@types/index.d.ts
 * ¡Cuidado, respeta mayúsculas y minúsculas!
 *
 * @author Dev Gui
 */
const { PREFIX } = require(`${BASE_DIR}/config`);

module.exports = {
  name: "comando",
  description: "Descripción del comando",
  commands: ["comando1", "comando2"],
  usage: `${PREFIX}comando`,
  /**
   * @param {CommandHandleProps} props
   * @returns {Promise<void>}
   */
  handle: async ({ sendAudioFromBuffer }) => {
    // código del comando
  },
};
