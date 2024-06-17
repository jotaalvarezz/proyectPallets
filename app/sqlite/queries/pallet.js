const {
  openDatabase,
  showData,
  getRegister,
  first,
} = require("~/sqlite/openDatabase");

const getPallets = async (warehouse_id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      "SELECT * FROM pallets WHERE warehouse_id = (?)",
      [warehouse_id]
    );
    const dataFormatted = await showData("pallets", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getPalletsAll = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM pallets", []);
    const dataFormatted = await showData("pallets", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getPallet = async (item) => {
  try {
    const db = await openDatabase();
    const data = await db.get(
      `SELECT p.id, p.code, p.observation, sh.name, w.name, p.date_creation
              FROM pallets p
              INNER JOIN warehouses w on w.id = p.warehouse_id
              INNER JOIN ships sh on sh.id = w.ship_id
              WHERE p.id = (?)`,
      [item.id]
    );
    const dataFormatted = await first("pallets", data, [
      "id",
      "code",
      "observation",
      "ship_id",
      "warehouse_id",
      "date_creation",
    ]);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const loadPallets = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT p.code,
              p.observation,
              sh.id,
              sh.name,
              sh.journey,
              CASE
                WHEN w.warehouse_id IS NULL THEN 0
                ELSE w.warehouse_id
              END AS warehouse_id,
              w.name,
              p.date_creation
        FROM pallets p
        INNER JOIN warehouses w on w.id = p.warehouse_id
        INNER JOIN ships sh on sh.id = w.ship_id`,
      []
    );
    const dataFormatted = await showData("pallets", data, [
      "code",
      "observation",
      "ship_id",
      "ship_name",
      "journey",
      "warehouse_id",
      "warehouse_name",
      "pallet_creation",
    ]);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const insertPallet = async (data) => {
  try {
    const db = await openDatabase();
    let postData = db.execSQL(
      "INSERT INTO pallets (code, warehouse_id, date_creation) VALUES (?, ?, ?)",
      [data.code, data.warehouse_id, data.pallet_creation]
    );
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const updatePallet = async (item) => {
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(
      `UPDATE pallets
                                        SET observation = (?)
                                        WHERE id = (?)`,
      [item.observation, item.id]
    );
    return updateData;
  } catch (error) {
    console.error("Error al editar el pallet ", error);
  }
};

const deletePallet = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM pallets WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

module.exports = {
  getPallets,
  getPalletsAll,
  getPallet,
  loadPallets,
  insertPallet,
  updatePallet,
  deletePallet,
};
