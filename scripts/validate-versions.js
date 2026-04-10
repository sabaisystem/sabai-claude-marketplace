#!/usr/bin/env node

/**
 * Validates that plugin.json versions match README.md versions
 * across all plugins in the marketplace.
 */

const fs = require("fs");
const path = require("path");

const pluginsDir = path.join(__dirname, "..", "plugins");
const errors = [];
let checked = 0;

const pluginDirs = fs
  .readdirSync(pluginsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const plugin of pluginDirs) {
  const pluginJsonPath = path.join(
    pluginsDir,
    plugin,
    ".claude-plugin",
    "plugin.json"
  );
  const readmePath = path.join(pluginsDir, plugin, "README.md");

  if (!fs.existsSync(pluginJsonPath)) {
    errors.push(`${plugin}: missing .claude-plugin/plugin.json`);
    continue;
  }

  if (!fs.existsSync(readmePath)) {
    errors.push(`${plugin}: missing README.md`);
    continue;
  }

  const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, "utf8"));
  const pluginVersion = pluginJson.version;

  const readme = fs.readFileSync(readmePath, "utf8");
  const match = readme.match(/Version\s*\|\s*(\S+)/);

  if (!match) {
    errors.push(`${plugin}: no Version field found in README.md`);
    continue;
  }

  const readmeVersion = match[1];
  checked++;

  if (pluginVersion !== readmeVersion) {
    errors.push(
      `${plugin}: plugin.json=${pluginVersion} README=${readmeVersion}`
    );
  }
}

if (errors.length > 0) {
  console.error("Version mismatches found:\n");
  errors.forEach((e) => console.error(`  - ${e}`));
  console.error(`\n${checked} plugins checked, ${errors.length} error(s)`);
  process.exit(1);
} else {
  console.log(`All ${checked} plugins have consistent versions.`);
  process.exit(0);
}
