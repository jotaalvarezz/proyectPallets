const {openDatabase, showData} = require('~/sqlite/openDatabase');

const storeSeletsEvidence = async (DefaultSelects) => {
  try {
    const db = await openDatabase();
    let post = [];
    for (const key in DefaultSelects) {
      if (DefaultSelects.hasOwnProperty(key)) {
        for (let j = 0; j < DefaultSelects[key].length; j++) {
          post[j] = db.execSQL(
            `INSERT INTO ${key} (id, name, date_creation) VALUES (?, ?, ?)`,
            [DefaultSelects[key][j].id, DefaultSelects[key][j].name, DefaultSelects[key][j].created_at]
          );
        }
      }
    }
    return post;
  } catch (error) {
    console.log("errores ", error);
  }
};

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
  getDamage,
  storeSeletsEvidence
}
