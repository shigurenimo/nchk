# nchk

Check if your project name is available across platforms.

## Install

```bash
npm install -g nchk
```

## Usage

```bash
nchk myproject
```

Or start with empty input:

```bash
nchk
```

### Controls

- **Type** - Edit project name
- **Up/Down** - Navigate list
- **Enter** - Check selected item
- **Backspace** - Delete character
- **Esc** - Quit

### Domain filtering

Type a domain to filter:

```
myproject.com    # Shows only .com
myproject.c      # Shows .com, .co, etc.
```

## Platforms

- npm
- GitHub (username)
- PyPI
- crates.io
- Domains (.com, .dev, .io, .co, .org, .net, .app, .sh)

## License

MIT
