const Sqlite = require("nativescript-sqlite");

const Querys = [
  "CREATE TABLE IF NOT EXISTS ships (id INTEGER PRIMARY KEY, name TEXT, journey TEXT)",
  "CREATE TABLE IF NOT EXISTS warehouses (id INTEGER PRIMARY KEY, ship_id INTEGER, name TEXT, FOREIGN KEY (ship_id) REFERENCES ships(ship_id))",
  "CREATE TABLE IF NOT EXISTS pallets (id INTEGER PRIMARY KEY, warehouse_id INTEGER, code TEXT, observation TEXT,FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id))",
];

// Función para abrir o crear la base de datos
/* const openDatabase = async () => {
  return new Promise((resolve, reject) => {
    new Sqlite('mydatabase.db', (err, db) => {
      if (err) {
        reject(err);
      } else {
        //console.log("open ",resolve(db))
        resolve(db);
      }
    });
  });
}; */

//traer todos los datos
/* const allData = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
      db.all('SELECT * FROM mytable', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
  })
} */

// Función para crear la tabla
/* const createTable = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.execSQL(
      "CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY, name TEXT)",
      [],
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}; */

// Función para insertar datos en la tabla
/* const insertData = async (name) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    db.execSQL("INSERT INTO mytable (name) VALUES (?)", [name], (err, id) => {
      if (err) {
        reject(err);
      } else {
        resolve(id);
      }
    });
  });
}; */

// Función para abrir o crear la base de datos
async function openDatabase() {
  try {
    const lite = await new Sqlite("mydatabase.db");
    return lite;
  } catch (error) {
    console.log("error al abrir la db: ", error);
  }
}

async function structure() {
  try {
    const db = await openDatabase();
    db.all("SELECT name, sql FROM sqlite_master WHERE type='table'").then(
      (result) => {
        // Imprime la estructura de la base de datos en la consola
        result.forEach((table) => {
          console.log("Tabla:", table[0]);
          console.log("Definición:", table[1]);
          console.log("------------------------------------");
        });
      }
    );
  } catch (error) {}
}

// Función para crear la tabla
async function createTable() {
  try {
    let database = [];
    const db = await openDatabase();
    for (let i = 0; i < Querys.length; i++) {
      database = db.execSQL(
        Querys[i],
        []
      );
    }
    console.log(db);
    return database;
  } catch (error) {
    console.log("error e la creacion de la tabla ", error);
  }
}

//traer todos los datos
async function allData() {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM ships", []);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

// Función para insertar datos en la tabla
async function insertData(data) {
  try {
    const db = await openDatabase();
    let postData = db.execSQL("INSERT INTO ships (name) VALUES (?)", [data]);
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}

//Funcion para eliminar registros de una tabla
async function deleteRecord(id) {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM ships WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
}

//Funcion para eliminar la Base de datos
async function DBdelete() {
  try {
    //const db = await openDatabase()
    const deleteDB = Sqlite.deleteDatabase("mydatabase.db");
    console.log("db borrada => ", deleteDB);
    return deleteDB;
  } catch (error) {
    console.log("error al eliminar ", error);
  }
}

module.exports = {
  createTable,
  insertData,
  allData,
  openDatabase,
  DBdelete,
  deleteRecord,
  structure
};
