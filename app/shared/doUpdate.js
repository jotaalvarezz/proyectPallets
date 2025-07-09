import { Configuration } from "~/config/Contiguration";
const Sqlite = require("nativescript-sqlite");
import axios from "axios";
import { Querys } from "~/tools/dbStructure";
const { openDatabase } = require("~/sqlite/openDatabase");
const {
  storeUsers,
  storeModules,
  storeShips,
  storeSeletsEvidence,
  storeTypesManagement,
  storePrefixes,
} = require("~/sqlite/database");
import store from "../store/index";
import { responseCatch } from "~/shared/helpers";

export class doUpdate {
  static tablesToUpdates = [
    { table: "users", url: Configuration.getUsers() },
    { table: "ships", url: Configuration.getShips() },
    { table: "modules", url: Configuration.getModules() },
    { table: "selectEvidences", url: Configuration.getSelectEvidences() },
    { table: "prefixes", url: Configuration.getPrefixes() },
  ];

  static async createTable() {
    try {
      let database = [];
      const db = await openDatabase();
      for (let i = 0; i < Querys.length; i++) {
        database = db.execSQL(Querys[i], []);
      }
      return database;
    } catch (error) {
      console.log("error e la creacion de la tabla ", error);
    }
  }

  static async structure() {
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
  }

  static async updateApp() {
    try {
      await this.DBdelete();
      const result = await rebuildTables(this.tablesToUpdates);
      return { status: 200, message: result };
    } catch (error) {
      console.log("error al actualizar la base datos ", error);
    }
  }

  static async DBdelete() {
    try {
      const dbDelete = await Sqlite.deleteDatabase("mydatabase.db");
      return dbDelete;
    } catch (error) {
      console.log("error al Eliminar la base datos ", error);
    }
  }
}

const rebuildTables = async (tables) => {
  let object = {};
  try {
    await doUpdate.createTable();

    for (const table of tables) {
      const key = table.table;
      //console.log("url ", table.url);
      let query = await axios.get(table.url);
      object[key] = query.data.data;
    }

    if (Object.keys(object).length > 0) {
      for (const table of tables) {
        const dbTable = table.table;
        switch (dbTable) {
          case "users":
            const resUsers = await storeUsers(object.users);
            responseCatch(resUsers)
            store.commit("auth/setUsers", object.users);
            break;

          case "modules":
            const resModules = await storeModules(object.modules);
            responseCatch(resModules)
            break;

          case "ships":
            const resShips = await storeShips(object.ships);
            responseCatch(resShips)
            break;

          case "selectEvidences":
            const resSelectEvidences = await storeSeletsEvidence(object.selectEvidences.defaultSelects);
            responseCatch(resSelectEvidences)
            const resTypesManagement = await storeTypesManagement(object.selectEvidences.defaultTypes);
            responseCatch(resTypesManagement)
            break;

          case "prefixes":
            const resPrefixes = await storePrefixes(object.prefixes);
            responseCatch(resPrefixes)
            break;
        }
      }
    }
    /* console.log("moduls ", await doUpdate.structure()); */
  } catch (error) {
    return { status: 400, message: error };
  }
};
