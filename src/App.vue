<script setup lang="ts">
import type { CharacterSet } from '@/types/CharacterSet'

import { useMetadata } from '@/composables/use-metadata'
import { FEATURES } from '@/constants'
import { calculateStrength } from '@/utils/calculate-strength'
import { generatePassword } from '@/utils/generate-password'
import { useClipboard, useDebounceFn } from '@vueuse/core'
import { Check, Copy, RefreshCw } from 'lucide-vue-next'
import { ref, computed, onMounted, watchEffect } from 'vue'

const { copied, copy } = useClipboard()

useMetadata({
  title: 'Password Generator',
  description: 'Generate strong and secure passwords with our advanced password generator.',
})

// The password to be generated
const password = ref<string>('')

// Using a single number rather than an array for better performance
const passwordLength = ref<number>(16)

// The character set to use when generating the password
const characters = ref<CharacterSet>({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: false,
})

// Memoized strength calculation
const strength = computed(() => calculateStrength(password.value))

// Memoized strength color calculation
const getStrengthColor = computed(() => {
  switch (strength.value.score) {
    case 0:
      return 'text-red-500'
    case 1:
      return 'text-amber-500'
    case 2:
      return 'text-yellow-500'
    case 3:
      return 'text-lime-500'
    case 4:
      return 'text-emerald-500'
    default:
      return 'text-red-500'
  }
})

// Generate a new password
const handleGenerate = useDebounceFn(() => {
  password.value = generatePassword(passwordLength.value, characters.value)
}, 100)

// Copy the password to the clipboard using VueUse
const copyToClipboard = async () => {
  if (!password.value) return

  await copy(password.value)
  // toast({ title: 'Copied!', description: 'Password copied to clipboard.' })
}

// Generate a new password when the password length or character set changes
watchEffect(() => {
  if (passwordLength.value && Object.values(characters.value).some((val) => val)) {
    handleGenerate()
  }
})

// Generate initial password on mount
onMounted(generatePassword(passwordLength.value, characters.value))
</script>

<template>
  <main class="container grid min-h-screen place-content-center py-32">
    <div class="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
      <div class="flex flex-col gap-6 lg:col-span-7">
        <!-- Hero section -->
        <div class="flex flex-col gap-3">
          <h2 class="text-3xl font-extrabold sm:text-4xl">Generate Strong, Secure Passwords</h2>
          <p class="text-base-content/80 max-w-2xl text-xl">
            Create unique passwords that are virtually impossible to crack with our advanced
            password generator.
          </p>
        </div>

        <!-- Features section -->
        <ul class="max-w-2xl divide-y">
          <li v-for="feature in FEATURES" :key="feature.title" class="flex gap-3 py-3">
            <component :is="feature.icon" class="size-6" />
            <div class="flex-1 space-y-1.5">
              <h3 class="text-lg leading-none font-semibold tracking-tight">
                {{ feature.title }}
              </h3>
              <p class="text-base-content/80">{{ feature.description }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Password generator card -->
      <div class="card card-border lg:col-span-5">
        <div class="card-body space-y-3">
          <!-- Card title -->
          <div>
            <div class="card-title">Password Generator</div>
            <p class="text-base-content/80">Create a strong and secure password</p>
          </div>

          <!-- Password input field with copy button -->
          <div class="relative">
            <input
              :value="password"
              class="input w-full pr-10 font-mono text-base"
              placeholder="Your password will appear here"
              readonly
            />
            <button
              class="absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer"
              :disabled="!password"
              @click="copyToClipboard"
            >
              <Check
                class="text-success absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-all"
                :class="copied ? 'icon-visible' : 'icon-hidden'"
              />
              <Copy
                class="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-all"
                :class="copied ? 'icon-hidden' : 'icon-visible'"
              />
              <span class="sr-only">{{ copied ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>

          <!-- Password length controls -->
          <div class="space-y-1.5">
            <label class="label">Password Length</label>
            <input
              type="range"
              v-model="passwordLength"
              :min="8"
              :max="100"
              class="range range-xs w-full"
            />
          </div>

          <!-- Character types selection -->
          <div class="space-y-1.5">
            <label class="label">Character Types</label>
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div
                v-for="(_value, key) in characters"
                :key="key"
                class="flex items-center space-x-1.5"
              >
                <label class="fieldset-label">
                  <input type="checkbox" v-model="characters[key]" class="checkbox" />
                  <span class="cursor-pointer capitalize">{{ key }}</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Password strength indicator -->
          <div v-if="password" class="space-y-1.5">
            <div class="space-y-3">
              <label class="label flex justify-between">
                <span>Password Strength</span>
                <span class="text-sm font-medium">{{ strength.rating }}</span>
              </label>
              <progress
                class="progress"
                :class="getStrengthColor"
                :value="strength.percentage"
                max="100"
              />
            </div>
            <div class="text-sm">
              <span class="font-medium">Estimated cracking time: </span>
              <span class="capitalize">{{ strength.cracktime }}</span>
            </div>
          </div>

          <!-- Generate button -->
          <div class="card-actions">
            <button class="btn w-full" @click="handleGenerate">
              <RefreshCw class="size-4" />
              Generate New Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="css">
.icon-visible {
  @apply scale-100 opacity-100;
}

.icon-hidden {
  @apply scale-0 opacity-0;
}
</style>
