# Diretrizes de Desenvolvimento - Aplicativo Multiplataforma

**Arquivo:** `docs/DIRETRIZES_DESENVOLVIMENTO.md`
**Diretório:** `docs/`
**Descrição:** Diretrizes e regras para desenvolvimento de aplicativo web, iOS e Android
**Data de Criação:** 2024-12-19
**Última Alteração:** 2024-12-19

---

## 📋 Índice

1. [Estrutura do Projeto](#estrutura-do-projeto)
2. [Padrões de Nomenclatura](#padrões-de-nomenclatura)
3. [Arquitetura e Organização](#arquitetura-e-organização)
4. [Componentes e Reutilização](#componentes-e-reutilização)
5. [UI/UX e Material-UI](#uiux-e-material-ui)
6. [Banco de Dados e Prisma](#banco-de-dados-e-prisma)
7. [Internacionalização](#internacionalização)
8. [Performance e Otimização](#performance-e-otimização)
9. [Testes e Qualidade](#testes-e-qualidade)
10. [Documentação](#documentação)
11. [Versionamento e Deploy](#versionamento-e-deploy)
12. [🚫 PROIBIÇÃO TypeScript](#proibição-typescript)

---

## 🏗️ Estrutura do Projeto

### Organização de Diretórios

```
dom-v1/
├── apps/
│   ├── web/                 # Aplicação web (Next.js)
│   ├── mobile/              # Aplicação mobile (React Native)
│   └── admin/               # Painel administrativo
├── packages/
│   ├── ui/                  # Componentes compartilhados
│   ├── utils/               # Utilitários compartilhados
│   ├── constants/           # Constantes compartilhadas (JavaScript)
│   └── database/            # Configuração Prisma
├── docs/                    # Documentação
├── scripts/                 # Scripts de automação
└── shared/
    ├── constants/           # Constantes compartilhadas
    ├── messages/            # Mensagens centralizadas
    └── validations/         # Validações compartilhadas
```

---

## 📝 Padrões de Nomenclatura

### Arquivos e Diretórios

- **kebab-case** para arquivos e diretórios: `user-profile.js`, `api-routes/`
- **PascalCase** para componentes React: `UserProfile.jsx`, `ProductCard.jsx`
- **camelCase** para variáveis, funções e métodos: `getUserData()`, `isLoading`

### Componentes

```javascript
// ✅ Correto
export const UserProfile = () => { ... }
export const ProductCard = () => { ... }

// ❌ Incorreto
export const userProfile = () => { ... }
export const product_card = () => { ... }
```

### Banco de Dados

- **snake_case** para tabelas e colunas: `user_profiles`, `created_at`
- **PascalCase** para modelos Prisma: `UserProfile`, `Product`

### 🚫 PROIBIÇÃO TypeScript

- **NUNCA** usar arquivos `.ts` ou `.tsx`
- **NUNCA** usar interfaces TypeScript
- **NUNCA** usar tipos TypeScript
- **SEMPRE** usar JavaScript puro (.js, .jsx)

---

## 🏛️ Arquitetura e Organização

### Cabeçalho Obrigatório em Todos os Arquivos

```javascript
/**
 * @fileoverview Nome do arquivo
 * @directory caminho/do/diretorio
 * @description Descrição detalhada da função do arquivo
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Nome do Desenvolvedor
 */
```

### Divisão de Arquivos Grandes

- **Máximo 300 linhas** por arquivo
- Arquivos maiores devem ser divididos em módulos menores
- Cada arquivo deve ter uma responsabilidade única

### Imports com Alias @/

```javascript
// ✅ Correto
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/UserService';

// ❌ Incorreto
import { Button } from '../../../components/ui/Button';
```

---

## 🧩 Componentes e Reutilização

### Princípios de Componentização

1. **Componentes Atômicos**: Criar componentes pequenos e reutilizáveis
2. **Composição sobre Herança**: Preferir composição de componentes
3. **Props documentadas via JSDoc**
4. **Default Props**: Usar default props quando apropriado

### Estrutura de Componente

```javascript
/**
 * @fileoverview UserCard
 * @directory components/ui/UserCard
 * @description Card reutilizável para exibição de informações do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React from 'react'
import { Card, CardContent, Typography, Avatar } from '@mui/material'

/**
 * @param {Object} props
 * @param {Object} props.user
 * @param {string} props.user.avatar
 * @param {string} props.user.name
 * @param {string} props.user.email
 * @param {Function} [props.onEdit]
 * @param {Function} [props.onDelete]
 */
export const UserCard = ({ user, onEdit = () => {}, onDelete = () => {}, ...props }) => {
  return (
    <Card {...props}>
      <CardContent>
        <Avatar src={user.avatar} alt={user.name} />
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </CardContent>
    </Card>
  )
}
```

### Evitar Duplicidade

- Criar hooks customizados para lógica reutilizável
- Usar constantes para valores repetidos
- Implementar utilitários para operações comuns

---

## 🎨 UI/UX e Material-UI

### MUI v5 (Material-UI moderno)

- Usar componentes MUI como base
- Customizar através do sistema de temas
- Preferir ícones e cards sobre botões tradicionais

### Tooltips Obrigatórios

```javascript
// ✅ Todos os inputs devem ter tooltips
<TextField
  label={t('user.email')}
  InputProps={{
    endAdornment: (
      <Tooltip title={t('user.email.help')}>
        <InfoIcon />
      </Tooltip>
    )
  }}
/>
```

### Ícones e Cards

```javascript
// ✅ Preferir cards com ícones
<Card onClick={handleAction}>
  <CardContent>
    <IconButton>
      {/* ... */}
    </IconButton>
  </CardContent>
</Card>
```

---

## 🔒 JavaScript Puro - PROIBIÇÃO TOTAL DE TYPESCRIPT

### ⚠️ REGRA OBRIGATÓRIA: APENAS JAVASCRIPT

**Esta regra é ABSOLUTA e deve ser seguida por TODOS os desenvolvedores e IAs.**

### ❌ PROIBIDO (NUNCA FAZER):

- **TypeScript** (.ts, .tsx)
- **Interfaces TypeScript** (`interface`, `type`)
- **Tipagens explícitas** (`: string`, `: number`, `: boolean`)
- **Generics** (`<T>`, `Array<T>`)
- **Enums TypeScript** (`enum`)
- **Namespaces** (`namespace`)
- **Decorators TypeScript** (`@Component`)
- **Imports de tipos** (`import type`)

### ✅ OBRIGATÓRIO (SEMPRE FAZER):

- **JavaScript puro** (.js, .jsx)
- **JSDoc para documentação** (opcional, mas recomendado)
- **PropTypes** (se necessário para validação)
- **Comentários descritivos** para explicar estruturas de dados

### 📋 EXEMPLOS DE CONVERSÃO:

#### ❌ TypeScript (PROIBIDO):
```typescript
interface UserProps {
  id: string;
  name: string;
  email: string;
  isActive?: boolean;
}

const UserCard: React.FC<UserProps> = ({ id, name, email, isActive = true }) => {
  return <div>{name}</div>;
};
```

#### ✅ JavaScript (OBRIGATÓRIO):
```javascript
/**
 * @fileoverview UserCard Component
 * @description Card para exibição de informações do usuário
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID do usuário
 * @param {string} props.name - Nome do usuário
 * @param {string} props.email - Email do usuário
 * @param {boolean} [props.isActive=true] - Status ativo do usuário
 */
const UserCard = ({ id, name, email, isActive = true }) => {
  return <div>{name}</div>;
};
```

### 🎯 VALIDAÇÃO DE DADOS:

#### ❌ TypeScript (PROIBIDO):
```typescript
const validateUser = (user: User): boolean => {
  return user.id && user.name && user.email;
};
```

#### ✅ JavaScript (OBRIGATÓRIO):
```javascript
/**
 * Valida se o objeto usuário tem todas as propriedades obrigatórias
 * @param {Object} user - Objeto do usuário
 * @param {string} user.id - ID do usuário
 * @param {string} user.name - Nome do usuário
 * @param {string} user.email - Email do usuário
 * @returns {boolean} True se válido, false caso contrário
 */
const validateUser = (user) => {
  return user && user.id && user.name && user.email;
};
```

### 🔧 CONFIGURAÇÃO DO PROJETO:

#### Arquivos de Configuração:
- **jsconfig.json** (não tsconfig.json)
- **next.config.js** (não next.config.ts)
- **package.json** sem dependências TypeScript

#### Dependências PROIBIDAS:
```json
{
  "typescript": "❌ REMOVER",
  "@types/node": "❌ REMOVER", 
  "@types/react": "❌ REMOVER",
  "@types/react-dom": "❌ REMOVER",
  "@typescript-eslint/eslint-plugin": "❌ REMOVER",
  "@typescript-eslint/parser": "❌ REMOVER"
}
```

### 🚨 CHECKLIST DE VERIFICAÇÃO:

Antes de cada commit, verificar:
- [ ] Nenhum arquivo `.ts` ou `.tsx` criado
- [ ] Nenhuma interface TypeScript (`interface`, `type`)
- [ ] Nenhuma tipagem explícita (`: string`, `: number`)
- [ ] Nenhum import de tipos (`import type`)
- [ ] Apenas JavaScript puro em todos os arquivos
- [ ] JSDoc usado para documentação (quando necessário)

### 🤖 REGRA ESPECIAL PARA IAs:

**ATENÇÃO: Se você é uma IA, NUNCA sugira ou implemente:**
- TypeScript
- Interfaces TypeScript
- Tipagens explícitas
- Arquivos .ts ou .tsx
- Configurações TypeScript

**SEMPRE use apenas:**
- JavaScript puro (.js, .jsx)
- JSDoc para documentação
- Comentários descritivos
- PropTypes se necessário

### 📚 DOCUMENTAÇÃO E COMENTÁRIOS:

```javascript
/**
 * @fileoverview Nome do arquivo
 * @directory caminho/do/diretorio
 * @description Descrição detalhada da função do arquivo
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Nome do Desenvolvedor
 */

/**
 * Função para buscar dados do usuário
 * @param {string} userId - ID do usuário
 * @param {Object} options - Opções de busca
 * @param {boolean} [options.includeProfile=false] - Incluir perfil completo
 * @returns {Promise<Object>} Dados do usuário
 */
const getUserData = async (userId, options = {}) => {
  // implementação
};
```

### ⚡ PERFORMANCE E MANUTENIBILIDADE:

**Vantagens do JavaScript puro:**
- ✅ Build mais rápido
- ✅ Menos dependências
- ✅ Configuração mais simples
- ✅ Menor curva de aprendizado
- ✅ Compatibilidade total
- ✅ Debugging mais direto

**Esta regra é FUNDAMENTAL para o projeto DOM v1.**

---

## 🗄️ Banco de Dados e Prisma

### Configuração Prisma + PostgreSQL

```typescript
// packages/database/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  role      UserRole @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

### Seeds Obrigatórios

```typescript
// packages/database/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário admin padrão
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Administrador',
      role: 'ADMIN',
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Migrations

- Sempre criar migrations para mudanças no schema
- Testar migrations em ambiente de desenvolvimento
- Documentar mudanças significativas

---

## 🌍 Internacionalização

### ⚠️ **OBRIGATÓRIO: next-i18next (NÃO react-i18next)**

**Esta regra é ABSOLUTA para projetos Next.js.**

#### ❌ **PROIBIDO:**
```javascript
// ❌ NUNCA usar react-i18next diretamente
import { useTranslation } from 'react-i18next'
import i18n from '@/utils/i18n'

// ❌ NUNCA configurar i18next manualmente
i18n.use(initReactI18next).init({...})
```

#### ✅ **OBRIGATÓRIO:**
```javascript
// ✅ SEMPRE usar next-i18next
import { useTranslation } from 'next-i18next'

// ✅ SEMPRE usar appWithTranslation no _app.jsx
export default appWithTranslation(MyApp)

// ✅ SEMPRE ter next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR', 'en', 'es']
  }
}
```

### Estrutura de Arquivos Obrigatória
```
frontend/public/locales/
├── pt-BR/
│   └── common.json
├── en/
│   └── common.json
└── es/
    └── common.json
```

### Uso Correto
```javascript
// ✅ Correto - next-i18next
const { t } = useTranslation('common')
return <Button>{t('common.save')}</Button>

// ✅ Correto - com namespace
const { t } = useTranslation(['common', 'auth'])
return <Button>{t('auth.login')}</Button>
```

### Configuração Obrigatória
```javascript
// next.config.js
const { i18n } = require('./next-i18next.config.js')

const nextConfig = {
  i18n, // OBRIGATÓRIO
  // ... outras configurações
}
```

---

## ⚡ Performance e Otimização

### Lazy Loading

```typescript
// Lazy load de componentes pesados
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Lazy load de rotas
const UserProfile = lazy(() => import('@/pages/UserProfile'));
```

### Memoização

```typescript
// Usar React.memo para componentes que recebem as mesmas props
export const UserCard = React.memo<UserCardProps>(({ user }) => {
  return <Card>{user.name}</Card>
})

// Usar useMemo para cálculos pesados
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

// Usar useCallback para funções passadas como props
const handleClick = useCallback((id: string) => {
  onUserClick(id)
}, [onUserClick])
```

### Bundle Splitting

- Separar código por rotas
- Carregar bibliotecas pesadas sob demanda
- Otimizar imports do MUI

---

## 🧪 Testes e Qualidade

### Estrutura de Testes

```
tests/
├── unit/           # Testes unitários
├── integration/    # Testes de integração
├── e2e/           # Testes end-to-end
└── __mocks__/     # Mocks compartilhados
```

### Testes Obrigatórios

```javascript
// components/__tests__/UserCard.test.jsx
import { render, screen } from '@testing-library/react'
import { UserCard } from '../UserCard'

describe('UserCard', () => {
  it('should render user information correctly', () => {
    const user = {
      id: '1',
      name: 'João Silva',
      email: 'joao@example.com',
    }

    render(<UserCard user={user} />)

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('joao@example.com')).toBeInTheDocument()
  })
})
```

### Code Quality

- ESLint configurado para JavaScript
- Prettier para formatação
- Husky para pre-commit hooks
- SonarQube para análise de qualidade

---

## 📚 Documentação

### Documentação Obrigatória

1. **README.md** em cada diretório principal
2. **API.md** para documentação de APIs
3. **COMPONENTS.md** para documentação de componentes
4. **DEPLOYMENT.md** para instruções de deploy

### JSDoc para Funções

```javascript
/**
 * Calcula o total de vendas para um período específico
 * @param {Date} startDate - Data de início do período
 * @param {Date} endDate - Data de fim do período
 * @param {string} [userId] - ID do usuário (opcional)
 * @returns {Promise<number>} Promise com o total de vendas
 * @throws {ValidationError} Se as datas forem inválidas
 */
export const calculateSalesTotal = async (startDate, endDate, userId) => {
  // implementação
};
```

---

## 🚀 Versionamento e Deploy

### Git Flow

- **main**: Código em produção
- **develop**: Código em desenvolvimento
- **feature/**: Novas funcionalidades
- **hotfix/**: Correções urgentes

### Commits Semânticos

```bash
feat: adiciona autenticação com Google
fix: corrige validação de e-mail
docs: atualiza documentação da API
refactor: refatora componente UserCard
test: adiciona testes para UserService
```

### CI/CD

- Build automático em cada PR
- Testes automáticos
- Deploy automático para staging
- Deploy manual para produção

---

## 🔧 Scripts e Automação

### Scripts NPM

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "check-js": "turbo run check-js",
    "db:migrate": "prisma migrate deploy",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```

---

## 📋 Checklist de Revisão

### Antes de Fazer Commit

- [ ] Código segue padrões de nomenclatura
- [ ] Todos os arquivos têm cabeçalho
- [ ] Não há uso de `any`
- [ ] Componentes são reutilizáveis
- [ ] Tooltips implementados nos inputs
- [ ] Mensagens centralizadas
- [ ] Testes passando
- [ ] Lint sem erros
- [ ] JavaScript puro (sem TypeScript)
- [ ] Documentação atualizada

### Antes de Fazer Deploy

- [ ] Todos os testes passando
- [ ] Build sem erros
- [ ] Migrations aplicadas
- [ ] Seeds executados
- [ ] Variáveis de ambiente configuradas
- [ ] Performance testada
- [ ] Acessibilidade verificada

---

## 📞 Suporte e Contato

Para dúvidas sobre estas diretrizes:

- Criar issue no repositório
- Consultar documentação específica
- Contatar lead técnico do projeto

---

**Última atualização:** 2024-12-19
**Versão:** 1.0.0
**Responsável:** Equipe de Desenvolvimento

---

## 🚫 PROIBIÇÃO TypeScript

### ❌ **REGRA ABSOLUTA**

**O projeto DOM v1 usa APENAS JavaScript puro. TypeScript é PROIBIDO.**

### 🚫 **PROIBIDO:**
- ❌ Arquivos `.ts` ou `.tsx`
- ❌ Interfaces TypeScript (`interface`, `type`)
- ❌ Tipagens explícitas (`: string`, `: User`)
- ❌ Enums TypeScript (`enum`)
- ❌ Configurações TypeScript (`tsconfig.json`)
- ❌ Dependências TypeScript (`typescript`, `@types/*`)

### ✅ **OBRIGATÓRIO:**
- ✅ JavaScript puro (.js, .jsx)
- ✅ JSDoc para documentação
- ✅ PropTypes para validação
- ✅ Objetos JavaScript para constantes
- ✅ Validação com JavaScript puro

### 🚨 **PENALIDADES:**
- ❌ Rejeição automática de pull requests
- ❌ Reversão obrigatória de commits
- ❌ Necessidade de refatoração completa

### 🔍 **Verificação Automática**

#### Script Linux/Mac:
```bash
# Adicione ao seu CI ou rode localmente antes de commitar
if find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "tsconfig.json" \) ! -path "./node_modules/*" | grep .; then
  echo "❌ Arquivos TypeScript encontrados! Remova antes de commitar."
  exit 1
fi
```

#### Script Windows/PowerShell:
```powershell
Get-ChildItem -Recurse -Include *.ts,*.tsx,tsconfig.json | Where-Object { $_.FullName -notmatch 'node_modules' }
if ($?) {
  Write-Host '❌ Arquivos TypeScript encontrados! Remova antes de commitar.'
  exit 1
}
```

### 📋 **Checklist de Verificação:**
- [ ] ❌ Nenhum arquivo `.ts` ou `.tsx` criado
- [ ] ❌ Nenhuma interface TypeScript (`interface`, `type`)
- [ ] ❌ Nenhuma tipagem TypeScript (`: string`, `: User`)
- [ ] ❌ Nenhum enum TypeScript (`enum`)
- [ ] ❌ Nenhuma configuração TypeScript
- [ ] ✅ Apenas JavaScript puro em todos os arquivos
- [ ] ✅ JSDoc usado para documentação
- [ ] ✅ PropTypes usado para validação
- [ ] ✅ Objetos JavaScript para constantes

### 🎯 **EXEMPLO CORRETO:**
```javascript
/**
 * @fileoverview Componente UserCard
 * @directory components/ui/UserCard
 * @description Card para exibição de informações do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {Object} props.user
 * @param {string} props.user.id
 * @param {string} props.user.name
 * @param {string} props.user.email
 */
const UserCard = ({ user }) => {
  return (
    <div>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired
};

export default UserCard;
```

### 🚨 **LEMBRETE FINAL:**
**SEMPRE use JavaScript puro. NUNCA use TypeScript.**

---
