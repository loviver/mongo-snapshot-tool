#!/usr/bin/env node
const { execSync } = require("child_process");
const { MongoClient } = require("mongodb");
const fs = require("fs");

const config = require("./config");

const url = config.database.sourceUri;

const exportDir = config.backup.timeMarker
  ? `${config.backup.exportDirectory}/${new Date().toISOString().replace(/[:.]/g, '-')}`
  : `${config.backup.exportDirectory}/main`;

const client = new MongoClient(url);

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

async function dumpCollections() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");

    const db = client.db();
    const collections = await db.listCollections().toArray();

    for (const collection of collections) {
      const colName = collection.name;

      if (
        colName.startsWith("system.") || 
        config.backup.ignoreCollections.includes(colName) || 
        collection.type === "view"
      ) {
        console.log(`Ignorando: ${colName} (vista o colección especial)`);
        continue;
      }

      console.log(`Exportando colección: ${colName}...`);

      const dumpCommand = `"${config.tools.mongodump}" --uri="${url}" --collection=${colName} --out="${exportDir}" --gzip`;
      execSync(dumpCommand, { stdio: "inherit" });

      console.log(`Colección ${colName} exportada.`);
    }

    console.log("🚀 Dump de la base de datos completado.");
  } catch (error) {
    console.error("❌ Error al hacer el dump:", error);
  } finally {
    await client.close();
  }
}

dumpCollections();