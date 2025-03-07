<script setup lang="ts">
import type { CharacterSet } from '@/types/CharacterSet'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import { calculateStrength } from '@/utils/calculate-strength'
import { generatePassword } from '@/utils/generate-password'
import { Check, Copy, RefreshCw } from 'lucide-vue-next'
import { ref, computed, watchEffect, onMounted } from 'vue'

const { toast } = useToast()

// The password to be generated
const password = ref<string>('')

// Using a single number rather than an array for better performance
const passwordLength = ref<number>(16)

// Whether the password has been copied to the clipboard
const copied = ref<boolean>(false)

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
  switch (strength.value.rating) {
    case 'Very weak':
      return 'bg-red-500'
    case 'Weak':
      return 'bg-amber-500'
    case 'Medium':
      return 'bg-yellow-500'
    case 'Strong':
      return 'bg-lime-500'
    default:
      return 'bg-emerald-500'
  }
})

// Using a single reactive variable for slider (needed for component compatibility)
const lengthSlider = computed({
  get: () => [passwordLength.value],
  set: (val) => (passwordLength.value = val[0]),
})

// Generate a new password
const handleGenerate = () => {
  password.value = generatePassword(passwordLength.value, characters.value)
}

// Copy the password to the clipboard
const copyToClipboard = () => {
  if (!password.value) return

  navigator.clipboard.writeText(password.value)
  copied.value = true
  toast({ title: 'Copied!', description: 'Password copied to clipboard.' })

  // Use a more efficient approach than setTimeout
  const timer = setTimeout(() => {
    copied.value = false
    clearTimeout(timer)
  }, 2000)
}

// Generate a new password when the password length or character set changes
watchEffect(() => {
  if (passwordLength.value && Object.values(characters.value).some((val) => val)) {
    handleGenerate()
  }
})

// Generate initial password on mount
onMounted(handleGenerate)
</script>

<template>
  <main class="grid min-h-screen place-items-center">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Password Generator</CardTitle>
        <CardDescription>Create a strong and secure password</CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Password input field with copy button -->
        <div class="relative">
          <Input
            :value="password"
            class="pr-10 font-mono text-base"
            placeholder="Your password will appear here"
            readonly
          />
          <Button
            variant="transparent"
            size="icon"
            class="absolute right-1 top-1/2 -translate-y-1/2"
            :disabled="!password"
            @click="copyToClipboard"
          >
            <Check
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-green-500 transition-all"
              :class="copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
            />
            <Copy
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"
              :class="copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'"
            />
            <span class="sr-only">{{ copied ? 'Copied' : 'Copy' }}</span>
          </Button>
        </div>

        <div class="space-y-6">
          <!-- Password length controls -->
          <div class="space-y-2">
            <NumberField id="length" v-model="passwordLength" :min="8" :max="100">
              <Label for="length">Password Length</Label>
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>

            <Slider id="length" v-model="lengthSlider" :min="8" :max="100" />
          </div>

          <!-- Character types selection -->
          <div class="space-y-3">
            <Label>Character Types</Label>
            <div class="flex items-center justify-between gap-2">
              <div
                v-for="(_value, key) in characters"
                :key="key"
                class="flex items-center space-x-2"
              >
                <Checkbox v-model="characters[key]" />
                <Label class="cursor-pointer capitalize">{{ key }}</Label>
              </div>
            </div>
          </div>

          <!-- Password strength indicator -->
          <div v-if="password" class="space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between">
                <Label>Password Strength</Label>
                <span class="text-sm font-medium">{{ strength.rating }}</span>
              </div>
              <Progress v-model="strength.percentage" :indicator-class="getStrengthColor" />
            </div>
            <div class="text-sm">
              <span class="font-medium">Estimated cracking time: </span>
              <span class="capitalize">{{ strength.cracktime }}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button class="w-full" @click="handleGenerate">
          <RefreshCw />
          Generate New Password
        </Button>
      </CardFooter>
    </Card>
  </main>

  <Toaster />
</template>
