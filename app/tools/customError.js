// Crear una subclase personalizada de `Error` con código
export class CustomError extends Error {
  constructor(title, message, code) {
    super(message);  // Llamar al constructor de la clase base (Error)
    this.title = title;
    this.name = this.constructor.name;  // Asignar el nombre de la clase como el nombre del error
    this.code = code;  // Agregar el código personalizado
  }
}
