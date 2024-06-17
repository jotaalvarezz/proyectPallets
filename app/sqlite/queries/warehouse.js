const {
  openDatabase,
  showData,
  getRegister,
  first,
} = require("~/sqlite/openDatabase");

const getWarehouses = async (ship_id) => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM warehouses WHERE ship_id = (?)", [
      ship_id,
    ]);
    const dataFormatted = await showData("warehouses", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const insertWarehuse = async (data) => {
  try {
    const db = await openDatabase();
    let postData = db.execSQL(
      "INSERT INTO warehouses (name, ship_id) VALUES (?, ?)",
      [data.name, data.ship_id]
    );
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const deleteWarehouse = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM warehouses WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

module.exports = {
  getWarehouses,
  insertWarehuse,
  deleteWarehouse
};
