#!/usr/bin/env node
const { execSync } = require("child_process");
const fs = require("fs");

const config = require("./config");

const mongoUri = config.database.destinationUri;
const exportDir = `${config.backup.exportDirectory}/admin`;

if (!fs.existsSync(exportDir)) {
  process.exit(1);
}

const files = fs.readdirSync(exportDir);

if (files.length === 0) {
  process.exit(1);
}

try {
  if (config.restore.deleteIfExists === true) {
    console.log("🔄 Eliminando colecciones existentes antes de la restauración...");
    execSync("node ./tools/dropCollectionsFromExport.js", { stdio: "inherit" });
  }

  console.log("Restaurando base de datos desde los dumps BSON...");
  execSync(
    `"${config.tools.mongorestore}" --gzip --uri="${mongoUri}" --dir="${exportDir}" --drop`,
    { stdio: "inherit" }
  );
  console.log("Restauración completada.");
} catch (error) {
  console.error("❌ Error al restaurar la base de datos:", error);
}
