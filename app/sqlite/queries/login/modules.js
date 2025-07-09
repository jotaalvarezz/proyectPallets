const {
  openDatabase,
  showData,
  getRegister,
  first,
} = require("~/sqlite/openDatabase");
const moment = require("moment");

const storeModules = async (data) => {
  try {
    const db = await openDatabase();
    let postData = [];

    for (let i = 0; i < data.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO modules (
                            id,
                            name_module,
                            url,
                            icon,
                            movil_id,
                            description,
                            date_creation)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          data[i].id,
          data[i].name_module,
          data[i].url,
          data[i].icon,
          data[i].movil_id,
          data[i].description,
          moment(data[i].created_at).format("YYYY-MM-DD HH:mm:ss")
        ]
      );
    }

    return postData;
  } catch (error) {
    return {
      title:"ERROR",
      message:"Ocurrio un poblema guardar los modulos. \n"+error.message,
      code:406
    }
  }
};

const getModules = async () => {
  try {
    const db = await openDatabase()
    const modules = await db.all("SELECT * FROM modules", []);
    const dataFormatted = await showData("modules", modules)
    return {data: dataFormatted}
  } catch (error) {
    console.log("Error a consultar los usuarios ",error)
  }
}

module.exports = {
  storeModules,
  getModules
};
