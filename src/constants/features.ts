import type { Component } from 'vue'

import { Lock, Key, AlertTriangle } from 'lucide-vue-next'

type Feature = {
  title: string
  description: string
  icon: Component
}

export const FEATURES: Feature[] = [
  {
    title: 'Secure by Design',
    description:
      'All password generation happens locally in your browser. Your passwords are never stored or transmitted.',
    icon: Lock,
  },
  {
    title: 'Customizable Options',
    description:
      'Tailor your passwords with adjustable length and character types to meet specific requirements.',
    icon: Key,
  },
  {
    title: 'Strength Analysis',
    description: 'Get real-time feedback on password strength and estimated time to crack.',
    icon: AlertTriangle,
  },
]
