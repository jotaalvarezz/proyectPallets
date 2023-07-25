class Alert {
  static async confirmation() {
    const res = await confirm({
      title: "Actualizacion de registro",
      message: "Esta seguro que desea editar!",
      okButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });
    return res;
  }

  static async Danger() {
    const res = await confirm({
      title: "Eliminar registro",
      message: "Esta seguro que desea borrarlo!",
      okButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    });
    return res;
  }

  static async Promp(data){
    const res = await prompt({
      title: "Your dialog title",
      message: "Your message",
      okButtonText: "Your OK button text",
      cancelButtonText: "Your Cancel button text",
      defaultText: "Suggested user input",
    }).then(result => {
      console.log(`Dialog result: ${result.result}, text: ${result.text}`)
    });
  }

  static success(msg) {
    return alert({
      title: msg,
      message: msg+" Exitoso!!",
      okButtonText: "aceptar",
    });
  }

  static danger(msg, error) {
    return alert({
      title: "ERROR!!",
      message: msg+" "+error,
      okButtonText: "aceptar",
    });
  }

  static info(msg, number){
    switch(number){
      case 1:
        return alert({
          title: "Campo Vacio!!",
          message: msg,
          okButtonText: "aceptar",
        });
      break;

      case 2:
        return alert({
          title: "Pallet repetido!!",
          message: msg,
          okButtonText: "aceptar",
        });
      break;
    }
  }
}

export default Alert;
