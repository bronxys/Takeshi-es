/**
 * Clase de error personalizada para errores críticos.
 *
 * @author Dev Gui
 */
class DangerError extends Error {
  constructor(message) {
    super(message);
    this.name = "DangerError";
  }
}

module.exports = {
  DangerError,
};
