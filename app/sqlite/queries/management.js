//Consulta para los select del modulo de gestion y tipos de gestion
const { openDatabase, showData } = require('~/sqlite/openDatabase');

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

const storeManagement = async (data) => {
  try {
    const db = await openDatabase();
    let postData = await db.execSQL(
      `INSERT INTO management (
                            type_management_id,
                            name,
                            journey,
                            signature,
                            date_creation)
        VALUES (?, ?, ?, ?, ?)`,
      [data.type_management_id, data.name, data.journey, data.signature, new Date()]
    );
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila management", error);
  }
}

module.exports = {
  getTypesManagement,
  storeManagement,
  getAllManagements,
  getManagements
}
