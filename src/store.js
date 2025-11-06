import { readFile, writeFile, mkdir } from "fs/promises";
import { resolve } from "path";
import os from "os";

const APP_NAME = "cds";
const customConfigRoot = process.env.CDS_CONFIG_DIR;
const configDir = customConfigRoot
  ? resolve(customConfigRoot, `.${APP_NAME}`)
  : resolve(os.homedir(), `.${APP_NAME}`);
const SHORTCUT_FILE = resolve(configDir, "shortcuts.json");

/**
 * Reads and parses the entire JSON file asynchronously.
 * Returns an empty object if the file doesn't exist or is corrupted.
 */
export async function loadShortcuts() {
  try {
    const data = await readFile(SHORTCUT_FILE, { encoding: "utf8" });

    const shortcuts = JSON.parse(data);
    return shortcuts;
  } catch (e) {
    if (e.code === "ENOENT") {
      console.log(
        `${SHORTCUT_FILE} not found in standard location. Initializing new storage.`
      );
      return {};
    } else if (e instanceof SyntaxError) {
      console.error(
        `Error: ${SHORTCUT_FILE} is not valid JSON. Starting fresh.`,
        e.message
      );
      return {};
    } else {
      console.error(`An unexpected error occurred during loading:`, e);
      return {};
    }
  }
}

/**
 * Returns the entire shortcuts object
 */
export async function getAllShortcuts() {
  const shortcuts = await loadShortcuts();
  return shortcuts;
}

/**
 * Writes the entire object back to the JSON file, overwriting the old content.
 * @param {Object} shortcuts - The updated object to save.
 */
export async function saveShortcuts(shortcuts) {
  try {
    // check if directory exists, if not, create it and any parent directory needed.
    await mkdir(configDir, { recursive: true });
    const data = JSON.stringify(shortcuts, null, 4);

    await writeFile(SHORTCUT_FILE, data, { encoding: "utf8" });
    console.log(`Shortcuts successfully saved to [${SHORTCUT_FILE}].`);
  } catch (e) {
    console.error(`Error saving shortcuts:`, e);
  }
}

/**
 * Load shortcuts and search by name (key) or path (value).
 * @param {string} query - The name or path to search for.
 * @returns {Promise<{name: string, path: string}|null>} The matching name/path pair or null if not found.
 */
export async function findShortcut(query) {
  const shortcuts = await loadShortcuts();

  if (shortcuts[query]) {
    return {
      name: query,
      path: shortcuts[query],
    };
  }

  for (const [name, path] of Object.entries(shortcuts)) {
    if (path === query) {
      return { name, path };
    }
  }

  console.error(`Error: Shortcut or Path matching '${query}' not found.`);
  return null;
}

/**
 * Deletes a shortcut entry based on either the name (key) or path (value).
 * @param {string} query - The name or path to identify the shortcut.
 */
export async function deleteShortcut(query) {
  const result = await findShortcut(query);

  if (!result) {
    return;
  }

  // load json again ensuring we have the object for deletion and later passing to save
  const shortcuts = await loadShortcuts();
  delete shortcuts[result.name];
  await saveShortcuts(shortcuts);
  console.log(`Shortcut '${result.name}' successfully deleted.`);
}

/**
 * Updates an existing shortcut by changing its name, its path, or both.
 * @param {string} query - The existing name or path used to find the shortcut.
 * @param {string} [newName] - The new name to assign (optional).
 * @param {string} [newPath] - The new path to assign (optional).
 */
export async function updateShortcut(query, newName, newPath) {
  const result = await findShortcut(query);

  if (!result) {
    return;
  }
  if (!newName && !newPath) {
    console.log(
      `Error: No update parameters provided for '${query}'. Use -n or -p.`
    );
    return;
  }

  const shortcuts = await loadShortcuts();
  let updated = false;

  const oldName = result.name;
  const oldPath = result.path;

  if (newName && newName !== oldName) {
    if (shortcuts[newName]) {
      console.log(`Error: new shortcut name '${newName} already in use.`);
      return;
    }
    shortcuts[newName] = oldPath;
    delete shortcuts[oldName];
    console.log(`Renamed ${oldName} to ${newName}.`);
    console.log(`Path remains as ${oldPath}`);
    updated = true;
  }

  if (newPath && newPath !== oldPath) {
    // Support updating both key and value, if for some reason someone ends up providing both -p and -n
    const keyToUpdate = newName || oldName;
    shortcuts[keyToUpdate] = newPath;
    console.log(
      `Shortcut path for ${keyToUpdate} updated from ${oldPath} to ${newPath}`
    );
    updated = true;
  }

  if (updated) {
    await saveShortcuts(shortcuts);
  } else {
    console.log("No changes made.");
  }
}
