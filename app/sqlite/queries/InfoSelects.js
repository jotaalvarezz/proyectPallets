const {openDatabase, showData} = require('~/sqlite/openDatabase');

const getTypes = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM types", []);
    const dataFormatted = await showData('types',data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error );
  }
}

const getAdditionalDamage = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM additional_damage", []);
    const dataFormatted = await showData('additional_damage',data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error );
  }
}

const getContainerElements = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM container_elements", []);
    const dataFormatted = await showData('container_elements',data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error );
  }
}

const getDamage = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM damage", []);
    const dataFormatted = await showData('damage',data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error );
  }
}

module.exports = {
  getTypes,
  getAdditionalDamage,
  getContainerElements,
  getDamage
}
