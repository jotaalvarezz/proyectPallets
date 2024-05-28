//Consulta para los select del modulo de evidencias
const {
  openDatabase,
  showData,
  getRegister,
  first,
} = require("~/sqlite/openDatabase");
const moment = require("moment");

const getContainerReport = async (management_id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT cr.id, m.name, m.journey, cr.management_id,
                                      cr.consecutive,
                                      cr.code, cr.type_id, cr.role,
                                      cr.observation, cr.date_creation
                                FROM container_reports cr
                                INNER JOIN management m on m.id = cr.management_id
                                WHERE cr.management_id = ?`,
      [management_id]
    );
    const dataFormatted = await showData("container_reports", data, [
      "id",
      "vessel",
      "journey",
      "management_id",
      "consecutive_report",
      "code",
      "type_id",
      "role",
      "observation",
      "date_creation",
    ]);
    for (let i = 0; i < dataFormatted.length; i++) {
      /* consulta para traer los daños adicionales */
      let additionalDamage = await db.all(
        `SELECT a.id, a.name, a.date_creation
                                    FROM  container_reports_additional_damage ca
                                    INNER JOIN additional_damage a on a.id = ca.additional_damage_id
                                    WHERE ca.container_report_id = ?`,
        [dataFormatted[i].id]
      );
      const additionalDamageFormatted = await showData(
        "additional_damage",
        additionalDamage,
        ["id", "name", "date_creation"]
      );
      dataFormatted[i].additionalDamage = additionalDamageFormatted;
      /* consulta para traer los reparaciones */
      let repairs = await db.all(
        `SELECT r.id, r.container_element_id, e.name, r.location, r.position, r.container_report_id, r.photo
                                    FROM  repairs r
                                    INNER JOIN container_elements e on e.id = r.container_element_id
                                    WHERE container_report_id = ?`,
        [dataFormatted[i].id]
      );
      const repairsFormatted = await showData("repairs", repairs, [
        "id",
        "container_element_id",
        "name",
        "location",
        "position",
        "container_report_id",
        "photo",
      ]);
      /* consulta para traer los daños */
      for (let i = 0; i < repairsFormatted.length; i++) {
        let damages = await db.all(
          `SELECT rd.damage_id, d.name
                                    FROM  repair_damage rd
                                    INNER JOIN damage d on d.id = rd.damage_id
                                    WHERE rd.repair_id = ?`,
          [repairsFormatted[i].id]
        );
        const damagesFormatted = await showData("repair_damage", damages, [
          "id",
          "name",
        ]);
        repairsFormatted[i].repair_damage = damagesFormatted;
      }
      dataFormatted[i].repairs = repairsFormatted;
    }
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const showContainerReport = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.get(
      `SELECT cr.id, m.name, m.journey, cr.management_id,
                                      cr.code, cr.type_id, cr.role,
                                      cr.observation, cr.date_creation
                                FROM container_reports cr
                                INNER JOIN management m on m.id = cr.management_id
                                WHERE cr.id = ?`,
      [id]
    );
    let dataFormatted = await first("container_reports", data, [
      "id",
      "vessel",
      "journey",
      "management_id",
      "code",
      "type_id",
      "role",
      "observation",
      "date_creation",
    ]);
    if (Object.keys(dataFormatted).length > 0) {
      /* consulta para traer los daños adicionales */
      let additionalDamage = await db.all(
        `SELECT a.id, a.name, a.date_creation
                                    FROM  container_reports_additional_damage ca
                                    INNER JOIN additional_damage a on a.id = ca.additional_damage_id
                                    WHERE ca.container_report_id = ?`,
        [dataFormatted.id]
      );
      const additionalDamageFormatted = await showData(
        "additional_damage",
        additionalDamage,
        ["id", "name", "date_creation"]
      );
      dataFormatted.additionalDamage = additionalDamageFormatted;
      /* consulta para traer los reparaciones */
      let repairs = await db.all(
        `SELECT r.id, r.container_element_id, e.name, r.location, r.position, r.container_report_id, r.photo
                                    FROM  repairs r
                                    INNER JOIN container_elements e on e.id = r.container_element_id
                                    WHERE container_report_id = ?`,
        [dataFormatted.id]
      );
      const repairsFormatted = await showData("repairs", repairs, [
        "id",
        "container_element_id",
        "name",
        "location",
        "position",
        "container_report_id",
        "photo",
      ]);
      /* consulta para traer los daños */
      for (let i = 0; i < repairsFormatted.length; i++) {
        let damages = await db.all(
          `SELECT rd.id, rd.repair_id ,rd.damage_id, d.name
                                    FROM  repair_damage rd
                                    INNER JOIN damage d on d.id = rd.damage_id
                                    WHERE rd.repair_id = ?`,
          [repairsFormatted[i].id]
        );
        const damagesFormatted = await showData("repair_damage", damages, [
          "id",
          "repair_id",
          "damage_id",
          "name",
        ]);
        repairsFormatted[i].repair_damage = damagesFormatted;
      }
      dataFormatted.repairs = repairsFormatted;
    }

    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getRepairs = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM repairs", []);
    const dataFormatted = await showData("repairs", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getRepairDamage = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      "SELECT * FROM repair_damage WHERE repair_id = 2",
      []
    );
    const dataFormatted = await showData("repair_damage", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const storeContainerReport = async (data) => {
  try {
    const register = await getRegister(
      "container_reports",
      "code",
      data.code,
      "management_id",
      data.management_id
    );
    if (Object.keys(register.data).length > 0) {
      return {
        status: 500,
        message:
          "Ya existe un registro creado con el mismo numero de contenedor!",
      };
    }

    const db = await openDatabase();
    let postData = await db.execSQL(
      `INSERT INTO container_reports (
                          consecutive,
                          management_id,
                          code,
                          type_id,
                          role,
                          observation,
                          date_creation)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Date.now() + Math.random(),
        data.management_id,
        data.code,
        data.type_id,
        data.role,
        data.observation,
        moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      ]
    );
    storeCReportADamage({
      container_report_id: postData,
      additional_damage_id: data.additional_damage_id,
    });
    /* storeRepairs({ container_report_id: postData, damages_repairs: data.repairs }) */
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const storeCReportADamage = async (data, sync = false) => {
  try {
    const additional_damage = data.additional_damage_id;
    const db = await openDatabase();
    if (sync === true) {
      const deleteData = await db.execSQL(
        "DELETE FROM container_reports_additional_damage WHERE container_report_id = (?)",
        [data.container_report_id]
      );
    }

    let postData = [];
    for (let i = 0; i < additional_damage.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO container_reports_additional_damage (
                            container_report_id,
                            additional_damage_id,
                            date_creation)
        VALUES (?, ?, ?)`,
        [
          data.container_report_id,
          additional_damage[i],
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );
    }
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
};

const storeRepairs = async (data) => {
  try {
    const repairs = data.damages_repairs;
    const db = await openDatabase();
    let postData = [];
    for (let i = 0; i < repairs.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO repairs (
                          container_element_id,
                          location,
                          position,
                          container_report_id,
                          photo,
                          date_creation)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          repairs[i].container_element_id,
          repairs[i].location,
          repairs[i].position,
          data.container_report_id,
          repairs[i].photo,
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );
      storeRepairDamage({
        repair_id: postData[i],
        damage_id: repairs[i].damage_id,
      });
    }

    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila repairs", error);
  }
};

const storeRepairDamage = async (data) => {
  try {
    const damages = data.damage_id;
    const db = await openDatabase();
    let postData = [];
    for (let i = 0; i < damages.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO repair_damage (
                            repair_id,
                            damage_id,
                            date_creation)
        VALUES (?, ?, ?)`,
        [
          data.repair_id,
          damages[i].id,
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );
    }
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila repair_damage", error);
  }
};

const updateContainerReport = async (item) => {
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(
      `UPDATE container_reports
                                      SET code = (?),
                                      type_id = (?),
                                      role = (?),
                                      observation = (?)
                                      WHERE id = (?)`,
      [item.code, item.type_id, item.role, item.observation, item.id]
    );
    storeCReportADamage(
      {
        container_report_id: item.id,
        additional_damage_id: item.additional_damage_id,
      },
      true
    );
    return updateData;
  } catch (error) {
    console.error("Error al editar el registro ", error);
  }
};

const deleteContainerReport = async (id) => {
  try {
    const db = await openDatabase();
    const register = await showContainerReport(id);
    if (Object.keys(register.data).length === 0) {
      return {
        status: 500,
        message: "No se encontro el reporte seleccionado, actualice la lista!",
      };
    }

    if (register.data.additionalDamage.length > 0) {
      const additionalDamage = register.data.additionalDamage;
      let deleteData = [];
      for (let i = 0; i < additionalDamage.length; i++) {
        deleteData[i] = await db.execSQL(
          "DELETE FROM container_reports_additional_damage WHERE container_report_id = ?",
          [register.data.id]
        );
      }
    }

    if (register.data.repairs.length > 0) {
      const repairs = register.data.repairs;
      let deleteData = [];
      for (let i = 0; i < repairs.length; i++) {
        const repair_damage = repairs[i].repair_damage;
        let delete_repair_damage = [];
        if (repair_damage.length > 0) {
          for (let i = 0; i < repair_damage.length; i++) {
            delete_repair_damage[i] = await db.execSQL(
              "DELETE FROM repair_damage WHERE repair_id = ?",
              [repair_damage[i].repair_id]
            );
          }
        }
        deleteData[i] = await db.execSQL("DELETE FROM repairs WHERE id = ?", [
          repairs[i].id,
        ]);
      }
    }

    const data = await db.execSQL(
      "DELETE FROM container_reports WHERE id = ?",
      [id]
    );
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

module.exports = {
  storeContainerReport,
  getContainerReport,
  getRepairs,
  getRepairDamage,
  deleteContainerReport,
  updateContainerReport,
};
