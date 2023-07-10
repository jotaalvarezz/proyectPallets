const Sqlite = require("nativescript-sqlite");

const Querys = [
  "CREATE TABLE IF NOT EXISTS ships (id INTEGER PRIMARY KEY, name TEXT, journey TEXT)",
  "CREATE TABLE IF NOT EXISTS warehouses (id INTEGER PRIMARY KEY, name TEXT,ship_id INTEGER , FOREIGN KEY (ship_id) REFERENCES ships(ship_id))",
  "CREATE TABLE IF NOT EXISTS pallets (id INTEGER PRIMARY KEY, code TEXT, observation TEXT, warehouse_id INTEGER, FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id))",
];

const DefaultShips = [
    {nameShip:"CALA PINO", journey:""},
    {nameShip:"CALA PEDRA", journey:""},
    {nameShip:"CALA PALMA", journey:""},
    {nameShip:"CALA PULA", journey:""}
]

const DefaultWarehouses = [
    {name:"1A", ship_id:""},
    {name:"1B", ship_id:""},
    {name:"1C", ship_id:""},
    {name:"1D", ship_id:""}
]


// Función para abrir o crear la base de datos
/* ************************************************************************************** */
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

// Función para crear las tablas
async function createTable(shipsWarehouses) {
  console.log("EN DATABASE", shipsWarehouses)
  try {
    let database = [];
    const db = await openDatabase();
    for (let i = 0; i < Querys.length; i++) {
      database = db.execSQL(
        Querys[i],
        []
      );
    }
    insertDefaultData(db, shipsWarehouses)
    console.log(db);
    return database;
  } catch (error) {
    console.log("error e la creacion de la tabla ", error);
  }
}
/* ************************************************************************************** */

//Creacion de datos por defecto
async function insertDefaultData(db, shipsWarehouses) {
  try {
    let postWarehouse = []
    let postData = []
    //const db = await openDatabase();
    for (let i = 0; i < shipsWarehouses.length; i++) {
      postData[i] = await db.execSQL("INSERT INTO ships (name, journey) VALUES (?, ?)", [shipsWarehouses[i].name_ship, shipsWarehouses[i].journey]);
      for (let j = 0; j < shipsWarehouses[i].warehouses.length; j++) {
        shipsWarehouses[i].warehouses[j].ship_id = postData[i]
        postWarehouse = db.execSQL("INSERT INTO warehouses (name, ship_id) VALUES (?, ?)", [shipsWarehouses[i].warehouses[j].name_warehouse,shipsWarehouses[i].warehouses[j].ship_id]);
      }
    }
    //return  {postShip:postData, postWarehouse:postWarehouse};
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}



//traer todos los datos
/* ************************************************************************************** */
async function getShips() {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM ships", []);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

async function getWarehouses(ship_id) {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM warehouses WHERE ship_id = (?)", [ship_id]);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

async function getPallets(warehouse_id) {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM pallets WHERE warehouse_id = (?)", [warehouse_id]);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

async function getPalletsAll() {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM pallets", []);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

async function getPallet(item){
  try {
    const db = await openDatabase();
    const data = await db.all(`SELECT p.id, p.code, p.observation, sh.name, w.name
                                        FROM pallets p
                                        INNER JOIN warehouses w on w.id = p.warehouse_id
                                        INNER JOIN ships sh on sh.id = w.ship_id
                                        WHERE p.id = (?)`, [item.id]
                            );
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}
/* ************************************************************************************** */

// Función para insertar datos en la tabla
/* ************************************************************************************** */
async function insertShip(data) {
  try {
    const db = await openDatabase();
    let postData = db.execSQL("INSERT INTO ships (name, journey) VALUES (?, ?)", [data.nameShip, data.journey]);
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}

async function insertWarehuse(data) {
  try {
    const db = await openDatabase();
    let postData = db.execSQL("INSERT INTO warehouses (name, ship_id) VALUES (?, ?)", [data.nameWarehouse, data.ship_id]);
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}

async function insertPallet(data) {
  try {
    const db = await openDatabase();
    let postData = db.execSQL("INSERT INTO pallets (code, warehouse_id) VALUES (?, ?)", [data.codePallet, data.warehouse_id]);
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}
/* ************************************************************************************** */


// Funciónes para editar datos en la tabla
/* ************************************************************************************** */
async function updatePallet(item){
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(`UPDATE pallets
                                        SET observation = (?)
                                        WHERE id = (?)`,[item.observation, item.id]);
    return updateData
  } catch (error) {
    console.error("Error al editar el pallet ",error)
  }
}

async function updateShip(item){
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(`UPDATE ships
                                      SET journey = (?)
                                      WHERE id = (?)`,[item.journey, item.id]);
  return updateData
  } catch(error) {
    console.error("Error al editar el barco ",error)
  }
}
/* ************************************************************************************** */

//Funcion para eliminar registros de una tabla
/* ************************************************************************************** */
async function deleteShip(id) {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM ships WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
}

async function deleteWarehouse(id) {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM warehouses WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
}

async function deletePallet(id) {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM pallets WHERE id = ?", [id]);
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
  insertShip,
  insertWarehuse,
  insertPallet,
  getShips,
  getWarehouses,
  getPallets,
  openDatabase,
  DBdelete,
  deleteShip,
  deleteWarehouse,
  deletePallet,
  structure,
  getPalletsAll,
  getPallet,
  updatePallet,
  updateShip
};


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
