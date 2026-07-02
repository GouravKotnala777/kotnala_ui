# Kotnala UI

A collection of modern, animated React components built with **React**, **TypeScript**, and **Tailwind CSS v4**.

Create beautiful, interactive user interfaces with minimal effort.

---

## ✨ Features

- 🚀 Modern animated UI components
- ⚛️ Built with React & TypeScript
- 🎨 Powered by Tailwind CSS v4
- 📦 Lightweight and tree-shakable
- 🔧 Easy to customize
- 🌙 Supports light & dark mode (where applicable)

---

## Installation

Install the package:

```bash
npm install kotnala_ui
```

---

## Requirements

- React 18+
- React DOM 18+
- Tailwind CSS v4

If your project does not already use Tailwind CSS v4, install it first.

---

## Tailwind Setup

Add the following to your **src/index.css** (or your main Tailwind CSS file):

```css
@import "tailwindcss";

@source "../node_modules/kotnala_ui";
```

> **Why is `@source` required?**
>
> `kotnala_ui` components use Tailwind utility classes. The `@source` directive allows Tailwind to scan the library inside `node_modules` and generate the required CSS utilities.

Restart your development server after adding the `@source` directive.

---

## Usage

```tsx
import { SlitherInput } from "kotnala_ui";

function App() {
  return (
    <SlitherInput />
  );
}
```

---

# Components

## Inputs

- SlitherInput
- TextSlashInput
- ParticleVanishingInput

## Navigation

- FluidNavbar
- GooeyNavbar
- DiaScrollerNavbar
- PopupNavbar

## Background

- MeteorMash

---

## Example

```tsx
import { MeteorMash } from "kotnala_ui";

export default function Hero() {
  return (
    <div className="relative h-screen">
      <MeteorMash />
    </div>
  );
}
```

---

## Peer Dependencies

```text
react >=18
react-dom >=18
react-router-dom >=6 (only required for navbar components)
```

---

## Contributing

Contributions, issues, and feature requests are welcome.

If you find a bug or have an idea for a new component, feel free to open an issue or submit a pull request.

---

## Roadmap

- More animated backgrounds
- More input components
- Buttons
- Cards
- Loaders
- Modals
- Dialogs
- Dropdowns
- Toasts
- Charts
- Better documentation
- CLI installer

---

## License

ISC

---

Made with ❤️ by Gourav Kotnala