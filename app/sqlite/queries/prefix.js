const { openDatabase, showData } = require("~/sqlite/openDatabase");
const moment = require("moment");

const storePrefixes = async (data) => {
  try {
    const db = await openDatabase();
    let post = [];
    for (let i = 0; i < data.length; i++) {
      post[i] = await db.execSQL(
        `INSERT INTO prefixes (id, prefix, date_creation) VALUES (?, ? ,?)`,
        [
          data[i].id,
          data[i].prefix,
          moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        ]
      );
    }
    return post;
  } catch (error) {
    return {
      title:"ERROR",
      message:"Ocurrio un problema al crear los prefijos. \n"+error.message,
      code:406
    }
  }
};

const getPrefixes = async () => {
  try {
    const db = await openDatabase();
    const data = await db.all("SELECT * FROM prefixes", []);
    const dataFormatted = await showData("prefixes", data);
    return { data: dataFormatted };
  } catch (error) {
    console.log("error al traer los prefijos ", error);
  }
};

module.exports = {
  storePrefixes,
  getPrefixes,
};
