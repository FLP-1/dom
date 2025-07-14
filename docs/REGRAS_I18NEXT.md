# 🌍 Regras de Internacionalização - DOM v1

**Arquivo:** `docs/REGRAS_I18NEXT.md`  
**Diretório:** `docs/`  
**Descrição:** Regras obrigatórias para internacionalização com next-i18next  
**Data de Criação:** 2024-12-19  
**Última Alteração:** 2024-12-19  

---

## 🚨 **REGRA ABSOLUTA: next-i18next OBRIGATÓRIO**

**Esta regra é ABSOLUTA e deve ser seguida por TODOS os desenvolvedores e IAs.**

### ❌ **PROIBIDO (NUNCA FAZER):**

- **react-i18next** em projetos Next.js
- **Configuração manual** do i18next
- **Imports de react-i18next** em componentes
- **Configuração manual** no _app.jsx

```javascript
// ❌ NUNCA fazer isso
import { useTranslation } from 'react-i18next'
import i18n from '@/utils/i18n'

// ❌ NUNCA configurar manualmente
i18n.use(initReactI18next).init({...})
```

### ✅ **OBRIGATÓRIO (SEMPRE FAZER):**

- **next-i18next** para projetos Next.js
- **Configuração automática** via next-i18next.config.js
- **appWithTranslation** wrapper no _app.jsx
- **Arquivos JSON** em public/locales/

```javascript
// ✅ SEMPRE fazer isso
import { useTranslation } from 'next-i18next'

// ✅ SEMPRE usar appWithTranslation
export default appWithTranslation(MyApp)
```

---

## 📁 **ESTRUTURA DE ARQUIVOS OBRIGATÓRIA**

### Estrutura de Diretórios
```
frontend/
├── next-i18next.config.js          # ✅ OBRIGATÓRIO
├── next.config.js                   # ✅ Deve importar i18n
├── pages/
│   └── _app.jsx                     # ✅ Deve usar appWithTranslation
└── public/
    └── locales/                     # ✅ OBRIGATÓRIO
        ├── pt-BR/
        │   └── common.json
        ├── en/
        │   └── common.json
        └── es/
            └── common.json
```

### Arquivo de Configuração Obrigatório
```javascript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en', 'es'],
    localeDetection: true,
  },
  
  react: {
    useSuspense: false, // Importante para SSR
  },
  
  debug: process.env.NODE_ENV === 'development',
  fallbackLng: 'pt-BR',
  
  interpolation: {
    escapeValue: false,
  },
  
  detection: {
    order: ['localStorage', 'navigator', 'htmlTag'],
    caches: ['localStorage'],
  }
}
```

---

## 🎯 **USO CORRETO NOS COMPONENTES**

### Import Obrigatório
```javascript
// ✅ SEMPRE usar este import
import { useTranslation } from 'next-i18next'
```

### Uso Básico
```javascript
const MyComponent = () => {
  const { t } = useTranslation('common')
  
  return (
    <Button>
      {t('common.save')}
    </Button>
  )
}
```

### Uso com Múltiplos Namespaces
```javascript
const MyComponent = () => {
  const { t } = useTranslation(['common', 'auth', 'errors'])
  
  return (
    <div>
      <Button>{t('common.save')}</Button>
      <p>{t('auth.login_success')}</p>
      <span>{t('errors.validation_error')}</span>
    </div>
  )
}
```

### Uso com Variáveis
```javascript
const MyComponent = ({ userName }) => {
  const { t } = useTranslation('common')
  
  return (
    <Typography>
      {t('welcome.message', { name: userName })}
    </Typography>
  )
}
```

---

## 📝 **ESTRUTURA DE ARQUIVOS JSON**

### Exemplo: pt-BR/common.json
```json
{
  "login": {
    "welcome_title": "Bem-vindo ao DOM",
    "subtitle": "Faça login para acessar sua conta",
    "cpf": "CPF",
    "password": "Senha"
  },
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "edit": "Editar",
    "delete": "Excluir"
  },
  "errors": {
    "validation_error": "Erro de validação",
    "network_error": "Erro de conexão"
  }
}
```

### Organização por Contexto
```json
{
  "login": { /* Chaves relacionadas ao login */ },
  "dashboard": { /* Chaves relacionadas ao dashboard */ },
  "tasks": { /* Chaves relacionadas às tarefas */ },
  "users": { /* Chaves relacionadas aos usuários */ },
  "common": { /* Chaves comuns/generais */ },
  "errors": { /* Chaves de erro */ },
  "success": { /* Chaves de sucesso */ }
}
```

---

## 🔧 **CONFIGURAÇÃO OBRIGATÓRIA**

### 1. **next.config.js**
```javascript
const { i18n } = require('./next-i18next.config.js')

const nextConfig = {
  reactStrictMode: true,
  i18n, // ✅ OBRIGATÓRIO
  // ... outras configurações
}
```

### 2. **_app.jsx**
```javascript
import { appWithTranslation } from 'next-i18next'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  )
}

export default appWithTranslation(MyApp) // ✅ OBRIGATÓRIO
```

### 3. **Páginas com getStaticProps/getServerSideProps**
```javascript
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'auth'])),
    },
  }
}
```

---

## 🚫 **PROIBIÇÕES ESPECÍFICAS**

### ❌ **NUNCA usar react-i18next**
```javascript
// ❌ PROIBIDO
import { useTranslation } from 'react-i18next'
import { initReactI18next } from 'react-i18next'
```

### ❌ **NUNCA configurar i18next manualmente**
```javascript
// ❌ PROIBIDO
import i18n from 'i18next'
i18n.use(initReactI18next).init({...})
```

### ❌ **NUNCA usar strings hardcoded**
```javascript
// ❌ PROIBIDO
return <Button>Salvar</Button>
return <Typography>Bem-vindo ao DOM</Typography>
```

### ❌ **NUNCA esquecer o namespace**
```javascript
// ❌ PROIBIDO
const { t } = useTranslation() // Sem namespace
```

---

## ✅ **EXEMPLOS CORRETOS**

### Componente de Login
```javascript
import { useTranslation } from 'next-i18next'

const LoginForm = () => {
  const { t } = useTranslation('common')
  
  return (
    <form>
      <TextField
        label={t('login.cpf')}
        placeholder={t('login.cpf_placeholder')}
      />
      <TextField
        label={t('login.password')}
        type="password"
      />
      <Button type="submit">
        {t('login.entering')}
      </Button>
    </form>
  )
}
```

### Componente de Dashboard
```javascript
import { useTranslation } from 'next-i18next'

const DashboardCard = ({ title, value, type }) => {
  const { t } = useTranslation(['common', 'dashboard'])
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {t(`dashboard.${title}`)}
        </Typography>
        <Typography variant="h4">
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}
```

---

## 🧪 **VALIDAÇÃO AUTOMÁTICA**

### ESLint Rules
```javascript
// .eslintrc.js
'no-restricted-imports': [
  'error',
  {
    patterns: [
      {
        group: ['react-i18next'],
        message: 'Use next-i18next em vez de react-i18next para projetos Next.js'
      }
    ]
  }
]
```

### Script de Validação
```javascript
// scripts/validate-i18n.js
const validateI18n = () => {
  // Verificar se next-i18next.config.js existe
  // Verificar se _app.jsx usa appWithTranslation
  // Verificar se arquivos JSON existem
  // Verificar se imports usam next-i18next
}
```

---

## 📚 **RECURSOS E DOCUMENTAÇÃO**

### Documentação Oficial
- [next-i18next Documentation](https://github.com/i18next/next-i18next)
- [i18next Documentation](https://www.i18next.com/)
- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing)

### Exemplos no Projeto
- `frontend/next-i18next.config.js` - Configuração
- `frontend/pages/_app.jsx` - Wrapper
- `frontend/public/locales/` - Arquivos de tradução

---

## 🎯 **CHECKLIST DE CONFORMIDADE**

Antes de finalizar qualquer componente com internacionalização:

- [ ] Import `useTranslation` de `next-i18next`
- [ ] Especificar namespace no `useTranslation('common')`
- [ ] Usar chaves de tradução em vez de strings hardcoded
- [ ] Verificar se arquivo JSON existe para o idioma
- [ ] Testar com diferentes idiomas
- [ ] Verificar ESLint sem erros de i18n

---

**Nota**: Esta regra é fundamental para manter consistência e evitar warnings no projeto DOM v1. Sempre use `next-i18next` em vez de `react-i18next` para projetos Next.js. 