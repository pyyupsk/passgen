<script setup lang="ts">
import { useClipboard, useDebounceFn } from "@vueuse/core";
import { Check, Copy, RefreshCw } from "lucide-vue-next";
import { computed, onMounted, ref, watchEffect } from "vue";

import type { CharacterSet } from "@/pages/_types/CharacterSet";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FEATURES } from "@/pages/_constants";
import { calculateStrength } from "@/pages/_utils/calculate-strength";
import { generatePassword } from "@/pages/_utils/generate-password";

import StrengthIndicator from "./_components/StrengthIndicator.vue";

const { copied, copy } = useClipboard();

// The password to be generated
const password = ref<string>("");

// Using a single number rather than an array for better performance
const passwordLength = ref<number>(16);

// The character set to use when generating the password
const characters = ref<CharacterSet>({
  lowercase: true,
  numbers: true,
  symbols: false,
  uppercase: true,
});

// Memoized strength calculation
const strength = computed(() => calculateStrength(password.value));

// Generate a new password
const handleGenerate = useDebounceFn(() => {
  password.value = generatePassword(passwordLength.value, characters.value);
}, 100);

// Copy the password to the clipboard using VueUse
const copyToClipboard = async () => {
  if (!password.value) return;

  await copy(password.value);
};

// Generate a new password when the password length or character set changes
watchEffect(() => {
  if (passwordLength.value && Object.values(characters.value).some(Boolean)) {
    handleGenerate();
  }
});

// Generate initial password on mount
onMounted(() => {
  password.value = generatePassword(passwordLength.value, characters.value);
});
</script>

<template>
  <main class="container grid min-h-screen place-content-center py-32">
    <section class="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
      <article class="flex flex-col gap-6 lg:col-span-7">
        <!-- Hero section -->
        <header class="flex flex-col gap-3">
          <h2 class="text-3xl font-extrabold sm:text-4xl">
            Generate Strong, Secure Passwords
          </h2>
          <p class="text-muted-foreground max-w-2xl text-xl">
            Create unique passwords that are virtually impossible to crack with
            our advanced password generator.
          </p>
        </header>

        <!-- Features section -->
        <ul class="divide-border max-w-2xl divide-y">
          <li
            v-for="feature in FEATURES"
            :key="feature.title"
            class="flex gap-3 py-3"
          >
            <component :is="feature.icon" class="text-primary size-6" />
            <div class="flex-1 space-y-1.5">
              <h3 class="text-lg leading-none font-semibold tracking-tight">
                {{ feature.title }}
              </h3>
              <p class="text-muted-foreground">{{ feature.description }}</p>
            </div>
          </li>
        </ul>
      </article>

      <!-- Password generator card -->
      <Card class="lg:col-span-5">
        <CardHeader>
          <CardTitle>Password Generator</CardTitle>
          <CardDescription>Create a strong and secure password</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Password input field with copy button -->
          <div class="relative">
            <label for="password" class="sr-only">Generated Password</label>
            <input
              id="password"
              :value="password"
              class="bg-input/30 border-input focus:ring-ring/50 h-10 w-full rounded-md border px-3 pr-10 font-mono text-sm focus:ring-2 focus:outline-none"
              placeholder="Your password will appear here"
              readonly
              aria-label="Generated password"
            />
            <button
              class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
              :disabled="!password"
              aria-label="Copy password to clipboard"
              @click="copyToClipboard"
            >
              <Check
                class="text-chart-2 absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-all"
                :class="copied ? 'icon-visible' : 'icon-hidden'"
              />
              <Copy
                class="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-all"
                :class="copied ? 'icon-hidden' : 'icon-visible'"
              />
              <span class="sr-only">{{ copied ? "Copied" : "Copy" }}</span>
            </button>
          </div>

          <!-- Password length controls -->
          <div class="space-y-2">
            <label
              for="length"
              class="flex justify-between text-sm font-medium"
            >
              <span>Password Length</span>
              <span class="text-muted-foreground">{{ passwordLength }}</span>
            </label>
            <input
              id="length"
              v-model="passwordLength"
              type="range"
              :min="8"
              :max="100"
              class="accent-primary bg-secondary h-2 w-full cursor-pointer appearance-none rounded-lg"
            />
          </div>

          <!-- Character types selection -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Character Types</label>
            <div
              class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
            >
              <div
                v-for="(_value, key) in characters"
                :key="key"
                class="flex items-center space-x-2"
              >
                <input
                  :id="`char-${key}`"
                  v-model="characters[key]"
                  type="checkbox"
                  class="accent-primary border-input size-4 cursor-pointer rounded"
                />
                <label
                  :for="`char-${key}`"
                  class="cursor-pointer text-sm capitalize"
                  >{{ key }}</label
                >
              </div>
            </div>
          </div>

          <!-- Password strength indicator -->
          <StrengthIndicator
            v-if="password"
            :key="password"
            :strength="strength"
          />
        </CardContent>

        <CardFooter>
          <Button
            class="w-full"
            aria-label="Generate new password"
            @click="handleGenerate"
          >
            <RefreshCw class="size-4" />
            Generate New Password
          </Button>
        </CardFooter>
      </Card>
    </section>
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
