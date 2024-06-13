const {
  openDatabase,
  showData,
  getRegister,
  first,
} = require("~/sqlite/openDatabase");

const getShips = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM ships", []);
    return data
    /* const dataFormatted = await showData("ships", data);
    return { data: dataFormatted }; */
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const insertShip = async (data) => {
  try {
    const db = await openDatabase();
    let postData = db.execSQL(
      "INSERT INTO ships (name, journey) VALUES (?, ?)",
      [data.nameShip, data.journey]
    );
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const updateShip = async (item) => {
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(
      `UPDATE ships
                                      SET journey = (?)
                                      WHERE id = (?)`,
      [item.journey, item.id]
    );
    return updateData;
  } catch (error) {
    console.error("Error al editar el barco ", error);
  }
};

const deleteShip = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM ships WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

module.exports = {
  getShips,
  insertShip,
  updateShip,
  deleteShip
};
