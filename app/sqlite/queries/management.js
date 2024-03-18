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

module.exports = {
  getTypesManagement
}
