/**
 * Clase de error personalizada para
 * parámetros no válidos.
 *
 * @author Dev Gui
 */
class InvalidParameterError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidParameterError";
  }
}

module.exports = {
  InvalidParameterError,
};
