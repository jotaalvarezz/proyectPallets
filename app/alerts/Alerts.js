class Alert{
  static async confirmation(){
    const res = await confirm(
      {
        title: "Actualizacion de registro",
        message: "Esta seguro que desea editar!",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }
    )
    return res
  }

  static async Danger(){
    const res = await confirm(
      {
        title: "Eliminar registro",
        message: "Esta seguro que desea borrarlo!",
        okButtonText: "Aceptar",
        cancelButtonText: "Cancelar"
      }
    )
    return res
  }
}

export default Alert;
