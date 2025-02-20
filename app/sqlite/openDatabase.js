const Sqlite = require("nativescript-sqlite");
import { ImageSource } from "@nativescript/core";

export const openDatabase = async () => {
  try {
    const lite = await new Sqlite("mydatabase.db");
    return lite;
  } catch (error) {
    console.log("error al abrir la db: ", error);
  }
};

export const showData = async (nameTable, data, keys = []) => {
  try {
    const db = await openDatabase();
    let columnNames = [];
    let objectData = [];
    let object = {};
    if (keys.length === 0) {
      const columnInfo = await db.all(`PRAGMA table_info(${nameTable})`, []);
      columnNames = columnInfo.map((column) => column[1]);
    } else {
      columnNames = keys;
    }

    if (data.length === 0) {
      return objectData;
    }

    if (columnNames.length !== data[0].length) {
      throw new Error("verifique que las claves y la data coincidan...");
    }

    for (let i = 0; i < data.length; i++) {
      object = {};
      for (let j = 0; j < data[i].length; j++) {
        object[columnNames[j]] = data[i][j];
      }
      objectData.push(object);
    }
    return objectData;
  } catch (error) {
    console.log("error al traer columnas: ", error.message);
  }
};

export const showOneData = async (nameTable, data, keys = []) => {
  try {
    const db = await openDatabase();
    let columnNames = [];
    let objectData = [];
    let object = {};
    if (keys.length === 0) {
      const columnInfo = await db.all(`PRAGMA table_info(${nameTable})`, []);
      columnNames = columnInfo.map((column) => column[1]);
    } else {
      columnNames = keys;
    }

    if (data.length === 0) {
      return objectData;
    }

    if (columnNames.length !== data[0].length) {
      throw new Error("verifique que las claves y la data coincidan...");
    }

    if (data.length > 0 && data.length < 2) {
      for (let i = 0; i < data.length; i++) {
        object = {};
        for (let j = 0; j < data[i].length; j++) {
          object[columnNames[j]] = data[i][j];
        }
        return object;
      }
    }

    for (let i = 0; i < data.length; i++) {
      object = {};
      for (let j = 0; j < data[i].length; j++) {
        object[columnNames[j]] = data[i][j];
      }
      objectData.push(object);
    }
    return objectData;
  } catch (error) {
    console.log("error al traer columnas: ", error.message);
  }
};

export const first = async (nameTable, data, keys = []) => {
  try {
    const db = await openDatabase();
    let columnNames = [];
    let object = {};
    if (keys.length === 0) {
      const columnInfo = await db.all(`PRAGMA table_info(${nameTable})`, []);
      columnNames = columnInfo.map((column) => column[1]);
    } else {
      columnNames = keys;
    }

    if (data === null) {
      return object;
    }

    if (columnNames.length !== data.length) {
      throw new Error("verifique que las claves y la data coincidan...");
    }

    for (let i = 0; i < data.length; i++) {
      object[columnNames[i]] = data[i];
    }
    return object;
  } catch (error) {
    console.log("error al traer columnas: ", error.message);
  }
};

export const getRegister = async (
  table,
  columName1,
  name1,
  columName2 = null,
  name2 = null
) => {
  try {
    const db = await openDatabase();
    let data = [];
    if (
      (columName2 === null && name2 === null) ||
      (columName2 === "" && name2 === "")
    ) {
      data = await db.get(
        `SELECT * FROM ${table}
                                        WHERE ${columName1} = ?`,
        [name1]
      );
    } else {
      data = await db.get(
        `SELECT * FROM ${table}
                                        WHERE ${columName1} = ? AND ${columName2} = ?`,
        [name1, name2]
      );
    }
    const dataFormatted = await first(table, data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

export const encriptImg = async (directory) => {
  if(directory === '' || directory === null){
    return '';
  }
  const imageSource = await ImageSource.fromFile(directory);
  const base64Image = imageSource.toBase64String("jpg", 80);
  return base64Image;
};
