//Consulta para los select del modulo de reparaciones
const { openDatabase, showData, getRegister, first } = require('~/sqlite/openDatabase');
const moment = require('moment');

const showRepair = async (id) => {
  try {
    const db = await openDatabase();
    const data = await db.get(`SELECT r.id, r.container_element_id, e.name, r.location, r.position, r.container_report_id, r.photo
                                FROM  repairs r
                                INNER JOIN container_elements e on e.id = r.container_element_id
                                WHERE r.id = ?`, [id]);
    const dataFormatted = await first('repairs', data, ['id', 'container_element_id', 'name', 'location', 'position', 'container_report_id', 'photo'])
    console.log("show ", dataFormatted)
    if (Object.keys(dataFormatted).length > 0) {
      const damages = await db.all(`SELECT rd.id, rd.repair_id ,rd.damage_id, d.name
                                    FROM  repair_damage rd
                                    INNER JOIN damage d on d.id = rd.damage_id
                                    WHERE rd.repair_id = ?`, [dataFormatted.id]);
      const damagesFormatted = await showData('repair_damage', damages, ['id', 'repair_id', 'damage_id','name'])
      dataFormatted.repair_damage = damagesFormatted
    }
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los datos ", error);
  }
}

const storeRepair = async (data) => {
  console.log("data controller repair ", data.repair.damage_id)
  try {
    const repair = data.repair
    const db = await openDatabase();
    let postData = await db.execSQL(
      `INSERT INTO repairs (
                          container_element_id,
                          location,
                          position,
                          container_report_id,
                          photo,
                          date_creation)
        VALUES (?, ?, ?, ?, ?, ?)`,
      [repair.container_element_id, repair.location, repair.position,
      data.container_report_id, repair.photo, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
    );
    console.log("post Dta ", postData)
    storeRepairDamage({ repair_id: postData, damage_id: repair.damage_id })
    const dataRepair = showRepair(postData)
    return dataRepair;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila repairs", error);
  }
}


const storeRepairDamage = async (data) => {
  try {
    console.log("repair damages ", data)
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
        [data.repair_id, damages[i].id, moment(new Date()).format("YYYY-MM-DD HH:mm:ss")]
      );
    }
    return postData;
  } catch (error) {
    console.log("ocurrio un problema al insertar la fila repair_damage", error);
  }
}

const deleteRepair = async (id) => {
  try {
    const db = await openDatabase();
    const register = await showRepair(id)
    console.log("register sss", register)
    if (Object.keys(register.data).length === 0) {
      return { status: 500, message: "No se encntro la reparacion seleccionada, actualice la lista!" }
    }

    if (register.data.repair_damage.length > 0) {
      const repairs_damage = register.data.repair_damage
      let deleteData = []
      for (let i = 0; i < repairs_damage.length; i++) {
        deleteData[i] = await db.execSQL("DELETE FROM repair_damage WHERE repair_id = ?", [repairs_damage[i].repair_id]);
      }
    }
    /* return { status: 500, message: "Ya existe un registro creado con el mismo nombre!" } */
    const data = await db.execSQL("DELETE FROM repairs WHERE id = ?", [id]);
    return data;

  } catch (error) {
    console.log("Hubo un error intentando eliminar el registro ", error);
  }
}

module.exports = {
  storeRepair,
  deleteRepair
}
