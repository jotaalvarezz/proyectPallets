const Sqlite = require("nativescript-sqlite");

export const openDatabase = async () => {
  try {
    const lite = await new Sqlite("mydatabase.db");
    return lite;
  } catch (error) {
    console.log("error al abrir la db: ", error);
  }
}

export const showData = async (nameTable, data, keys = []) => {
  try {
    const db = await openDatabase();
    let columnNames = []
    let objectData = []
    let object = {}
    if(keys.length === 0){
      const columnInfo = await db.all(`PRAGMA table_info(${nameTable})`, []);
      columnNames = columnInfo.map(column => column[1]);
    }else{
      columnNames = keys
    }

    if(data.length === 0){
      return objectData;
    }
    /* console.log("columns ", columnNames)
    console.log("data ", data[0].length)
    console.log("data name ", data[0]) */
    if(columnNames.length !== data[0].length){
      throw new Error('verifique que las claves y la data coincidan...');
    }

    for (let i = 0; i < data.length; i++) {
      object = {}
      for (let j = 0; j < data[i].length; j++) {
        object[columnNames[j]] = data[i][j]
      }
      objectData.push(object)
    }
    return objectData;
  } catch (error) {
    console.log("error al traer columnas: ", error.message);
  }
}

export const showOneData = async (nameTable, data, keys = []) => {
  try {
    const db = await openDatabase();
    let columnNames = []
    let objectData = []
    let object = {}
    if(keys.length === 0){
      const columnInfo = await db.all(`PRAGMA table_info(${nameTable})`, []);
      columnNames = columnInfo.map(column => column[1]);
    }else{
      columnNames = keys
    }

    if(data.length === 0){
      return objectData;
    }
    /* console.log("columns ", columnNames)
    console.log("data ", data[0].length)
    console.log("data name ", data[0]) */
    if(columnNames.length !== data[0].length){
      throw new Error('verifique que las claves y la data coincidan...');
    }

    if(data.length > 0 && data.length < 2){
      for (let i = 0; i < data.length; i++) {
        object = {}
        for (let j = 0; j < data[i].length; j++) {
          object[columnNames[j]] = data[i][j]
        }
        return object;
      }
    }

    for (let i = 0; i < data.length; i++) {
      object = {}
      for (let j = 0; j < data[i].length; j++) {
        object[columnNames[j]] = data[i][j]
      }
      objectData.push(object)
    }
    return objectData;
  } catch (error) {
    console.log("error al traer columnas: ", error.message);
  }
}
