# 🚫 PROIBIÇÃO TOTAL DE TYPESCRIPT - APENAS JAVASCRIPT

**Arquivo:** `docs/REGRAS_JAVASCRIPT.md`
**Diretório:** `docs/`
**Descrição:** Regras absolutas sobre uso exclusivo de JavaScript no projeto DOM v1
**Data de Criação:** 2024-12-19
**Última Alteração:** 2024-12-19
**Autor:** Equipe DOM v1

---

## ⚠️ REGRA FUNDAMENTAL DO PROJETO

**O projeto DOM v1 usa APENAS JavaScript puro. TypeScript é PROIBIDO.**

Esta regra é **ABSOLUTA** e deve ser seguida por:
- ✅ Desenvolvedores humanos
- ✅ IAs e assistentes de código
- ✅ Contribuidores externos
- ✅ Qualquer pessoa que trabalhe no projeto

---

## 🚫 O QUE É PROIBIDO

### ❌ TypeScript (.ts, .tsx)
```typescript
// ❌ NUNCA criar arquivos .ts ou .tsx
// ❌ NUNCA usar sintaxe TypeScript
interface User {
  id: string;
  name: string;
  email: string;
}

const user: User = {
  id: "123",
  name: "João",
  email: "joao@email.com"
};
```

### ❌ Interfaces e Tipos
```typescript
// ❌ NUNCA usar interface
interface ComponentProps {
  title: string;
  children: React.ReactNode;
}

// ❌ NUNCA usar type
type Status = 'pending' | 'approved' | 'rejected';
type UserRole = 'admin' | 'user' | 'moderator';
```

### ❌ Tipagens Explícitas
```typescript
// ❌ NUNCA usar tipagem explícita
const name: string = "João";
const age: number = 30;
const isActive: boolean = true;
const users: User[] = [];
```

### ❌ Generics
```typescript
// ❌ NUNCA usar generics
function getData<T>(id: string): T {
  return fetch(`/api/${id}`).then(res => res.json());
}

const users: Array<User> = [];
```

### ❌ Enums TypeScript
```typescript
// ❌ NUNCA usar enum
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}
```

### ❌ Imports de Tipos
```typescript
// ❌ NUNCA usar import type
import type { User } from './types';
import type { ComponentProps } from 'react';
```

### ❌ Configurações TypeScript
```json
// ❌ NUNCA ter tsconfig.json
// ❌ NUNCA ter dependências TypeScript no package.json
{
  "typescript": "❌ REMOVER",
  "@types/node": "❌ REMOVER",
  "@types/react": "❌ REMOVER",
  "@typescript-eslint/eslint-plugin": "❌ REMOVER"
}
```

---

## ✅ O QUE É OBRIGATÓRIO

### ✅ JavaScript Puro (.js, .jsx)
```javascript
// ✅ SEMPRE usar arquivos .js ou .jsx
// ✅ SEMPRE usar JavaScript puro

/**
 * @fileoverview User Component
 * @description Componente para exibição de usuário
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID do usuário
 * @param {string} props.name - Nome do usuário
 * @param {string} props.email - Email do usuário
 */
const User = ({ id, name, email }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>{email}</p>
    </div>
  );
};
```

### ✅ JSDoc para Documentação
```javascript
/**
 * Função para buscar dados do usuário
 * @param {string} userId - ID do usuário
 * @param {Object} options - Opções de busca
 * @param {boolean} [options.includeProfile=false] - Incluir perfil completo
 * @returns {Promise<Object>} Dados do usuário
 * @throws {Error} Se o usuário não for encontrado
 */
const getUserData = async (userId, options = {}) => {
  const { includeProfile = false } = options;
  
  try {
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    
    if (includeProfile) {
      const profileResponse = await fetch(`/api/users/${userId}/profile`);
      const profileData = await profileResponse.json();
      return { ...userData, profile: profileData };
    }
    
    return userData;
  } catch (error) {
    throw new Error(`Erro ao buscar usuário: ${error.message}`);
  }
};
```

### ✅ Comentários Descritivos
```javascript
// ✅ SEMPRE usar comentários para explicar estruturas de dados
const userStatuses = {
  ACTIVE: 'active',      // Usuário ativo no sistema
  INACTIVE: 'inactive',  // Usuário inativo
  PENDING: 'pending'     // Usuário aguardando aprovação
};

// ✅ SEMPRE documentar objetos complexos
const userValidation = {
  required: ['id', 'name', 'email'],           // Campos obrigatórios
  optional: ['phone', 'address', 'birthDate'], // Campos opcionais
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,       // Regex para email
    phone: /^\(\d{2}\) \d{4,5}-\d{4}$/         // Regex para telefone
  }
};
```

### ✅ Validação com JavaScript
```javascript
// ✅ SEMPRE validar dados com JavaScript puro
const validateUser = (user) => {
  // Verificar se o objeto existe
  if (!user || typeof user !== 'object') {
    return { isValid: false, error: 'Usuário inválido' };
  }
  
  // Verificar campos obrigatórios
  const requiredFields = ['id', 'name', 'email'];
  for (const field of requiredFields) {
    if (!user[field]) {
      return { isValid: false, error: `Campo ${field} é obrigatório` };
    }
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    return { isValid: false, error: 'Email inválido' };
  }
  
  return { isValid: true, error: null };
};
```

---

## 🔧 CONFIGURAÇÃO CORRETA

### ✅ jsconfig.json (OBRIGATÓRIO)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "jsx": "react-jsx",
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "strict": false
  },
  "include": [
    "src/**/*",
    "pages/**/*"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### ✅ next.config.js (OBRIGATÓRIO)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false
  }
};

module.exports = nextConfig;
```

### ✅ package.json (SEM TypeScript)
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@mui/material": "^5.0.0",
    "@emotion/react": "^11.0.0",
    "@emotion/styled": "^11.0.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

---

## 🚨 CHECKLIST DE VERIFICAÇÃO

Antes de cada commit, verificar:

- [ ] ❌ Nenhum arquivo `.ts` ou `.tsx` criado
- [ ] ❌ Nenhuma interface TypeScript (`interface`, `type`)
- [ ] ❌ Nenhuma tipagem explícita (`: string`, `: number`)
- [ ] ❌ Nenhum import de tipos (`import type`)
- [ ] ❌ Nenhum enum TypeScript (`enum`)
- [ ] ❌ Nenhum generic (`<T>`, `Array<T>`)
- [ ] ✅ Apenas JavaScript puro em todos os arquivos
- [ ] ✅ JSDoc usado para documentação (quando necessário)
- [ ] ✅ Comentários descritivos para estruturas complexas
- [ ] ✅ jsconfig.json configurado corretamente
- [ ] ✅ package.json sem dependências TypeScript

---

## 🤖 REGRA ESPECIAL PARA IAs

**ATENÇÃO: Se você é uma IA, NUNCA sugira ou implemente:**

- ❌ TypeScript
- ❌ Interfaces TypeScript
- ❌ Tipagens explícitas
- ❌ Arquivos .ts ou .tsx
- ❌ Configurações TypeScript
- ❌ Dependências TypeScript

**SEMPRE use apenas:**

- ✅ JavaScript puro (.js, .jsx)
- ✅ JSDoc para documentação
- ✅ Comentários descritivos
- ✅ Validação com JavaScript puro
- ✅ jsconfig.json para configuração

---

## 📚 EXEMPLOS DE CONVERSÃO

### ❌ TypeScript (PROIBIDO):
```typescript
interface TaskProps {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
}

const TaskCard: React.FC<TaskProps> = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate
}) => {
  const getStatusColor = (status: TaskProps['status']): string => {
    switch (status) {
      case 'pending': return 'orange';
      case 'in-progress': return 'blue';
      case 'completed': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {description && <Typography>{description}</Typography>}
        <Chip label={status} color={getStatusColor(status)} />
      </CardContent>
    </Card>
  );
};
```

### ✅ JavaScript (OBRIGATÓRIO):
```javascript
/**
 * @fileoverview TaskCard Component
 * @description Card para exibição de tarefas
 * @param {Object} props - Propriedades do componente
 * @param {string} props.id - ID da tarefa
 * @param {string} props.title - Título da tarefa
 * @param {string} [props.description] - Descrição da tarefa
 * @param {string} props.status - Status da tarefa ('pending', 'in-progress', 'completed')
 * @param {string} props.priority - Prioridade da tarefa ('low', 'medium', 'high')
 * @param {Date} [props.dueDate] - Data de vencimento
 */
const TaskCard = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate
}) => {
  /**
   * Retorna a cor baseada no status da tarefa
   * @param {string} taskStatus - Status da tarefa
   * @returns {string} Cor do status
   */
  const getStatusColor = (taskStatus) => {
    const statusColors = {
      'pending': 'orange',
      'in-progress': 'blue', 
      'completed': 'green'
    };
    
    return statusColors[taskStatus] || 'gray';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {description && <Typography>{description}</Typography>}
        <Chip label={status} color={getStatusColor(status)} />
      </CardContent>
    </Card>
  );
};
```

---

## ⚡ VANTAGENS DO JAVASCRIPT PURO

- ✅ **Build mais rápido** - Sem compilação TypeScript
- ✅ **Menos dependências** - Sem pacotes TypeScript
- ✅ **Configuração mais simples** - Sem tsconfig.json
- ✅ **Menor curva de aprendizado** - JavaScript é mais acessível
- ✅ **Compatibilidade total** - Funciona em qualquer ambiente
- ✅ **Debugging mais direto** - Sem camada de tipos
- ✅ **Menor bundle size** - Sem tipos no build final

---

## 🎯 LEMBRETE FINAL

**Esta regra é FUNDAMENTAL para o projeto DOM v1.**

Qualquer violação desta regra resultará em:
- ❌ Rejeição do pull request
- ❌ Reversão do commit
- ❌ Necessidade de refatoração

**SEMPRE use JavaScript puro. NUNCA use TypeScript.** 