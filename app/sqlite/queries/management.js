//Consulta para los select del modulo de gestion y tipos de gestion
const { openDatabase, showData, showOneData, getRegister } = require('~/sqlite/openDatabase');

const getTypesManagement = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM types_management", []);
    const dataFormatted = await showData('types_management', data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const getAllManagements = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM management", []);
    const dataFormatted = await showData('management', data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const getManagements = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(`SELECT * FROM management
                                  WHERE type_management_id = ?`, [id]);
    const dataFormatted = await showData('management', data)
    for (let i = 0; i < dataFormatted.length; i++) {
      const containersReport = await db.all(`SELECT id, code
                                              FROM container_reports
                                              WHERE management_id = ?`, [dataFormatted[i].id]);
      const reportsFormatted = await showData('container_reports', containersReport, ['id', 'code'])
      dataFormatted[i].container_reports = reportsFormatted
    }
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const showManagement = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(`SELECT * FROM management
                                  WHERE id = ?`, [id]);
    const dataFormatted = await showOneData('management', data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const storeManagement = async (data) => {
  try {
    const register = await getRegister('management', 'name', data.name, 'type_management_id', data.type_management_id)
    if (Object.keys(register.data).length > 0) {
      return { status: 500 , message: "Ya existe un registro creado con el mismo nombre!" }
    }

    const db = await openDatabase();
    let postData = await db.execSQL(
      `INSERT INTO management (
                              type_management_id,
                              name,
                              journey,
                              titular_name,
                              signature,
                              date_creation)
          VALUES (?, ?, ?, ?, ?, ?)`,
      [data.type_management_id, data.name, data.journey, data.titular_name, data.signature, new Date()]
    );
    const management = showManagement(postData)
    return management;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila management", error);
  }
}

const deleteManagement = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM management WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
}

const updateManagement = async (item) => {
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(`UPDATE management
                                      SET name = (?),
                                          journey = (?),
                                          titular_name = (?),
                                          signature = (?)
                                      WHERE id = (?)`, [item.name, item.journey, item.titular_name, item.signature, item.id]);
    const management = showManagement(item.id)
    return management
  } catch (error) {
    console.error("Error al editar el barco ", error)
  }
}

module.exports = {
  getTypesManagement,
  storeManagement,
  getAllManagements,
  getManagements,
  deleteManagement,
  updateManagement
}
