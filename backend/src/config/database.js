import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zur JSON-Datei
const dbPath = path.join(__dirname, '../../db.json');

// Datenbank-Objekt
const database = {
  data: null,

  // Datenbank vom Disk laden
  async read() {
    try {
      const content = fs.readFileSync(dbPath, 'utf-8');
      this.data = JSON.parse(content);
    } catch (error) {
      console.error('Fehler beim Lesen der Datenbank:', error);
      this.data = { categories: [], products: [], users: [], orders: [], orderItems: [], cartItems: [] };
    }
  },

  // Datenbank auf Disk speichern
  async write() {
    try {
      fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Fehler beim Speichern der Datenbank:', error);
    }
  },

  // Beim Start: Datenbank laden
  async init() {
    await this.read();
    if (!this.data || !this.data.products) {
      console.log('✓ Neue Datenbank erstellt');
      this.data = {
        categories: [],
        products: [],
        users: [],
        orders: [],
        orderItems: [],
        cartItems: [],
      };
      await this.write();
    }
    console.log('✓ Datenbank geladen');
  },
};

export default database;
