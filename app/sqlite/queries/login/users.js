//Consulta para los select del modulo de usuarios
const {
  openDatabase,
  showData,
  getRegister,
  first,
} = require("~/sqlite/openDatabase");
const moment = require("moment");
const { enc, SHA256 } = require("crypto-js");

const getUsers = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM users", []);
    const dataFormatted = await showData("users", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const showUser = async (user_id) => {
  try {
    const db = await openDatabase();
    const data = await db.get("SELECT * FROM users WHERE username = (?)", [
      user_id,
    ]);
    const dataFormatted = await first("users", data);
    if (Object.keys(dataFormatted).length > 0) {
      /* consulta para traer los modulos a los que tiene acceso */
      let modules = await db.all(
                                  `SELECT m.id, m.name_module, m.url,
                                            m.icon, m.description, m.date_creation
                                    FROM  module_user ms
                                    INNER JOIN modules m on m.id = ms.module_id
                                    WHERE ms.user_id = ?`,
                                    [dataFormatted.id]);
      const modulesFormatted = await showData(
        "modules",
        modules,
        ["id", "name", "url", "icon", "description", "date_creation"]
      );
      dataFormatted.modules = modulesFormatted;
    }
    /* dataFormatted.state = await bcrypt.compare(pass, dataFormatted.password); */
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const storeUsers = async (data) => {
  try {
    const db = await openDatabase();
    let postData = [];

    for (let i = 0; i < data.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO users (
                            first_name,
                            last_name,
                            username,
                            password,
                            date_creation)
        VALUES (?, ?, ?, ?, ?)`,
        [
          data[i].first_name,
          data[i].last_name,
          data[i].username,
          data[i].password,
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );
      if (data[i].modules.length > 0) {
        storeModuleUser({ user_id: postData[i], modules: data[i].modules });
      }
    }
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const storeModuleUser = async (data) => {
  try {
    const modules = data.modules;
    const db = await openDatabase();
    let postData = [];
    for (let i = 0; i < modules.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO module_user (
                            user_id,
                            module_id,
                            date_creation)
        VALUES (?, ?, ?)`,
        [
          data.user_id,
          modules[i].id,
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );
    }
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

module.exports = {
  getUsers,
  storeUsers,
  showUser,
};
