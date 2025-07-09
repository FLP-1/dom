# 🚫 PROIBIÇÃO TOTAL DE TYPESCRIPT - APENAS JAVASCRIPT

**Arquivo:** `docs/REGRAS_JAVASCRIPT.md`  
**Diretório:** `docs/`  
**Descrição:** Regras rigorosas para uso exclusivo de JavaScript puro  
**Data de Criação:** 2024-12-19  
**Última Alteração:** 2024-12-19  

---

## 🎯 **REGRA PRINCIPAL**

**O projeto DOM v1 usa APENAS JavaScript puro. TypeScript é PROIBIDO.**

### ✅ **PERMITIDO:**
- JavaScript (.js, .jsx)
- JSDoc para documentação
- PropTypes para validação de props
- Comentários explicativos

### ❌ **PROIBIDO:**
- TypeScript (.ts, .tsx)
- Interfaces TypeScript
- Tipos TypeScript
- Enums TypeScript
- Configurações TypeScript

---

## 🚫 **PROIBIÇÕES ESPECÍFICAS**

### ❌ TypeScript (.ts, .tsx)
```javascript
// ❌ NUNCA criar arquivos .ts ou .tsx
// ❌ NUNCA usar sintaxe TypeScript
// ❌ NUNCA usar tipagem TypeScript
```

### ❌ Interfaces TypeScript
```javascript
// ❌ NUNCA usar interfaces TypeScript
interface User {
  id: string;
  name: string;
}

// ❌ NUNCA usar tipos TypeScript
type UserType = {
  id: string;
  name: string;
}
```

### ❌ Tipos TypeScript
```javascript
// ❌ NUNCA usar tipagem TypeScript
const user: User = { id: '1', name: 'João' };
const users: User[] = [];
const handleClick: (event: MouseEvent) => void = () => {};
```

### ❌ Enums TypeScript
```javascript
// ❌ NUNCA usar enums TypeScript
enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

// ✅ Use objetos JavaScript
const UserRole = {
  ADMIN: 'admin',
  USER: 'user'
};
```

### ❌ Configurações TypeScript
```javascript
// ❌ NUNCA ter arquivos de configuração TypeScript
// tsconfig.json
// typescript.config.js

// ❌ NUNCA ter dependências TypeScript no package.json
"typescript": "❌ REMOVER",
"@types/node": "❌ REMOVER",
"@typescript-eslint/eslint-plugin": "❌ REMOVER"
```

---

## ✅ **ALTERNATIVAS CORRETAS**

### ✅ JSDoc para Documentação
```javascript
/**
 * @fileoverview Componente UserCard
 * @directory components/ui/UserCard
 * @description Card para exibição de informações do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

/**
 * @param {Object} props
 * @param {Object} props.user
 * @param {string} props.user.id
 * @param {string} props.user.name
 * @param {string} props.user.email
 * @param {Function} [props.onEdit]
 * @param {Function} [props.onDelete]
 */
export const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </CardContent>
    </Card>
  );
};
```

### ✅ PropTypes para Validação
```javascript
import PropTypes from 'prop-types';

const UserCard = ({ user, onEdit, onDelete }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{user.name}</Typography>
        <Typography variant="body2">{user.email}</Typography>
      </CardContent>
    </Card>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

UserCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {}
};
```

### ✅ Objetos JavaScript para Constantes
```javascript
// ✅ Use objetos JavaScript em vez de enums
const UserProfile = {
  EMPREGADOR: 'empregador',
  EMPREGADO: 'empregado',
  FAMILIAR: 'familiar',
  PARCEIRO: 'parceiro',
  SUBORDINADO: 'subordinado',
  ADMIN: 'admin',
  OWNER: 'owner'
};

const TaskStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};
```

### ✅ Validação com JavaScript
```javascript
// ✅ Validação com JavaScript puro
const validateUser = (user) => {
  if (!user || typeof user !== 'object') {
    throw new Error('User deve ser um objeto');
  }
  
  if (!user.id || typeof user.id !== 'string') {
    throw new Error('User.id deve ser uma string');
  }
  
  if (!user.name || typeof user.name !== 'string') {
    throw new Error('User.name deve ser uma string');
  }
  
  return true;
};
```

---

## 📁 **ESTRUTURA DE ARQUIVOS CORRETA**

### ✅ Estrutura JavaScript
```
components/
├── UserCard/
│   ├── UserCard.jsx
│   ├── UserCard.test.jsx
│   └── index.js
├── Button/
│   ├── Button.jsx
│   ├── Button.test.jsx
│   └── index.js
└── index.js

hooks/
├── useAuth.js
├── useUsers.js
└── index.js

utils/
├── validation.js
├── helpers.js
└── index.js
```

### ❌ Estrutura TypeScript (PROIBIDA)
```
components/
├── UserCard.tsx          ❌ PROIBIDO
├── UserCard.types.ts     ❌ PROIBIDO
├── Button.tsx            ❌ PROIBIDO
└── index.ts              ❌ PROIBIDO
```

---

## 🔧 **CONFIGURAÇÃO CORRETA**

### ✅ package.json (SEM TypeScript)
```json
{
  "name": "dom-v1",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "next": "^15.3.5",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@mui/material": "^2.0.0",
    "@mui/icons-material": "^2.0.0"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "eslint-config-next": "^15.3.5",
    "jest": "^29.0.0",
    "prop-types": "^15.8.0"
  }
}
```

### ✅ next.config.js
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

### ✅ .eslintrc.js
```javascript
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'prefer-const': 'error'
  }
};
```

---

## ✅ **CHECKLIST DE CONFORMIDADE**

### ✅ JavaScript Puro
- [ ] ✅ Apenas arquivos `.js` e `.jsx` criados
- [ ] ✅ JSDoc usado para documentação
- [ ] ✅ PropTypes usado para validação
- [ ] ✅ Objetos JavaScript para constantes
- [ ] ✅ Validação com JavaScript puro

### ❌ TypeScript (PROIBIDO)
- [ ] ❌ Nenhum arquivo `.ts` ou `.tsx` criado
- [ ] ❌ Nenhuma interface TypeScript (`interface`, `type`)
- [ ] ❌ Nenhuma tipagem TypeScript (`: string`, `: User`)
- [ ] ❌ Nenhum enum TypeScript (`enum`)
- [ ] ❌ Nenhuma configuração TypeScript

### ✅ Configuração
- [ ] ✅ package.json sem dependências TypeScript
- [ ] ✅ next.config.js sem configurações TypeScript
- [ ] ✅ .eslintrc.js sem plugins TypeScript
- [ ] ✅ tsconfig.json removido (se existir)

---

## 🎯 **EXEMPLOS DE USO CORRETO**

### ✅ Hook JavaScript
```javascript
/**
 * @fileoverview Hook useAuth
 * @directory hooks/useAuth
 * @description Hook para gerenciar autenticação
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import { useState, useEffect } from 'react';

/**
 * Hook para gerenciar autenticação
 * @returns {Object} Objeto com estado e funções de autenticação
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Falha no login');
      }
      
      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userToken');
  };

  return {
    user,
    loading,
    login,
    logout
  };
};
```

### ✅ Componente JavaScript
```javascript
/**
 * @fileoverview Componente TaskCard
 * @directory components/tasks/TaskCard
 * @description Card para exibição de tarefas
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Button } from '@mui/material';

/**
 * Componente para exibir uma tarefa
 * @param {Object} props
 * @param {Object} props.task
 * @param {string} props.task.id
 * @param {string} props.task.title
 * @param {string} props.task.description
 * @param {string} props.task.status
 * @param {Function} [props.onEdit]
 * @param {Function} [props.onDelete]
 */
const TaskCard = ({ task, onEdit, onDelete }) => {
  const handleEdit = () => {
    if (onEdit) onEdit(task);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(task.id);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography variant="body2">{task.description}</Typography>
        <Typography variant="caption">Status: {task.status}</Typography>
        
        <div>
          <Button onClick={handleEdit}>Editar</Button>
          <Button onClick={handleDelete} color="error">Excluir</Button>
        </div>
      </CardContent>
    </Card>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

TaskCard.defaultProps = {
  onEdit: null,
  onDelete: null
};

export default TaskCard;
```

---

## 🚫 **PROIBIÇÕES FINAIS**

### ❌ TypeScript (PROIBIDO):
```javascript
// ❌ NUNCA fazer isso
interface User {
  id: string;
  name: string;
}

type UserType = {
  id: string;
  name: string;
}

const user: User = { id: '1', name: 'João' };

enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}
```

### ✅ JavaScript (OBRIGATÓRIO):
```javascript
// ✅ SEMPRE fazer isso
/**
 * @param {Object} user
 * @param {string} user.id
 * @param {string} user.name
 */
const validateUser = (user) => {
  if (!user.id || !user.name) {
    throw new Error('User inválido');
  }
  return true;
};

const UserRole = {
  ADMIN: 'admin',
  USER: 'user'
};

const user = { id: '1', name: 'João' };
```

---

## 📋 **RESUMO DAS REGRAS**

### ✅ **PERMITIDO:**
- JavaScript (.js, .jsx)
- JSDoc para documentação
- PropTypes para validação
- Objetos JavaScript para constantes
- Validação com JavaScript puro

### ❌ **PROIBIDO:**
- TypeScript
- Interfaces TypeScript
- Tipos TypeScript
- Enums TypeScript
- Configurações TypeScript

### 🎯 **BENEFÍCIOS:**
- ✅ **Simplicidade** - Apenas JavaScript
- ✅ **Compatibilidade** - Funciona em qualquer ambiente
- ✅ **Performance** - Sem overhead de compilação
- ✅ **Manutenibilidade** - Código mais simples
- ✅ **Build mais rápido** - Sem compilação TypeScript
- ✅ **Menos dependências** - Sem pacotes TypeScript

---

## 🤖 **REGRAS ESPECÍFICAS PARA IAs E HUMANOS**

### 🚨 **PARA AGENTES DE IA:**
1. **NUNCA** sugira ou implemente TypeScript
2. **NUNCA** crie arquivos `.ts` ou `.tsx`
3. **NUNCA** use interfaces, tipos ou enums TypeScript
4. **SEMPRE** use JavaScript puro com JSDoc
5. **SEMPRE** use PropTypes para validação
6. **SEMPRE** use objetos JavaScript para constantes
7. **SEMPRE** documente com JSDoc detalhado

### 🚨 **PARA DESENVOLVEDORES HUMANOS:**
1. **NUNCA** use TypeScript em nenhum arquivo
2. **NUNCA** adicione dependências TypeScript
3. **NUNCA** configure TypeScript no projeto
4. **SEMPRE** use JavaScript puro
5. **SEMPRE** documente com JSDoc
6. **SEMPRE** use PropTypes para validação
7. **SEMPRE** valide dados com JavaScript puro

### 🚨 **PENALIDADES POR VIOLAÇÃO:**
- ❌ Rejeição automática de pull requests
- ❌ Reversão obrigatória de commits
- ❌ Necessidade de refatoração completa
- ❌ Violação das regras fundamentais do projeto

---

## 🚨 **LEMBRETE FINAL**

**SEMPRE use JavaScript puro. NUNCA use TypeScript.**

Esta regra é **OBRIGATÓRIA** para todos os desenvolvedores e agentes de IA que trabalham no projeto DOM v1.

**TypeScript é PROIBIDO em TODAS as circunstâncias.** 