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
    const dataFormatted = await showData("ships", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const insertShip = async (data) => {
  try {
    const db = await openDatabase();
    let postData = db.execSQL(
      "INSERT INTO ships (name, journey) VALUES (?, ?)",
      [data.name, data.journey]
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

const storeShips = async (shipsWarehouses) => {
  try {
    const db = await openDatabase();
    let postWarehouse = [];
    let postData = [];
    let selects = [];
    for (let i = 0; i < shipsWarehouses.length; i++) {
      postData[i] = await db.execSQL(
        "INSERT INTO ships (id, name, journey) VALUES (?, ?, ?)",
        [
          shipsWarehouses[i].id,
          shipsWarehouses[i].name_ship,
          shipsWarehouses[i].journey,
        ]
      );
      for (let j = 0; j < shipsWarehouses[i].warehouses.length; j++) {
        postWarehouse[j] = db.execSQL(
          "INSERT INTO warehouses (name, warehouse_id, ship_id) VALUES (?, ?, ?)",
          [
            shipsWarehouses[i].warehouses[j].name_warehouse,
            shipsWarehouses[i].warehouses[j].id,
            shipsWarehouses[i].id,
          ]
        );
      }
    }
    return { postShip: postData, postWarehouse: postWarehouse };
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

module.exports = {
  getShips,
  insertShip,
  updateShip,
  deleteShip,
  storeShips
};
