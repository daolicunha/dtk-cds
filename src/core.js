import {
  findShortcut,
  getAllShortcuts,
  loadShortcuts,
  saveShortcuts,
  updateShortcut,
} from "./store.js";

/**
 * Returns the path for a shortcut.
 * @param {string} name - The shortcut name.
 */
export async function goto(name) {
  console.log("Jumping to " + name);
  const shortcut = await findShortcut(name);
  console.log(shortcut);
  const result = "cd " + shortcut.path;
  return result;
}

/**
 * Creates a new shortcut only if the name and path do not already exist.
 * @param {string} name - The shortcut name.
 * @param {string} path - The target directory path.
 */
export async function addShortcut(name, path) {
  const shortcuts = await loadShortcuts();

  if (shortcuts[name]) {
    console.log(
      `Error: Shortcut name '${name}' already exists. Use 'update' to change its value.`
    );
    return;
  }

  const existingPaths = Object.values(shortcuts);
  if (existingPaths.includes(path)) {
    console.log(`Error: Path '${path}' already has a shortcut assigned to it.`);
    return;
  }

  shortcuts[name] = path;
  await saveShortcuts(shortcuts);
}

/**
 * Returns all the shortcuts available.
 * TODO: Format the output in a neat table.
 */
export async function listShortcuts() {
  console.log("Listing all your shortcuts!!");
  const shortcuts = await getAllShortcuts();
  console.log(shortcuts);
}

/**
 * Deletes a shortcut entry based on either the name (key) or path (value).
 * @param {string} query - The name or path to identify the shortcut.
 */
export async function deleteShortcut(query) {
  console.log(`Deleting ${query} from shortcuts`);
  await deleteShortcut(query);
}

/**
 * Checks if the query (name or path) has a shortcut available.
 * TODO: Format the output in a neat table.
 * @param {string} query - The name or path to identify the shortcut.
 */
export async function checkShortcut(query) {
  console.log(`Checking if ${query} has a shortcut...`);
  const shortcut = await findShortcut(query);
  console.log(`Found a shortcut for ${query}:`);
  console.log(`${shortcut.name}: ${shortcut.path}`);
}

/**
 * Updates an existing shortcut by changing its name, its path, or both.
 * @param {string} query - The existing name or path used to find the shortcut.
 * @param {string} [newName] - The new name to assign (optional).
 * @param {string} [newPath] - The new path to assign (optional).
 */
export async function updateEntry(query, newName, newPath) {
  await updateShortcut(query, newName, newPath);
}
