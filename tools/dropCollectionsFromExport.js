#!/usr/bin/env node
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const config = require("../config");

const mongoUri = config.database.sourceUri;
const exportDir = `${config.backup.exportDirectory}/admin`;

async function deleteCollections() {
  console.log("🔗 Conectando a MongoDB...");

  const client = new MongoClient(mongoUri);

  try {
    await client.connect();
    const db = client.db();

    // Verificar si exportDir existe
    if (!fs.existsSync(exportDir)) {
      console.log(`⚠️ No se encontró el directorio de exportaciones. No hay nada que borrar. ${exportDir}`);
      return;
    }

    const files = fs.readdirSync(exportDir);
    const collectionsToDelete = files
      .filter(file => file.endsWith(".bson.gz")) // Solo archivos BSON comprimidos
      .map(file => path.basename(file, ".bson.gz"))
      .filter(name => !name.startsWith("system.")); // Evitar eliminar colecciones del sistema

    if (collectionsToDelete.length === 0) {
      console.log("⚠️ No hay colecciones para eliminar.");
      return;
    }

    console.log(`🔍 Colecciones encontradas en la carpeta: ${collectionsToDelete.join(", ")}`);

    const collectionsExisting = (await db.listCollections().toArray());
    
    const existingCollections = collectionsExisting.map(c => c.name);

    const validCollections = collectionsToDelete.filter(name => existingCollections.includes(name));

    if (validCollections.length === 0) {
      console.log("Ninguna de las colecciones en la carpeta existe en la base de datos.", collectionsExisting);
      return;
    }

    console.log(`🗑️ Se eliminarán las siguientes colecciones: ${validCollections.join(", ")}`);

    for (const collectionName of validCollections) {
      console.log(`🚮 Eliminando colección: ${collectionName}...`);
      await db.collection(collectionName).drop();
      console.log(`✅ Colección eliminada: ${collectionName}`);
    }

    console.log("✅ Eliminación de colecciones completada.");
  } catch (error) {
    console.error("❌ Error al eliminar colecciones:", error);
  } finally {
    await client.close();
    console.log("🔌 Conexión cerrada.");
  }
}

deleteCollections();