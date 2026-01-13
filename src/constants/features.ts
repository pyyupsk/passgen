import type { Component } from "vue";

import { AlertTriangle, Key, Lock } from "lucide-vue-next";

type Feature = {
  description: string;
  icon: Component;
  title: string;
};

export const FEATURES: Feature[] = [
  {
    description:
      "All password generation happens locally in your browser. Your passwords are never stored or transmitted.",
    icon: Lock,
    title: "Secure by Design",
  },
  {
    description:
      "Tailor your passwords with adjustable length and character types to meet specific requirements.",
    icon: Key,
    title: "Customizable Options",
  },
  {
    description:
      "Get real-time feedback on password strength and estimated time to crack.",
    icon: AlertTriangle,
    title: "Strength Analysis",
  },
];
