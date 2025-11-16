import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "leads.json");

function readLeadsFile() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]), "utf8");
    return [];
  }
  const raw = fs.readFileSync(DB_FILE, "utf8");
  return JSON.parse(raw);
}

function writeLeadsFile(leads) {
  fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2), "utf8");
}

export function getAllLeads() {
  const leads = readLeadsFile();
  return leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function saveLead(lead) {
  const leads = readLeadsFile();
  const exists = leads.some(l => l.externalId === lead.externalId);

  if (!exists) {
    leads.push(lead);
    writeLeadsFile(leads);
    console.log("💾 Saved:", lead.name);
  } else {
    console.log("⚠️ Duplicate lead ignored:", lead.externalId);
  }
}
