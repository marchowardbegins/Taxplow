import fs from "node:fs";

const raw = fs.readFileSync(0, "utf8");
let data;
try { data = JSON.parse(raw); } catch { 
  console.log("Could not parse Netlify JSON output");
  process.exit(1);
}

const url = data.deploy_url || data.url || data.logs || "";
if (!url) {
  console.log("URL not found in Netlify output");
  process.exit(1);
}
console.log(url);
