export class Configuration {
  static url = process.env.VUE_APP_API_URL;

  static getUsers(){
    return this.url.concat("/wsp_users")
  }

  static getShips(){
    return this.url.concat("/ships");
  }

  static getModules(){
    return this.url.concat("/wsp_modules");
  }

  static getSelectEvidences(){
    return this.url.concat("/selects_evidence");
  }

  static getPrefixes(){
    return this.url.concat("/prefixes")
  }
}
