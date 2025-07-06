# Estrutura do Projeto - Aplicativo Multiplataforma

**Arquivo:** `docs/ESTRUTURA_PROJETO.md`  
**Diretório:** `docs/`  
**Descrição:** Estrutura detalhada e organização do projeto multiplataforma  
**Data de Criação:** 2024-12-19  
**Última Alteração:** 2024-12-19

---

## 📁 Estrutura Completa do Projeto

```
dom-v1/
├── apps/
│   ├── web/                          # Aplicação web (Next.js)
│   │   ├── src/
│   │   │   ├── components/           # Componentes específicos da web
│   │   │   ├── pages/                # Páginas Next.js
│   │   │   ├── hooks/                # Hooks customizados
│   │   │   ├── services/             # Serviços de API
│   │   │   ├── utils/                # Utilitários
│   │   │   ├── types/                # Definições de dados (JavaScript)
│   │   │   ├── styles/               # Estilos globais
│   │   │   └── app/                  # App Router (Next.js 13+)
│   │   ├── public/                   # Arquivos estáticos
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   ├── mobile/                       # Aplicação mobile (React Native)
│   │   ├── src/
│   │   │   ├── components/           # Componentes específicos mobile
│   │   │   ├── screens/              # Telas da aplicação
│   │   │   ├── navigation/           # Configuração de navegação
│   │   │   ├── hooks/                # Hooks customizados
│   │   │   ├── services/             # Serviços de API
│   │   │   ├── utils/                # Utilitários
│   │   │   ├── types/                # Definições de dados (JavaScript)
│   │   │   └── assets/               # Imagens, ícones, etc.
│   │   ├── android/                  # Configuração Android
│   │   ├── ios/                      # Configuração iOS
│   │   ├── metro.config.js
│   │   └── package.json
│   │
│   └── admin/                        # Painel administrativo
│       ├── src/
│       │   ├── components/           # Componentes admin
│       │   ├── pages/                # Páginas admin
│       │   ├── hooks/                # Hooks customizados
│       │   ├── services/             # Serviços admin
│       │   ├── utils/                # Utilitários
│       │   ├── types/                # Definições de dados (JavaScript)
│       │   └── layouts/              # Layouts admin
│       ├── public/
│       └── package.json
│
├── packages/
│   ├── ui/                           # Componentes compartilhados
│   │   ├── src/
│   │   │   ├── components/           # Componentes base
│   │   │   │   ├── Button/
│   │   │   │   │   ├── Button.tsx
│   │   │   │   │   ├── Button.types.ts
│   │   │   │   │   ├── Button.test.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── Card/
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   └── ...
│   │   │   ├── theme/                # Configuração de tema
│   │   │   ├── utils/                # Utilitários de UI
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/                        # Utilitários compartilhados
│   │   ├── src/
│   │   │   ├── validation/           # Validações
│   │   │   ├── formatting/           # Formatação de dados
│   │   │   ├── date/                 # Utilitários de data
│   │   │   ├── storage/              # Utilitários de storage
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/                        # Definições de dados compartilhadas (JavaScript)
│   │   ├── src/
│   │   │   ├── api/                  # Definições de API
│   │   │   ├── entities/             # Definições de entidades
│   │   │   ├── common/               # Definições comuns
│   │   │   └── index.js
│   │   ├── package.json
│   │   └── jsconfig.json
│   │
│   └── database/                     # Configuração Prisma
│       ├── prisma/
│       │   ├── schema.prisma         # Schema do banco
│       │   ├── migrations/           # Migrations
│       │   └── seed.ts               # Seeds
│       ├── src/
│       │   ├── client.ts             # Cliente Prisma
│       │   ├── repositories/         # Repositórios
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── shared/
│   ├── constants/                    # Constantes compartilhadas
│   │   ├── api.ts                    # Constantes de API
│   │   ├── routes.ts                 # Constantes de rotas
│   │   ├── validation.ts             # Constantes de validação
│   │   └── index.ts
│   │
│   ├── messages/                     # Mensagens centralizadas
│   │   ├── pt-BR.ts                  # Português Brasil
│   │   ├── en-US.ts                  # Inglês EUA
│   │   ├── es-ES.ts                  # Espanhol
│   │   └── index.ts
│   │
│   └── validations/                  # Validações compartilhadas
│       ├── schemas/                  # Schemas de validação
│       ├── rules/                    # Regras de validação
│       └── index.ts
│
├── docs/                             # Documentação
│   ├── DIRETRIZES_DESENVOLVIMENTO.md
│   ├── ESTRUTURA_PROJETO.md
│   ├── API.md
│   ├── COMPONENTS.md
│   ├── DEPLOYMENT.md
│   └── README.md
│
├── scripts/                          # Scripts de automação
│   ├── setup.sh                      # Script de setup
│   ├── deploy.sh                     # Script de deploy
│   ├── test.sh                       # Script de testes
│   └── lint.sh                       # Script de lint
│
├── .github/                          # Configuração GitHub
│   ├── workflows/                    # CI/CD workflows
│   │   ├── ci.yml
│   │   ├── deploy-staging.yml
│   │   └── deploy-production.yml
│   └── ISSUE_TEMPLATE/               # Templates de issues
│
├── .vscode/                          # Configuração VS Code
│   ├── settings.json
│   ├── extensions.json
│   └── launch.json
│
├── turbo.json                        # Configuração Turbo
├── package.json                      # Package.json raiz
├── jsconfig.json                     # Configuração JavaScript
├── .eslintrc.js                      # Configuração ESLint
├── .prettierrc                       # Configuração Prettier
├── .gitignore                        # Arquivos ignorados pelo Git
├── README.md                         # README principal
└── docker-compose.yml                # Configuração Docker
```

---

## 🏗️ Configuração de Monorepo

### Turbo (Build System)

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^test"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Package.json Raiz

```json
// package.json
{
  "name": "dom-v1",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean",
    "db:migrate": "cd packages/database && npm run migrate",
    "db:seed": "cd packages/database && npm run seed",
    "db:studio": "cd packages/database && npm run studio"
  },
  "devDependencies": {
    "turbo": "^1.10.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 📦 Estrutura de Pacotes

### Package UI (Componentes Compartilhados)

```typescript
// packages/ui/src/components/Button/Button.tsx
/**
 * @fileoverview Button
 * @directory packages/ui/src/components/Button
 * @description Componente de botão reutilizável
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React from 'react'
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material'
import { ButtonProps } from './Button.types'

export const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  children,
  ...props
}) => {
  return (
    <MuiButton variant={variant} size={size} {...props}>
      {children}
    </MuiButton>
  )
}

Button.defaultProps = {
  variant: 'contained',
  size: 'medium'
}
```

```typescript
// packages/ui/src/components/Button/Button.types.ts
export interface ButtonProps {
  variant?: 'text' | 'outlined' | 'contained'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  fullWidth?: boolean
}
```

```typescript
// packages/ui/src/index.ts
export { Button } from './components/Button'
export { Card } from './components/Card'
export { Input } from './components/Input'
export { Modal } from './components/Modal'
export { theme } from './theme'
```

### Package Utils (Utilitários)

```typescript
// packages/utils/src/validation/email.ts
/**
 * @fileoverview Email validation utilities
 * @directory packages/utils/src/validation
 * @description Utilitários para validação de e-mail
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateEmail = (email: string): string | null => {
  if (!email) return 'E-mail é obrigatório'
  if (!isValidEmail(email)) return 'E-mail inválido'
  return null
}
```

```typescript
// packages/utils/src/formatting/currency.ts
export const formatCurrency = (value: number, currency = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(value)
}

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2
  }).format(value / 100)
}
```

### Package Types (Tipos Compartilhados)

```typescript
// packages/types/src/entities/User.ts
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'admin' | 'user' | 'moderator'
export type UserStatus = 'active' | 'inactive' | 'pending'

export interface CreateUserRequest {
  name: string
  email: string
  role?: UserRole
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}
```

```typescript
// packages/types/src/api/ApiResponse.ts
export interface ApiResponse<T> {
  data: T
  status: number
  message: string
  timestamp: Date
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}
```

---

## 🔧 Configurações de Desenvolvimento

### JavaScript Config

```json
// jsconfig.json (raiz)
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": ["**/*.js", "**/*.jsx"],
  "exclude": ["node_modules"]
}
```

### ESLint Config

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'prettier'
  ],
  plugins: ['react-hooks'],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-unused-vars': 'error'
  },
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx'],
      env: {
        jest: true
      }
    }
  ]
}
```

### Prettier Config

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

---

## 🚀 Scripts de Automação

### Setup Script

```bash
#!/bin/bash
# scripts/setup.sh

echo "🚀 Configurando projeto DOM v1..."

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Configurar banco de dados
echo "🗄️ Configurando banco de dados..."
cd packages/database
npm run migrate
npm run seed
cd ../..

# Build dos pacotes
echo "🔨 Fazendo build dos pacotes..."
npm run build

# Verificar JavaScript
echo "🔍 Verificando JavaScript..."
npm run lint

# Rodar lint
echo "🧹 Executando lint..."
npm run lint

echo "✅ Setup concluído com sucesso!"
```

### Deploy Script

```bash
#!/bin/bash
# scripts/deploy.sh

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
  echo "❌ Ambiente não especificado"
  echo "Uso: ./deploy.sh [staging|production]"
  exit 1
fi

echo "🚀 Deployando para $ENVIRONMENT..."

# Build
echo "🔨 Fazendo build..."
npm run build

# Testes
echo "🧪 Executando testes..."
npm run test

# Deploy
echo "📤 Fazendo deploy..."
case $ENVIRONMENT in
  "staging")
    # Deploy para staging
    ;;
  "production")
    # Deploy para produção
    ;;
  *)
    echo "❌ Ambiente inválido"
    exit 1
    ;;
esac

echo "✅ Deploy concluído!"
```

---

## 📋 Checklist de Estrutura

### ✅ Estrutura de Diretórios
- [ ] Monorepo configurado com Turbo
- [ ] Apps separadas (web, mobile, admin)
- [ ] Pacotes compartilhados organizados
- [ ] Documentação estruturada
- [ ] Scripts de automação

### ✅ Configurações
- [ ] JavaScript configurado
- [ ] ESLint configurado
- [ ] Prettier configurado
- [ ] Path aliases configurados
- [ ] Workspaces configurados

### ✅ Padrões
- [ ] Cabeçalhos em todos os arquivos
- [ ] Nomenclatura consistente
- [ ] Estrutura de componentes
- [ ] Definições de dados compartilhadas
- [ ] Utilitários organizados

---

**Última atualização:** 2024-12-19  
**Versão:** 1.0.0  
**Responsável:** Equipe de Desenvolvimento 