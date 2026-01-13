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
import { Input } from "@/components/ui/input";
import { FEATURES } from "@/pages/_constants";
import { generatePassword } from "@/pages/_utils/password/generate";
import { calculateStrength } from "@/pages/_utils/strength/calculate";
import {
  getStrengthBgColor,
  getStrengthTextColor,
} from "@/pages/_utils/strength/colors";

const { copied, copy } = useClipboard();

const password = ref<string>("");
const passwordLength = ref<number>(16);
const characters = ref<CharacterSet>({
  lowercase: true,
  numbers: true,
  symbols: false,
  uppercase: true,
});

const strength = computed(() => calculateStrength(password.value));
const strengthBgColor = computed(() =>
  getStrengthBgColor(strength.value.score),
);
const strengthTextColor = computed(() =>
  getStrengthTextColor(strength.value.score),
);

const handleGenerate = useDebounceFn(() => {
  password.value = generatePassword(passwordLength.value, characters.value);
}, 100);

const copyToClipboard = async () => {
  if (!password.value) return;

  await copy(password.value);
};

watchEffect(() => {
  if (passwordLength.value && Object.values(characters.value).some(Boolean)) {
    handleGenerate();
  }
});

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
            <Input
              id="password"
              :model-value="password"
              class="h-10 pr-10 font-mono"
              placeholder="Your password will appear here"
              readonly
              aria-label="Generated password"
            />
            <button
              class="text-muted-foreground hover:text-foreground absolute top-1/2 right-5 -translate-y-1/2 cursor-pointer transition-colors"
              :disabled="!password"
              aria-label="Copy password to clipboard"
              @click="copyToClipboard"
            >
              <Check
                class="text-chart-2 absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-all"
                :class="copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
              />
              <Copy
                class="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 transition-all"
                :class="copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'"
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
              <span class="text-muted-foreground font-mono">{{
                passwordLength
              }}</span>
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
          <fieldset class="space-y-2">
            <legend class="text-sm font-medium">Character Types</legend>
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
          </fieldset>

          <!-- Password strength indicator -->
          <div class="space-y-2">
            <div class="space-y-2">
              <label
                for="strength"
                class="flex justify-between text-sm font-medium"
              >
                <span>Password Strength</span>
                <span :class="strengthTextColor" class="font-medium">{{
                  strength.rating
                }}</span>
              </label>
              <div class="bg-secondary h-2 w-full overflow-hidden rounded-full">
                <div
                  id="strength"
                  class="h-full transition-all duration-300"
                  :class="strengthBgColor"
                  :style="{ width: `${strength.percentage}%` }"
                />
              </div>
            </div>
            <div class="text-muted-foreground text-sm">
              <span class="font-medium">Estimated cracking time: </span>
              <span class="font-mono capitalize">{{ strength.cracktime }}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            class="w-full"
            aria-label="Generate new password"
            @click="handleGenerate"
          >
            <RefreshCw />
            Generate New Password
          </Button>
        </CardFooter>
      </Card>
    </section>
  </main>
</template>
