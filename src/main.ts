import "@/assets/css/style.css";
import { createApp } from "vue";

import App from "@/app.vue";
import { router } from "@/router";

const app = createApp(App);

app.config.performance = import.meta.env.DEV;

app.config.compilerOptions = {
  comments: false,
  whitespace: "condense",
};

if (import.meta.env.PROD) {
  app.config.warnHandler = () => null;
}

app.config.errorHandler = (err, instance, info) => {
  if (import.meta.env.DEV) {
    console.error("[Vue] Vue Error:", {
      component: instance?.$options.name ?? "Anonymous",
      error: err,
      info,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In production, add error tracking service here
    // e.g., Sentry, LogRocket, etc.
    console.error("[Vue] Vue Error:", err);
  }
};

app.use(router);
app.mount("#app");
