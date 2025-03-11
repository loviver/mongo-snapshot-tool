const path = require("path");

const databaseName = "example-db";

const config = {
  database: {
    sourceUri: "", // URI de la base de datos de origen
    destinationUri: "" // URI de la base de datos de destino
  },

  backup: {
    exportDirectory: path.resolve(__dirname, "exports", databaseName),
    ignoreCollections: ["admin.CronJobLog"], // Colecciones a excluir del backup
  },

  restore: {
    deleteIfExists: true, // Si es true, eliminara las colecciones existentes antes de restaurar
  },

  tools: {
    mongodump: path.resolve("C:/Program Files/MongoDB/Tools/bin/mongodump"), // Ruta a mongodump
    mongorestore: path.resolve("C:/Program Files/MongoDB/Tools/bin/mongorestore") // Ruta a mongorestore
  }
};

module.exports = config;
