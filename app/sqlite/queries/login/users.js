//Consulta para los select del modulo de usuarios
const { openDatabase, showData, getRegister, first } = require('~/sqlite/openDatabase');
const moment = require('moment');

const getUsers = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM users", []);
    const dataFormatted = await showData('users', data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const showUser = async (user_id) => {
  try {
    const db = await openDatabase();
    const data = await db.get("SELECT * FROM users WHERE username = (?)", [user_id]);
    const dataFormatted = await first('users', data)
    /* dataFormatted.state = await bcrypt.compare(pass, dataFormatted.password); */
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const storeUsers = async (data) => {
  try {
    const db = await openDatabase();
    let postData = []

    for (let i = 0; i < data.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO users (
                            first_name,
                            last_name,
                            username,
                            password,
                            date_creation)
        VALUES (?, ?, ?, ?, ?)`,
        [data[i].first_name, data[i].last_name, data[i].username,
        data[i].password, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
      );
    }

    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}

module.exports = {
  getUsers,
  storeUsers,
  showUser
}

