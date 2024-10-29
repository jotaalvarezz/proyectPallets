export const Querys = [
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
