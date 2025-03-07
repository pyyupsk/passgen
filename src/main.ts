import '@/assets/main.css'
import App from '@/App.vue'
import { createHead } from '@vueuse/head'
import { createApp } from 'vue'

const app = createApp(App)
const head = createHead()

app.use(head)
app.mount('#app')
