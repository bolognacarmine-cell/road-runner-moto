<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('roadrunner')
const targa = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const res = await $fetch('/api/auth/portal-login', {
      method: 'POST',
      body: {
        username: username.value,
        targa: targa.value,
        password: password.value
      }
    })
    
    if (res.success) {
      // Salva info sessione
      localStorage.setItem('rr_portal_token', res.token)
      localStorage.setItem('rr_portal_user', JSON.stringify(res.user))
      // Vai alla dashboard
      router.push('/portale/dashboard')
    }
  } catch (err) {
    errorMsg.value = err.statusMessage || 'Errore durante l\'accesso. Verifica i dati.'
  } finally {
    loading.value = false
  }
}

useHead({
  title: 'Accedi al tuo Veicolo | Road Runner Moto',
  meta: [{ name: 'description', content: 'Portale privato clienti Road Runner Moto.' }]
})
</script>

<template>
  <div class="portal-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/logo-road-runner.jpg" alt="Logo" class="portal-logo" />
          <h1>Portale Cliente</h1>
          <p>Inserisci i dati del tuo veicolo per accedere all'area riservata.</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Username</label>
            <input 
              v-model="username" 
              type="text" 
              readonly 
              class="readonly-input"
            />
          </div>

          <div class="form-group">
            <label>Targa Veicolo</label>
            <input 
              v-model="targa" 
              type="text" 
              placeholder="Es: AA123BB" 
              required 
              maxlength="7"
              class="targa-input"
            />
          </div>

          <div class="form-group">
            <label>Password Personale</label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <div v-if="errorMsg" class="error-banner">
            {{ errorMsg }}
          </div>

          <button type="submit" class="btn-primary-custom full" :disabled="loading">
            {{ loading ? 'Verifica in corso...' : 'Accedi al tuo veicolo' }}
          </button>

          <div class="login-footer">
            <p>Hai dimenticato la password? <a href="#">Contatta la concessionaria</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.portal-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #1a1a1a 0%, #050505 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 450px;
}

.login-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: 24px;
  padding: 40px;
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.portal-logo {
  height: 80px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.login-header h1 {
  font-size: 1.75rem;
  font-weight: 900;
  margin-bottom: 10px;
}

.login-header p {
  color: var(--muted);
  font-size: 0.9rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

input {
  background: var(--panel-2);
  border: 1px solid var(--line);
  padding: 14px 16px;
  border-radius: 12px;
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
}

input:focus {
  border-color: var(--primary-2);
  background: rgba(255,255,255,0.02);
}

.readonly-input {
  background: rgba(255,255,255,0.03);
  color: #666;
  cursor: not-allowed;
}

.targa-input {
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.error-banner {
  background: rgba(215, 24, 42, 0.1);
  border: 1px solid var(--primary);
  color: var(--primary-2);
  padding: 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
}

.login-footer a {
  color: var(--primary-2);
  font-weight: 600;
}
</style>
