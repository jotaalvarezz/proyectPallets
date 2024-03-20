//Consulta para los select del modulo de evidencias
const { openDatabase, showData } = require('~/sqlite/openDatabase');

const getContainerReport = async (management_id) => {
  try {
    const db = await openDatabase();
    const data = await db.all(`SELECT cr.id, m.name, m.journey, cr.management_id,
                                      cr.code, cr.type_id, cr.role, cr.additional_damage_id,
                                      cr.observation, cr.date_creation
                                FROM container_reports cr
                                INNER JOIN management m on m.id = cr.management_id
                                WHERE cr.management_id = ?`, [management_id]);
    const dataFormatted = await showData('container_reports', data, ['id', 'vessel', 'journey', 'management_id', 'code', 'type_id', 'role', 'additional_damage_id', 'observation', 'date_creation'])
    /* consulta para traer los reparaciones */
    for (let i = 0; i < dataFormatted.length; i++) {
      let repairs = await db.all(`SELECT r.id, r.container_element_id, e.name, r.state
                                    FROM  repairs r
                                    INNER JOIN container_elements e on e.id = r.container_element_id
                                    WHERE container_report_id = ?`, [dataFormatted[i].id]);
      const repairsFormatted = await showData('repairs', repairs, ['id', 'container_element_id' ,'name', 'state'])
      /* consulta para traer los daños */
      for (let i = 0; i < repairsFormatted.length; i++) {
        let damages = await db.all(`SELECT rd.damage_id, d.name
                                    FROM  repair_damage rd
                                    INNER JOIN damage d on d.id = rd.damage_id
                                    WHERE rd.repair_id = ?`, [repairsFormatted[i].id]);
        const damagesFormatted = await showData('repair_damage', damages, ['id', 'name'])
        repairsFormatted[i].repair_damage = damagesFormatted
      }
      dataFormatted[i].repairs = repairsFormatted
    }
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const getRepairs = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM repairs", []);
    const dataFormatted = await showData('repairs', data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const getRepairDamage = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM repair_damage WHERE repair_id = 2", []);
    const dataFormatted = await showData('repair_damage', data)
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const storeContainerReport = async (data) => {
  try {
    const db = await openDatabase();
    let postData = await db.execSQL(
      `INSERT INTO container_reports (
                          management_id,
                          code,
                          type_id,
                          role,
                          additional_damage_id,
                          observation,
                          date_creation)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [data.management_id, data.code, data.type_id,
      data.role, data.additional_damage_id, data.observation,
      new Date()]
    );

    storeRepairs({ container_report_id: postData, damages_repairs: data.damages_repairs })
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila", error);
  }
}

const storeRepairs = async (data) => {
  try {
    const repairs = data.damages_repairs
    const db = await openDatabase();
    let postData = []
    for (let i = 0; i < repairs.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO repairs (
                          container_element_id,
                          location,
                          position,
                          container_report_id,
                          state,
                          date_creation)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [repairs[i].container_element_id, repairs[i].location, repairs[i].position,
        data.container_report_id, repairs[i].state, new Date()]
      );
      storeRepairDamage({ repair_id: postData[i], damage_id: repairs[i].damage_id })
    }

    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila repairs", error);
  }
}

const storeRepairDamage = async (data) => {
  try {
    const damages = data.damage_id
    const db = await openDatabase();
    let postData = []
    for (let i = 0; i < damages.length; i++) {
      postData[i] = await db.execSQL(
        `INSERT INTO repair_damage (
                            repair_id,
                            damage_id,
                            date_creation)
        VALUES (?, ?, ?)`,
        [data.repair_id, damages[i].id, new Date()]
      );
    }
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila repair_damage", error);
  }
}

module.exports = {
  storeContainerReport,
  getContainerReport,
  getRepairs,
  getRepairDamage
}

