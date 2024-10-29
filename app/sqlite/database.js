/* const Sqlite = require("nativescript-sqlite"); */

/* const moment = require("moment"); */

const {
  storeSeletsEvidence,
  getTypes,
  getAdditionalDamage,
  getContainerElements,
  getDamage,
} = require("~/sqlite/queries/InfoSelects");

const {
  storeContainerReport,
  getContainerReport,
  getRepairs,
  getRepairDamage,
  deleteContainerReport,
  updateContainerReport,
  showContainerReport,
} = require("~/sqlite/queries/evidence");

const {
  getTypesManagement,
  storeManagement,
  getManagements,
  getAllManagements,
  deleteManagement,
  updateManagement,
  sendEvidenceReports,
  finishOperations,
  showTypesManagement,
  storeTypesManagement
} = require("~/sqlite/queries/management");

const {
  getUsers,
  storeUsers,
  showUser,
} = require("~/sqlite/queries/login/users");

const {
  storeShips,
  getShips,
  insertShip,
  updateShip,
  deleteShip
} = require("~/sqlite/queries/ship")

const {
  getWarehouses,
  insertWarehuse,
  deleteWarehouse
} = require("~/sqlite/queries/warehouse")

const {
  getPallets,
  getPalletsAll,
  getPallet,
  loadPallets,
  insertPallet,
  updatePallet,
  deletePallet
} = require("~/sqlite/queries/pallet")

const { storeModules, getModules } = require("~/sqlite/queries/login/modules");

const { storeRepair, deleteRepair, getRepairsReport } = require("~/sqlite/queries/repair");
/* const Querys = [
  `CREATE TABLE IF NOT EXISTS ships
    (
      id INTEGER PRIMARY KEY,
      name TEXT,
      journey TEXT
    )`,
  `CREATE TABLE IF NOT EXISTS warehouses
    (
      id INTEGER PRIMARY KEY,
      name TEXT,
      warehouse_id TEXT,
      ship_id INTEGER ,
      FOREIGN KEY (ship_id) REFERENCES ships(id)
    )`,
  `CREATE TABLE IF NOT EXISTS pallets
    (
      id INTEGER PRIMARY KEY,
      code TEXT,
      observation TEXT,
      warehouse_id INTEGER,
      date_creation DATETIME,
      FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
    )`,
  `CREATE TABLE IF NOT EXISTS types
    (
      id INTEGER PRIMARY KEY,
      name TEXT,
      date_creation DATETIME
    )`,

  `CREATE TABLE IF NOT EXISTS additional_damage
    (
      id INTEGER PRIMARY KEY,
      name TEXT,
      date_creation DATETIME
    )`,

  `CREATE TABLE IF NOT EXISTS container_elements
      (
        id INTEGER PRIMARY KEY,
        name TEXT,
        date_creation DATETIME
      )`,

  `CREATE TABLE IF NOT EXISTS damage
      (
        id INTEGER PRIMARY KEY,
        name TEXT,
        date_creation DATETIME
      )`,

  `CREATE TABLE IF NOT EXISTS types_management
      (
        id INTEGER PRIMARY KEY,
        name TEXT,
        icon TEXT,
        status INTEGER,
        date_creation DATETIME
      )`,

  `CREATE TABLE IF NOT EXISTS management
      (
        id INTEGER PRIMARY KEY,
        consecutive TEXT,
        type_management_id INTEGER,
        name TEXT,
        journey TEXT,
        titular_name TEXT,
        signature TEXT,
        date_creation DATETIME,
        FOREIGN KEY (type_management_id) REFERENCES types_management(id)
      )`,

  `CREATE TABLE IF NOT EXISTS container_reports
  (
    id INTEGER PRIMARY KEY,
    consecutive TEXT,
    management_id INTEGER,
    code TEXT,
    type_id INTEGER,
    role TEXT,
    observation TEXT,
    date_creation DATETIME,
    FOREIGN KEY (management_id) REFERENCES management(id),
    FOREIGN KEY (type_id) REFERENCES types(id)
  )`,

  `CREATE TABLE IF NOT EXISTS repairs
  (
    id INTEGER PRIMARY KEY,
    container_element_id INTEGER,
    location TEXT,
    position TEXT,
    container_report_id INTEGER,
    photo TEXT,
    date_creation DATETIME,
    FOREIGN KEY (container_element_id) REFERENCES container_elements(id),
    FOREIGN KEY (container_report_id) REFERENCES container_reports(id)
  )`,

  `
    CREATE TABLE IF NOT EXISTS repair_damage (
      id INTEGER PRIMARY KEY,
      repair_id INTEGER,
      damage_id INTEGER,
      date_creation DATETIME,
      FOREIGN KEY (repair_id) REFERENCES repairs(id),
      FOREIGN KEY (damage_id) REFERENCES damage(id)
    )
  `,

  `CREATE TABLE IF NOT EXISTS container_reports_additional_damage
    (
      id INTEGER PRIMARY KEY,
      container_report_id INTEGER,
      additional_damage_id INTEGER,
      date_creation DATETIME,
      FOREIGN KEY (container_report_id) REFERENCES container_reports(id),
      FOREIGN KEY (additional_damage_id) REFERENCES additional_damage(id)
    )`,
  `CREATE TABLE IF NOT EXISTS users
    (
      id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      username TEXT,
      password TEXT,
      date_creation DATETIME
    )`,

  `CREATE TABLE IF NOT EXISTS modules
    (
      id INTEGER PRIMARY KEY,
      name_module TEXT,
      url TEXT,
      icon TEXT,
      movil_id TEXT,
      description TEXT,
      date_creation DATETIME
    )`,

  `CREATE TABLE IF NOT EXISTS module_user
    (
      id INTEGER PRIMARY KEY,
      user_id INTEGER,
      module_id INTEGER,
      date_creation DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (module_id) REFERENCES modules(id)
    )`,
]; */

// Función para abrir o crear la base de datos
/* ************************************************************************************** */
/* const openDatabase = async () => {
  try {
    const lite = await new Sqlite("mydatabase.db");
    return lite;
  } catch (error) {
    console.log("error al abrir la db: ", error);
  }
}; */

/* const structure = async () => {
  try {
    const db = await openDatabase();
    return db
      .all("SELECT name, sql FROM sqlite_master WHERE type='table'")
      .then((result) => {
        // Imprime la estructura de la base de datos en la consola
        result.forEach((table) => {
          console.log("Tabla:", table[0]);
          console.log("Definición:", table[1]);
          console.log("------------------------------------");
        });
      });
  } catch (error) {}
}; */

// Función para crear las tablas
/* const createTable = async (shipsWarehouses) => {
  try {
    DBdelete();
    let database = [];
    const db = await openDatabase();
    for (let i = 0; i < Querys.length; i++) {
      database = db.execSQL(Querys[i], []);
    }
    insertDefaultData(db, shipsWarehouses);
    return database;
  } catch (error) {
    console.log("error e la creacion de la tabla ", error);
  }
}; */
/* ************************************************************************************** */

/* const insertSeletsEvidence = async (DefaultSelects) => {
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
}; */

//datos por defecto de tipos de gestion
/* const storeTypesManagement = async (data) => {
  try {
    const db = await openDatabase();
    const DefaultTypesManagement = data.types_management
    let post = [];
    for (let i = 0; i < DefaultTypesManagement.length; i++) {
      post[i] = db.execSQL(
        `INSERT INTO types_management (id, name, icon, status, date_creation) VALUES (?, ?, ?, ?, ?)`,
        [
          DefaultTypesManagement[i].id,
          DefaultTypesManagement[i].name,
          DefaultTypesManagement[i].icon,
          1,
          moment(DefaultTypesManagement[i].created_at).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );
    }
    return post;
  } catch (error) {
    console.log("error al crear registro en types management ", error);
  }
}; */

//Creacion de datos por defecto
/* const insertDefaultData = async (db, shipsWarehouses) => {
  try {
    let postWarehouse = [];
    let postData = [];
    let selects = [];
    for (let i = 0; i < shipsWarehouses.length; i++) {
      postData[i] = await db.execSQL(
        "INSERT INTO ships (id, name, journey) VALUES (?, ?, ?)",
        [
          shipsWarehouses[i].id,
          shipsWarehouses[i].name_ship,
          shipsWarehouses[i].journey,
        ]
      );
      for (let j = 0; j < shipsWarehouses[i].warehouses.length; j++) {
        postWarehouse[j] = db.execSQL(
          "INSERT INTO warehouses (name, warehouse_id, ship_id) VALUES (?, ?, ?)",
          [
            shipsWarehouses[i].warehouses[j].name_warehouse,
            shipsWarehouses[i].warehouses[j].id,
            shipsWarehouses[i].id,
          ]
        );
      }
    }
    return { postShip: postData, postWarehouse: postWarehouse };
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}; */

//Funcion para eliminar la Base de datos
/* const DBdelete = async () => {
  try {
    //const db = await openDatabase()
    const deleteDB = Sqlite.deleteDatabase("mydatabase.db");
    return deleteDB;
  } catch (error) {
    console.log("error al eliminar ", error);
  }
}; */

module.exports = {
  /* createTable, */
  insertShip,
  insertWarehuse,
  insertPallet,
  getShips,
  getWarehouses,
  getPallets,
  /* openDatabase, */
  /* DBdelete, */
  deleteShip,
  deleteWarehouse,
  deletePallet,
  /* structure, */
  getPalletsAll,
  getPallet,
  updatePallet,
  updateShip,
  loadPallets,
  getTypes,
  getAdditionalDamage,
  getContainerElements,
  getDamage,
  storeContainerReport,
  getContainerReport,
  getRepairs,
  getRepairDamage,
  getTypesManagement,
  storeManagement,
  getManagements,
  getAllManagements,
  deleteManagement,
  updateManagement,
  deleteContainerReport,
  updateContainerReport,
  storeRepair,
  deleteRepair,
  storeUsers,
  showUser,
  storeModules,
  /* insertSeletsEvidence, */
  /* insertTypesManagement, */
  storeSeletsEvidence,
  storeTypesManagement,
  sendEvidenceReports,
  finishOperations,
  showContainerReport,
  showTypesManagement,
  getRepairsReport,
  getUsers,
  /* insertDefaultData, */
  storeShips,
  getModules
};
