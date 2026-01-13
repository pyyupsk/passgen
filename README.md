# 🔑 Password Generator

Generate strong, secure passwords with this modern, browser-based password generator tool. Built with Vue 3 and TypeScript, this application provides a user-friendly interface for creating customizable passwords with real-time strength analysis.

![Password Generator Screenshot](https://github.com/pyyupsk/passgen/blob/main/public/og-image.png)

## ✨ Features

- **Secure by Design**: All password generation happens locally in your browser. Your passwords are never stored or transmitted.
- **Customizable Options**: Tailor your passwords with adjustable length and character types (uppercase, lowercase, numbers, symbols) to meet specific requirements.
- **Strength Analysis**: Get real-time feedback on password strength and estimated time to crack using the zxcvbn library.

- **Modern UI**: Clean, responsive interface built with Vue 3, TypeScript, and Tailwind CSS.

## 🧩 Browser Extension

Generate secure passwords directly in registration forms with our browser extension.

### Features

- **Auto-Detection**: Automatically detects password fields on registration forms
- **One-Click Fill**: Generate and fill passwords with a single click
- **Strength Indicator**: Real-time password strength analysis
- **Shadow DOM Isolation**: No style conflicts with existing websites

### Installation

| Browser | Link                                                                               |
| ------- | ---------------------------------------------------------------------------------- |
| Chrome  | Manual install only ([sponsor me](https://github.com/sponsors/pyyupsk) to publish) |
| Firefox | [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/pyyupsk-passgen/) |
| Manual  | [Download from Releases](https://github.com/pyyupsk/passgen/releases/latest)       |

### Manual Installation

1. Download the extension zip for your browser from [Releases](https://github.com/pyyupsk/passgen/releases/latest)
2. **Chrome**: Go to `chrome://extensions`, enable Developer Mode, and drag the zip file
3. **Firefox**: Go to `about:addons`, click the gear icon, and select "Install Add-on From File"

## 🚀 Getting Started

### Prerequisites

- Node.js (recommended v22.19.0 LTS)
- bun (<https://bun.sh/install>)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pyyupsk/passgen.git
   cd passgen
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start the development server:

   ```bash
   bun run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS wth shadcn-vue

## 📊 Password Strength Rating

The application uses the zxcvbn library to calculate password strength:

- **Extremely Weak**: Easily crackable in seconds
- **Weak**: Crackable in minutes to hours
- **Moderate**: Crackable in minutes to hours
- **Strong**: Crackable in hours to months
- **Very Strong**: Virtually impossible to crack with current technology

## 🔧 Customization

### Character Sets

You can include any combination of:

- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special symbols (!@#$%^&\*()\_+-=[]{}|;:,.<>?/)

### Password Length

Adjust the password length from 8 to 100 characters using the slider or number input.

## 📱 Responsive Design

The application is fully responsive and works on:

- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

## 🙏 Acknowledgements

- [zxcvbn-ts](https://github.com/zxcvbn-ts/zxcvbn) for password strength estimation
- [VueUse](https://vueuse.org/) for useful Vue 3 composables
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn-vue](https://shadcn-vue.com/) for reusable UI components
- [Lucide Icons](https://lucide.dev/) for beautiful icons

---

Built with ❤️ by [pyyupsk](https://github.com/pyyupsk)
