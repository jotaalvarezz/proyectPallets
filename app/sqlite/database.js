const Sqlite = require("nativescript-sqlite");
const {
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
} = require("~/sqlite/queries/evidence");

const {
  getTypesManagement,
  storeManagement,
  getManagements,
  getAllManagements,
  deleteManagement,
  updateManagement,
} = require("~/sqlite/queries/management");

const {
  getUsers,
  storeUsers,
  showUser,
} = require("~/sqlite/queries/login/users");

const { storeModules } = require("~/sqlite/queries/login/modules");

const { storeRepair, deleteRepair } = require("~/sqlite/queries/repair");
const Querys = [
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
      FOREIGN KEY (ship_id) REFERENCES ships(ship_id)
    )`,
  /*  `CREATE TABLE IF NOT EXISTS ship_warehouses
     (
       id INTEGER PRIMARY KEY,
       ship_id INTEGER ,
       warehouse_id INTEGER,
       FOREIGN KEY (ship_id) REFERENCES ships(ship_id),
       FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
     )`, */
  `CREATE TABLE IF NOT EXISTS pallets
    (
      id INTEGER PRIMARY KEY,
      code TEXT, observation TEXT,
      warehouse_id INTEGER,
      date_creation DATETIME,
      FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id)
    )`,

  /* *************************************************************** */
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
        date_creation DATETIME
      )`,

  `CREATE TABLE IF NOT EXISTS management
      (
        id INTEGER PRIMARY KEY,
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

  /* Tablas de usuarios y modulos */
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
];

const DefaultSelects = {
  types: [
    { name: "Refrigerado", date_creation: new Date() },
    { name: "Seco", date_creation: new Date() },
    { name: "Lleno", date_creation: new Date() },
    { name: "Vacio", date_creation: new Date() },
  ],
  additional_damage: [
    { name: "VENTILADOR", date_creation: new Date() },
    { name: "TEMPERATURA", date_creation: new Date() },
    { name: "PLUG", date_creation: new Date() },
    { name: "CABLE ELECTRICO", date_creation: new Date() },
    { name: "CONVERTIDOR DE FRECUENCIA", date_creation: new Date() },
    { name: "MICRO", date_creation: new Date() },
    { name: "FREON", date_creation: new Date() },
    { name: "COMPRESOR", date_creation: new Date() },
    { name: "PANTALLA", date_creation: new Date() },
  ],
  container_elements: [
    { name: "Viga Frontal", date_creation: new Date() },
    { name: "Travesaño", date_creation: new Date() },
    { name: "Ventilador", date_creation: new Date() },
    { name: "Soporte de Uña", date_creation: new Date() },
    { name: "Manija de Puerta", date_creation: new Date() },
    { name: "Barra de Cierre", date_creation: new Date() },
    { name: "Empaque de Puerta", date_creation: new Date() },
    { name: "Bisagras", date_creation: new Date() },
    { name: "Seguro de Puerta", date_creation: new Date() },
  ],
  damage: [
    { name: "AB - ABOLLADO", date_creation: new Date() },
    { name: "DO - DOBLADO", date_creation: new Date() },
    { name: "OX - OXIDADO", date_creation: new Date() },
    { name: "SU - SUMIDO", date_creation: new Date() },
    { name: "SC - SUCIO", date_creation: new Date() },
    { name: "CO - CORTADO", date_creation: new Date() },
    { name: "FA - FALTA", date_creation: new Date() },
    { name: "RO - ROTO", date_creation: new Date() },
    { name: "ZA - ZAFO", date_creation: new Date() },
    { name: "AC - MANCHAS DE ACEITE", date_creation: new Date() },
  ],
};

const DefaultTypesManagement = [
  {
    name: "Gestion en Barco",
    icon: "~/assets/images/gestion_barco.jpg",
    date_creation: new Date(),
  },
  {
    name: "Gestion en Patio",
    icon: "~/assets/images/gestion_patio.jpg",
    date_creation: new Date(),
  },
];

// Función para abrir o crear la base de datos
/* ************************************************************************************** */
const openDatabase = async () => {
  try {
    const lite = await new Sqlite("mydatabase.db");
    return lite;
  } catch (error) {
    console.log("error al abrir la db: ", error);
  }
};

const structure = async () => {
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
};

// Función para crear las tablas
const createTable = async (shipsWarehouses) => {
  /* console.log("EN DATABASE", shipsWarehouses) */
  try {
    DBdelete();
    let database = [];
    const db = await openDatabase();
    for (let i = 0; i < Querys.length; i++) {
      database = db.execSQL(Querys[i], []);
    }
    insertDefaultData(db, shipsWarehouses);
    //console.log(db);
    return database;
  } catch (error) {
    console.log("error e la creacion de la tabla ", error);
  }
};
/* ************************************************************************************** */

const insertSeletsData = async (db) => {
  try {
    let post = [];
    for (const key in DefaultSelects) {
      if (DefaultSelects.hasOwnProperty(key)) {
        for (let j = 0; j < DefaultSelects[key].length; j++) {
          post[j] = db.execSQL(
            `INSERT INTO ${key} (name, date_creation) VALUES (?, ?)`,
            [DefaultSelects[key][j].name, DefaultSelects[key][j].date_creation]
          );
        }
      }
    }
    return post;
  } catch (error) {
    console.log("errores ", error);
  }
};

//datos por defecto de tipos de gestion
const insertTypesManagement = async (db) => {
  try {
    let post = [];
    for (let i = 0; i < DefaultTypesManagement.length; i++) {
      post[i] = db.execSQL(
        `INSERT INTO types_management (name, icon, date_creation) VALUES (?, ?, ?)`,
        [
          DefaultTypesManagement[i].name,
          DefaultTypesManagement[i].icon,
          DefaultTypesManagement[i].date_creation,
        ]
      );
    }
    return post;
  } catch (error) {
    console.log("error al crear registro en types management ", error);
  }
};

//Creacion de datos por defecto
const insertDefaultData = async (db, shipsWarehouses) => {
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
    insertSeletsData(db);
    insertTypesManagement(db);
    return { postShip: postData, postWarehouse: postWarehouse };
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

//traer todos los datos
/* ************************************************************************************** */
const getShips = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM ships", []);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getWarehouses = async (ship_id) => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM warehouses WHERE ship_id = (?)", [
      ship_id,
    ]);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getPallets = async (warehouse_id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      "SELECT * FROM pallets WHERE warehouse_id = (?)",
      [warehouse_id]
    );
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getPalletsAll = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM pallets", []);
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getPallet = async (item) => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT p.id, p.code, p.observation, sh.name, w.name
                                        FROM pallets p
                                        INNER JOIN warehouses w on w.id = p.warehouse_id
                                        INNER JOIN ships sh on sh.id = w.ship_id
                                        WHERE p.id = (?)`,
      [item.id]
    );
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

//carga los pallets que se van a enviar al backend de MCP
const loadPallets = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT p.id,
                                      p.code,
                                      p.observation,
                                      sh.id,
                                      sh.name,
                                      sh.journey,
                                      w.warehouse_id,
                                      w.name,
                                      p.date_creation
                                FROM pallets p
                                INNER JOIN warehouses w on w.id = p.warehouse_id
                                INNER JOIN ships sh on sh.id = w.ship_id`,
      []
    );
    return data;
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

/* ************************************************************************************** */

// Función para insertar datos en la tabla
/* ************************************************************************************** */
const insertShip = async (data) => {
  try {
    const db = await openDatabase();
    let postData = db.execSQL(
      "INSERT INTO ships (name, journey) VALUES (?, ?)",
      [data.nameShip, data.journey]
    );
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const insertWarehuse = async (data) => {
  try {
    const db = await openDatabase();
    let postData = db.execSQL(
      "INSERT INTO warehouses (name, ship_id) VALUES (?, ?)",
      [data.nameWarehouse, data.ship_id]
    );
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const insertPallet = async (data) => {
  try {
    const db = await openDatabase();
    let postData = db.execSQL(
      "INSERT INTO pallets (code, warehouse_id, date_creation) VALUES (?, ?, ?)",
      [data.codePallet, data.warehouse_id, data.pallet_creation]
    );
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};
/* ************************************************************************************** */

// Funciónes para editar datos en la tabla
/* ************************************************************************************** */
const updatePallet = async (item) => {
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(
      `UPDATE pallets
                                        SET observation = (?)
                                        WHERE id = (?)`,
      [item.observation, item.id]
    );
    return updateData;
  } catch (error) {
    console.error("Error al editar el pallet ", error);
  }
};

const updateShip = async (item) => {
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(
      `UPDATE ships
                                      SET journey = (?)
                                      WHERE id = (?)`,
      [item.journey, item.id]
    );
    return updateData;
  } catch (error) {
    console.error("Error al editar el barco ", error);
  }
};
/* ************************************************************************************** */

//Funcion para eliminar registros de una tabla
/* ************************************************************************************** */
const deleteShip = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM ships WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

const deleteWarehouse = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM warehouses WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

const deletePallet = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM pallets WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

//Funcion para eliminar la Base de datos
const DBdelete = async () => {
  try {
    //const db = await openDatabase()
    const deleteDB = Sqlite.deleteDatabase("mydatabase.db");
    console.log("db borrada => ", deleteDB);
    return deleteDB;
  } catch (error) {
    console.log("error al eliminar ", error);
  }
};

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
  storeModules
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
