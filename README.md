# cds - cd Shortcuts
A simple cd shortcut. Jump around the filesystem with simple, memorable shortcuts. 

## Usage
**Basic usage** - Jump to a saved shortcut:
`cds <name>`

### Add a shortcut
`cds add -n <name> -p <path>`

> note: you can pass the current path using `.`

### Delete a shortcut
You can delete shortcuts by name or path:
`cds delete <query>`

### List your shortcuts
Simply run `cds list` to see all your shortcuts.

### Check if a shortcut exists
Returns the name:path pair if there's an entry for the provided query (it can be path or name):
`cds check <query>`

### Update shortcuts
`cds update <query> <-n | -p> <new_value>`

Use `-n` for updating the shortcut_name, leaving the path untouched.
Use `-p` for updating just the shortcut_path.

## Install - TODO