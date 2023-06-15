const Sqlite = require("nativescript-sqlite");

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

// Función para crear la tabla
async function createTable() {
    try {
        const db = await openDatabase();
        const database = db.execSQL(
            "CREATE TABLE IF NOT EXISTS mytable (id INTEGER PRIMARY KEY, name TEXT)",
            []
        );
        console.log(db)
        return database;
    } catch (error) {
        console.log('error e la creacion de la tabla ', error)
    }
}

//traer todos los datos
async function allData() {
    try {
        const db = await openDatabase();
        const data = await db.all("SELECT * FROM mytable", []);
        return data;
    } catch (error) {
        console.log("error al traer los datos ", error);
    }
}

// Función para insertar datos en la tabla
async function insertData(data) {
    try {
        const db = await openDatabase()
        let postData = db.execSQL("INSERT INTO mytable (name) VALUES (?)", [data])
        return postData
    } catch (error) {
        console.log('ocurrio un problema al insertar la fila', error)
    }
}

module.exports = {
    createTable,
    insertData,
    allData,
    openDatabase,
};
