import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { algorithms as initialAlgorithms } from "./src/data/algorithms.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("database.sqlite");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS algorithms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    description TEXT NOT NULL,
    complexity TEXT NOT NULL,
    code TEXT NOT NULL,
    explanation TEXT NOT NULL,
    assets TEXT,
    questions TEXT,
    createdAt TEXT,
    updatedAt TEXT
  );
  
  CREATE TABLE IF NOT EXISTS categories (
    name TEXT PRIMARY KEY,
    icon TEXT NOT NULL,
    algorithms TEXT NOT NULL
  );
`);

// Seed initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM algorithms").get() as { count: number };
if (count.count === 0) {
  const insertAlgo = db.prepare(`
    INSERT INTO algorithms (id, name, category, icon, description, complexity, code, explanation, assets, questions, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const now = new Date().toISOString();
  for (const algo of initialAlgorithms) {
    insertAlgo.run(
      algo.id,
      algo.name,
      algo.category,
      algo.icon || null,
      algo.description,
      JSON.stringify(algo.complexity),
      JSON.stringify(algo.code),
      JSON.stringify(algo.explanation),
      JSON.stringify(algo.assets || []),
      JSON.stringify(algo.questions || []),
      now,
      now
    );
  }

  // Seed categories
  const insertCat = db.prepare("INSERT INTO categories (name, icon, algorithms) VALUES (?, ?, ?)");
  const categories = [
    { name: 'Sorting Algorithms', icon: 'ListOrdered', algorithms: ['bubble-sort', 'merge-sort', 'quick-sort'] },
    { name: 'Searching Algorithms', icon: 'Search', algorithms: ['binary-search'] },
    { name: 'Graphs', icon: 'Share2', algorithms: ['dfs', 'bfs', 'dijkstra'] },
    { name: 'Dynamic Programming', icon: 'Layers', algorithms: ['knapsack-01'] }
  ];
  for (const cat of categories) {
    insertCat.run(cat.name, cat.icon, JSON.stringify(cat.algorithms));
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/algorithms", (req, res) => {
    const rows = db.prepare("SELECT * FROM algorithms").all();
    const algos = rows.map((row: any) => ({
      ...row,
      complexity: JSON.parse(row.complexity),
      code: JSON.parse(row.code),
      explanation: JSON.parse(row.explanation),
      assets: JSON.parse(row.assets || "[]"),
      questions: JSON.parse(row.questions || "[]")
    }));
    res.json(algos);
  });

  app.get("/api/algorithms/:id", (req, res) => {
    const row = db.prepare("SELECT * FROM algorithms WHERE id = ?").get(req.params.id) as any;
    if (!row) return res.status(404).json({ error: "Not found" });
    res.json({
      ...row,
      complexity: JSON.parse(row.complexity),
      code: JSON.parse(row.code),
      explanation: JSON.parse(row.explanation),
      assets: JSON.parse(row.assets || "[]"),
      questions: JSON.parse(row.questions || "[]")
    });
  });

  app.post("/api/algorithms", (req, res) => {
    const algo = req.body;
    const now = new Date().toISOString();
    try {
      db.transaction(() => {
        db.prepare(`
          INSERT INTO algorithms (id, name, category, icon, description, complexity, code, explanation, assets, questions, createdAt, updatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          algo.id,
          algo.name,
          algo.category,
          algo.icon || null,
          algo.description,
          JSON.stringify(algo.complexity),
          JSON.stringify(algo.code),
          JSON.stringify(algo.explanation),
          JSON.stringify(algo.assets || []),
          JSON.stringify(algo.questions || []),
          now,
          now
        );

        // Update categories
        const cat = db.prepare("SELECT * FROM categories WHERE name = ?").get(algo.category) as any;
        if (cat) {
          const algos = JSON.parse(cat.algorithms);
          if (!algos.includes(algo.id)) {
            algos.push(algo.id);
            db.prepare("UPDATE categories SET algorithms = ? WHERE name = ?").run(JSON.stringify(algos), algo.category);
          }
        } else {
          db.prepare("INSERT INTO categories (name, icon, algorithms) VALUES (?, ?, ?)")
            .run(algo.category, 'Box', JSON.stringify([algo.id]));
        }
      })();
      res.status(201).json(algo);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put("/api/algorithms/:id", (req, res) => {
    const id = req.params.id;
    const algo = req.body;
    const now = new Date().toISOString();
    try {
      db.transaction(() => {
        const existing = db.prepare("SELECT category FROM algorithms WHERE id = ?").get(id) as any;
        if (!existing) {
          throw new Error("Algorithm not found");
        }

        db.prepare(`
          UPDATE algorithms 
          SET name = ?, category = ?, icon = ?, description = ?, complexity = ?, code = ?, explanation = ?, assets = ?, questions = ?, updatedAt = ?
          WHERE id = ?
        `).run(
          algo.name,
          algo.category,
          algo.icon || null,
          algo.description,
          JSON.stringify(algo.complexity),
          JSON.stringify(algo.code),
          JSON.stringify(algo.explanation),
          JSON.stringify(algo.assets || []),
          JSON.stringify(algo.questions || []),
          now,
          id
        );

        // Update categories if category changed
        if (existing.category !== algo.category) {
          // Remove from old category
          const oldCat = db.prepare("SELECT * FROM categories WHERE name = ?").get(existing.category) as any;
          if (oldCat) {
            const oldAlgos = JSON.parse(oldCat.algorithms).filter((aId: string) => aId !== id);
            db.prepare("UPDATE categories SET algorithms = ? WHERE name = ?").run(JSON.stringify(oldAlgos), existing.category);
          }
          // Add to new category
          const newCat = db.prepare("SELECT * FROM categories WHERE name = ?").get(algo.category) as any;
          if (newCat) {
            const newAlgos = JSON.parse(newCat.algorithms);
            if (!newAlgos.includes(id)) {
              newAlgos.push(id);
              db.prepare("UPDATE categories SET algorithms = ? WHERE name = ?").run(JSON.stringify(newAlgos), algo.category);
            }
          } else {
            db.prepare("INSERT INTO categories (name, icon, algorithms) VALUES (?, ?, ?)")
              .run(algo.category, 'Box', JSON.stringify([id]));
          }
        }
      })();
      res.json(algo);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete("/api/algorithms/:id", (req, res) => {
    const id = req.params.id;
    try {
      db.transaction(() => {
        const algo = db.prepare("SELECT category FROM algorithms WHERE id = ?").get(id) as any;
        if (algo) {
          db.prepare("DELETE FROM algorithms WHERE id = ?").run(id);
          
          // Update categories
          const cat = db.prepare("SELECT * FROM categories WHERE name = ?").get(algo.category) as any;
          if (cat) {
            const algos = JSON.parse(cat.algorithms).filter((aId: string) => aId !== id);
            db.prepare("UPDATE categories SET algorithms = ? WHERE name = ?").run(JSON.stringify(algos), algo.category);
          }
        }
      })();
      res.status(204).send();
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get("/api/categories", (req, res) => {
    const rows = db.prepare("SELECT * FROM categories").all();
    const cats = rows.map((row: any) => ({
      ...row,
      algorithms: JSON.parse(row.algorithms)
    }));
    res.json(cats);
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
