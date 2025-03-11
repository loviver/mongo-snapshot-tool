const path = require("path");

const databaseName = "example-db";

const config = {
  database: {
    sourceUri: "mongodb://localhost:27017/admin", // URI de la base de datos de origen
    destinationUri: "mongodb://192.1.1.2:27017/admin" // URI de la base de datos de destino
  },

  backup: {
    exportDirectory: path.resolve(__dirname, "exports", databaseName),
    ignoreCollections: ["admin.CronJobLog"], // Colecciones a excluir del backup
    timeMarker: true // Agregar marca de tiempo a la carpeta de exportación
  },

  restore: {
    timeMarker: "2025-03-11T15-15-01-526Z",
    deleteIfExists: true, // Si es true, eliminara las colecciones existentes antes de restaurar
  },

  tools: {
    mongodump: path.resolve("C:/Program Files/MongoDB/Tools/bin/mongodump"), // Ruta a mongodump
    mongorestore: path.resolve("C:/Program Files/MongoDB/Tools/bin/mongorestore") // Ruta a mongorestore
  }
};

module.exports = config;
