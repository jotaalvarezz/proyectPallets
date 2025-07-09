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
  updateContainerReportYard,
  showContainerReport,
  storeRepairs
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
  storeTypesManagement,
  getReportingManagementShip
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

const { storeRepair, deleteRepair, getRepairsReport, updateRepaairs } = require("~/sqlite/queries/repair");

const { storePrefixes, getPrefixes } = require("~/sqlite/queries/prefix")

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
  getModules,
  storePrefixes,
  getPrefixes,
  getReportingManagementShip,
  storeRepairs,
  updateRepaairs,
  updateContainerReportYard
};
