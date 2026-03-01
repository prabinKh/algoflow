import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("algoflow.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS algorithms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    complexity TEXT, -- JSON string
    code TEXT,       -- JSON string
    explanation TEXT, -- JSON string
    assets TEXT      -- JSON string
  );

  CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY,
    icon TEXT DEFAULT 'Box'
  );
`);

// Seed data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM algorithms").get() as any;
if (count.count === 0) {
  console.log("Seeding database...");
  const categories = [
    { name: 'Sorting Algorithms', icon: 'ListOrdered' },
    { name: 'Search Algorithms', icon: 'Search' },
    { name: 'Graph Theory', icon: 'Share2' },
    { name: 'Dynamic Programming', icon: 'Layers' },
    { name: 'Data Structures', icon: 'Database' }
  ];
  
  const insertCat = db.prepare("INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?)");
  categories.forEach(c => insertCat.run(c.name, c.icon));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/algorithms", (req, res) => {
    const rows = db.prepare("SELECT * FROM algorithms").all();
    const algorithms = rows.map((row: any) => ({
      ...row,
      complexity: JSON.parse(row.complexity),
      code: JSON.parse(row.code),
      explanation: JSON.parse(row.explanation),
      assets: JSON.parse(row.assets || '[]')
    }));
    res.json(algorithms);
  });

  app.get("/api/categories", (req, res) => {
    const rows = db.prepare("SELECT * FROM categories").all();
    res.json(rows);
  });

  app.post("/api/categories", (req, res) => {
    const { name, icon } = req.body;
    const stmt = db.prepare("INSERT OR IGNORE INTO categories (name, icon) VALUES (?, ?)");
    try {
      stmt.run(name, icon || 'Box');
      res.status(201).json({ name, icon: icon || 'Box' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/categories/:name", (req, res) => {
    const { name } = req.params;
    const stmt = db.prepare("DELETE FROM categories WHERE name = ?");
    const result = stmt.run(name);
    if (result.changes === 0) {
      res.status(404).json({ error: "Category not found" });
    } else {
      res.status(204).send();
    }
  });

  app.post("/api/algorithms", (req, res) => {
    const algo = req.body;
    const stmt = db.prepare(`
      INSERT INTO algorithms (id, name, category, description, icon, complexity, code, explanation, assets)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    try {
      stmt.run(
        algo.id,
        algo.name,
        algo.category,
        algo.description,
        algo.icon,
        JSON.stringify(algo.complexity),
        JSON.stringify(algo.code),
        JSON.stringify(algo.explanation),
        JSON.stringify(algo.assets || [])
      );
      res.status(201).json(algo);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.put("/api/algorithms/:id", (req, res) => {
    const { id } = req.params;
    const algo = req.body;
    const stmt = db.prepare(`
      UPDATE algorithms 
      SET name = ?, category = ?, description = ?, icon = ?, complexity = ?, code = ?, explanation = ?, assets = ?
      WHERE id = ?
    `);
    try {
      const result = stmt.run(
        algo.name,
        algo.category,
        algo.description,
        algo.icon,
        JSON.stringify(algo.complexity),
        JSON.stringify(algo.code),
        JSON.stringify(algo.explanation),
        JSON.stringify(algo.assets || []),
        id
      );
      if (result.changes === 0) {
        res.status(404).json({ error: "Algorithm not found" });
      } else {
        res.json(algo);
      }
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.delete("/api/algorithms/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("DELETE FROM algorithms WHERE id = ?");
    const result = stmt.run(id);
    if (result.changes === 0) {
      res.status(404).json({ error: "Algorithm not found" });
    } else {
      res.status(204).send();
    }
  });

  // Bulk Import
  app.post("/api/algorithms/import", (req, res) => {
    const algorithms = req.body;
    if (!Array.isArray(algorithms)) {
      return res.status(400).json({ error: "Expected an array of algorithms" });
    }

    const insert = db.prepare(`
      INSERT OR REPLACE INTO algorithms (id, name, category, description, icon, complexity, code, explanation, assets)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((algos) => {
      for (const algo of algos) {
        insert.run(
          algo.id,
          algo.name,
          algo.category,
          algo.description,
          algo.icon,
          JSON.stringify(algo.complexity),
          JSON.stringify(algo.code),
          JSON.stringify(algo.explanation),
          JSON.stringify(algo.assets || [])
        );
      }
    });

    try {
      transaction(algorithms);
      res.json({ status: "success", count: algorithms.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
