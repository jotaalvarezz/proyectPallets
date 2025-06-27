//Consulta para los select del modulo de gestion y tipos de gestion
const {
  openDatabase,
  showData,
  showOneData,
  getRegister,
  encriptImg,
  first,
} = require("~/sqlite/openDatabase");

const { getRepairsReport } = require("~/sqlite/queries/repair");

const moment = require("moment");

const getManagementAll = async () => {
  try {
    const db = await openDatabase();
    const post = await db.all("SELECT * FROM management",[])
    const dataFormatted = await showData("management", post);
    return { data: dataFormatted };
  } catch(error) {
    console.log("error al crear registro en types management ", error);
  }
}

const getReportsAll = async () => {
  try {
    const db = await openDatabase();
    const post = await db.all("SELECT * FROM container_reports",[])
    const dataFormatted = await showData("container_reports", post);
    return { data: dataFormatted };
  } catch(error) {
    console.log("error al crear registro en types container_reports ", error);
  }
}

const storeTypesManagement = async (data) => {
  try {
    const db = await openDatabase();
    const DefaultTypesManagement = data.types_management;
    let post = [];
    for (let i = 0; i < DefaultTypesManagement.length; i++) {
      post[i] = db.execSQL(
        `INSERT INTO types_management (id, name, icon, status, date_creation) VALUES (?, ?, ?, ?, ?)`,
        [
          DefaultTypesManagement[i].id,
          DefaultTypesManagement[i].name,
          DefaultTypesManagement[i].icon,
          1,
          moment(DefaultTypesManagement[i].created_at).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
        ]
      );
    }
    return post;
  } catch (error) {
    console.log("error al crear registro en types management ", error);
  }
};

const getTypesManagement = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM types_management", []);
    const dataFormatted = await showData("types_management", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const showTypesManagement = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.get("SELECT * FROM types_management WHERE id = ?", [
      id,
    ]);
    const dataFormatted = await first("types_management", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const getAllManagements = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT cr.id, cr.consecutive, m.name, m.journey, cr.management_id, m.type_management_id, tm.status, p.id,
                                      cr.prefix, cr.code, cr.type_id, t.name, cr.role, m.titular_name, m.signature,
                                      cr.observation, cr.date_creation
                                FROM container_reports cr
                                INNER JOIN management m on m.id = cr.management_id
                                INNER JOIN types_management tm on tm.id = m.type_management_id
                                INNER JOIN types t on t.id = cr.type_id
                                INNER JOIN  prefixes p on p.prefix = cr.prefix`,
      []
    );
    const dataFormatted = await showData("container_reports", data, [
      "id",
      "consecutive",
      "vessel",
      "journey",
      "management_id",
      "type_management_id",
      "status",
      "prefixId",
      "prefix",
      "code",
      "type_id",
      "nameType",
      "role",
      "titular_name",
      "signature",
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
                                    LEFT JOIN container_elements e on e.id = r.container_element_id
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
                                    LEFT JOIN damage d on d.id = rd.damage_id
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

const getAllManagementsYard = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT cr.id, cr.consecutive, m.name, m.journey, cr.management_id, m.type_management_id, tm.status, p.id,
                                      cr.prefix, cr.code, cr.type_id, t.name, cr.role, m.titular_name, m.signature,
                                      cr.observation, cr.date_creation
                                FROM container_reports cr
                                INNER JOIN management m on m.id = cr.management_id
                                INNER JOIN types_management tm on tm.id = m.type_management_id
                                INNER JOIN types t on t.id = cr.type_id
                                INNER JOIN  prefixes p on p.prefix = cr.prefix
                                WHERE m.type_management_id = ?`,
      [id]
    );
    const dataFormatted = await showData("container_reports", data, [
      "id",
      "consecutive",
      "vessel",
      "journey",
      "management_id",
      "type_management_id",
      "status",
      "prefixId",
      "prefix",
      "code",
      "type_id",
      "nameType",
      "role",
      "titular_name",
      "signature",
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
                                    LEFT JOIN container_elements e on e.id = r.container_element_id
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
                                    LEFT JOIN damage d on d.id = rd.damage_id
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

const getManagements = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT * FROM management
                                  WHERE type_management_id = ?`,
      [id]
    );
    const dataFormatted = await showData("management", data);
    for (let i = 0; i < dataFormatted.length; i++) {
      const containersReport = await db.all(
        `SELECT id, prefix || code AS code
                                              FROM container_reports
                                              WHERE management_id = ?`,
        [dataFormatted[i].id]
      );
      const reportsFormatted = await showData(
        "container_reports",
        containersReport,
        ["id", "code"]
      );
      dataFormatted[i].container_reports = reportsFormatted;
    }
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const showManagement = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(
      `SELECT * FROM management
                                  WHERE id = ?`,
      [id]
    );
    const dataFormatted = await showOneData("management", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
};

const storeManagement = async (data) => {
  try {
    const register = await getRegister(
      "management",
      "name",
      data.name,
      "type_management_id",
      data.type_management_id
    );
    if (Object.keys(register.data).length > 0) {
      return {
        status: 500,
        message: "Ya existe un registro creado con el mismo nombre!",
      };
    }

    const db = await openDatabase();
    let postData = await db.execSQL(
      `INSERT INTO management (
                              consecutive,
                              type_management_id,
                              name,
                              journey,
                              titular_name,
                              signature,
                              date_creation)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Date.now() + Math.random(),
        data.type_management_id,
        data.name,
        data.journey,
        data.titular_name,
        data.signature,
        moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      ]
    );
    const management = showManagement(postData);
    return management;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila management", error);
  }
};

const deleteManagement = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.execSQL("DELETE FROM management WHERE id = ?", [id]);
    return data;
  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
};

const updateManagement = async (item) => {
  try {
    const db = await openDatabase();
    let updateData = db.execSQL(
      `UPDATE management
              SET name = (?),
                  journey = (?),
                  titular_name = (?),
                  signature = (?)
              WHERE id = (?)`,
      [item.name, item.journey, item.titular_name, item.signature, item.id]
    );
    const management = showManagement(item.id);
    return management;
  } catch (error) {
    console.error("Error al editar el barco ", error);
  }
};

const sendEvidenceReports = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all(`SELECT * FROM management m `, []);
    const dataFormatted = await showData("management", data);
    for (let i = 0; i < dataFormatted.length; i++) {
      dataFormatted[i].signatureCrypt = await encriptImg(
        dataFormatted[i].signature
      );
      const dataContainerReports = await db.all(
        `SELECT id,
                consecutive,
                management_id,
                prefix || code  AS code,
                type_id,
                role,
                observation,
                date_creation
              FROM container_reports cr
              WHERE cr.management_id = ?`,
        [dataFormatted[i].id]
      );
      const ContainerReportsFormatted = await showData(
        "container_reports",
        dataContainerReports,
        [
          "id",
          "consecutive",
          "management_id",
          "code",
          "type_id",
          "role",
          "observation",
          "date_creation",
        ]
      );
      for (let i = 0; i < ContainerReportsFormatted.length; i++) {
        /* consulta para traer los daños adicionales */
        let additionalDamage = await db.all(
          `SELECT a.id, a.name, a.date_creation
                                FROM  container_reports_additional_damage ca
                                INNER JOIN additional_damage a on a.id = ca.additional_damage_id
                                WHERE ca.container_report_id = ?`,
          [ContainerReportsFormatted[i].id]
        );
        const additionalDamageFormatted = await showData(
          "additional_damage",
          additionalDamage,
          ["id", "name", "date_creation"]
        );
        ContainerReportsFormatted[i].additionalDamage =
          additionalDamageFormatted;
        /* consulta para traer los reparaciones */
        let repairs = await db.all(
          `SELECT r.id, r.container_element_id, e.name, r.location, r.position, r.container_report_id, r.photo
                                FROM  repairs r
                                INNER JOIN container_elements e on e.id = r.container_element_id
                                WHERE container_report_id = ?`,
          [ContainerReportsFormatted[i].id]
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
          repairsFormatted[i].photoCrypt = await encriptImg(
            repairsFormatted[i].photo
          );
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
        ContainerReportsFormatted[i].repairs = repairsFormatted;
      }
      dataFormatted[i].containerReports = ContainerReportsFormatted;
    }

    const count = await db.all(
      `SELECT
        m.type_management_id,
        tm.name,
        CASE WHEN tm.status = 1 THEN true
        ELSE false
        END AS status,
        COUNT(*) AS count
      FROM management m
      INNER JOIN types_management tm on tm.id = m.type_management_id
      GROUP BY type_management_id `,
      []
    );
    const countFormatted = await showData("management", count, [
      "type_management_id",
      "name",
      "status",
      "amount",
    ]);

    return { data: dataFormatted, managementsStatus: countFormatted };
  } catch (error) {
    console.error("Error al editar management ", error);
  }
};

const finishOperations = async (id, status) => {
  try {
    const db = await openDatabase();
    const managements = await getManagements(id);

    /* Validad si existen gestiones creadas */
    if (managements.data.length === 0) {
      return {
        status: 400,
        message: "No hay Gestiones creadas...",
        error: "Sin Gestion",
      };
    }

    /* Validacion de si existen reportes creados dentro de las gestiones */
    for (let i = 0; i < managements.data.length; i++) {
      if (managements.data[i].container_reports.length === 0) {
        return {
          status: 400,
          message:
            `No hay reportes creados en la gestion ` +
            managements.data[i].name +
            ` \n la gestion debe tener al menos un reporte, por favor verifique...`,
          error: "Sin Reporte",
        };
      }

      /* Validacion para verificar que los reportes tengan reparaciones registradas*/
      let reports = managements.data[i].container_reports;
      for (let j = 0; j < reports.length; j++) {
        let repairs = await getRepairsReport(reports[j].id);
        if (repairs.data.length === 0) {
          return {
            status: 400,
            message:
              `Verifique que el reporte del contenedor ` +
              reports[j].code +
              `, contenga reparaciones registradas.` +
              `\n\n* en la gestion ` +
              managements.data[i].name,
            error: "Reporte Invalido",
          };
        }
      }

      /* Validacion para verificar que las gestiones contengan la firma correspondinte del tirular */
      if (
        managements.data[i].signature === "" ||
        managements.data[i].signature === null
      ) {
        return {
          status: 400,
          message:
            `Los reportes de la gestion en ` +
            managements.data[i].name +
            ` no tienen la firma del titular!`,
          error: "Firma Vacia",
        };
      }
    }

    let updateData = db.execSQL(
      `UPDATE types_management
                SET status  = (?)
                WHERE id = (?)`,
      [!status ? 0 : 1, id]
    );
    const post = showTypesManagement(id);
    return post;
  } catch (error) {
    console.error("Error al finalizar la operacion", error);
  }
};

module.exports = {
  getTypesManagement,
  storeManagement,
  getAllManagements,
  getManagements,
  deleteManagement,
  updateManagement,
  sendEvidenceReports,
  finishOperations,
  showTypesManagement,
  storeTypesManagement,
  getManagementAll,
  getReportsAll,
  getAllManagementsYard
};
