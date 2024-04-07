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

  static async Danger(number) {
    let res = ''
    switch (number){
      case 1:
        res = await confirm({
          title: "Eliminar registro",
          message: "Esta seguro que desea borrarlo!",
          okButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
        });
        return res;
      break;

      case 2:
        res = await confirm({
          title: "Actualizar aplicacion",
          message: `Tenga en cuenta que esta opcion solo debe utilizarse antes de empezar la operacion en el barco.
                    \n* Por favor verifique que de ser el caso, haya realizado la sincronizacion de la informacion con MCP.
                    \n* Nota: Se realizara un reseteo y de borraran los pallets escaneados de forma permanente!!`,
          okButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
        });
        return res;
      break;
    }
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

  static async info(msg, number, title = "Campo Vacio!!"){
    let res = ''
    switch(number){
      case 1:
        return alert({
          title: title,
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
      case 3:
        res = await confirm({
          title: "Seguir",
          message: msg,
          okButtonText: "Aceptar",
          cancelButtonText: "Cancelar",
        });
        return res;
    }
  }
}

export default Alert;
