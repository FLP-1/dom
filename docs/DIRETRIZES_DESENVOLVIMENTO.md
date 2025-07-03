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
6. [Tipagem e TypeScript](#tipagem-e-typescript)
7. [Banco de Dados e Prisma](#banco-de-dados-e-prisma)
8. [Internacionalização](#internacionalização)
9. [Performance e Otimização](#performance-e-otimização)
10. [Testes e Qualidade](#testes-e-qualidade)
11. [Documentação](#documentação)
12. [Versionamento e Deploy](#versionamento-e-deploy)

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
│   ├── types/               # Tipos TypeScript compartilhados
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

- **kebab-case** para arquivos e diretórios: `user-profile.tsx`, `api-routes/`
- **PascalCase** para componentes React: `UserProfile.tsx`, `ProductCard.tsx`
- **camelCase** para variáveis, funções e métodos: `getUserData()`, `isLoading`

### Componentes

```typescript
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

---

## 🏛️ Arquitetura e Organização

### Cabeçalho Obrigatório em Todos os Arquivos

```typescript
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

### Imports com Alias "@/"

```typescript
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
3. **Props Interface**: Sempre definir interface para props
4. **Default Props**: Usar default props quando apropriado

### Estrutura de Componente

```typescript
/**
 * @fileoverview UserCard
 * @directory components/ui/UserCard
 * @description Card reutilizável para exibição de informações do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React from 'react'
import { Card, CardContent, Typography, Avatar } from '@mui/material'
import { UserCardProps } from './UserCard.types'

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  ...props
}) => {
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

UserCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {}
}
```

### Evitar Duplicidade

- Criar hooks customizados para lógica reutilizável
- Usar constantes para valores repetidos
- Implementar utilitários para operações comuns

---

## 🎨 UI/UX e Material-UI

### Material-UI v2 (MUI)

- Usar componentes MUI como base
- Customizar através do sistema de temas
- Preferir ícones e cards sobre botões tradicionais

### Tooltips Obrigatórios

```typescript
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

```typescript
// ✅ Preferir cards com ícones
<Card onClick={handleAction}>
  <CardContent>
    <IconButton>
      <AddIcon />
    </IconButton>
    <Typography>Adicionar Item</Typography>
  </CardContent>
</Card>

// ❌ Evitar botões simples
<Button onClick={handleAction}>Adicionar Item</Button>
```

### Tema Centralizado

```typescript
// shared/theme/index.ts
export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});
```

---

## 🔒 Tipagem e TypeScript

### Proibição de "any"

```typescript
// ❌ NUNCA usar any
const data: any = response.data;

// ✅ Sempre tipar corretamente
interface UserData {
  id: string;
  name: string;
  email: string;
}

const data: UserData = response.data;
```

### Interfaces Obrigatórias

```typescript
// Sempre definir interfaces para props e dados
interface ComponentProps {
  title: string;
  description?: string;
  onAction: (id: string) => void;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

### Tipos Union e Literal

```typescript
type UserRole = 'admin' | 'user' | 'moderator';
type Status = 'pending' | 'approved' | 'rejected';

interface User {
  id: string;
  role: UserRole;
  status: Status;
}
```

---

## 🛡️ Regras de Tipagem, Props e Ambiente (Boas Práticas)

### Tipagem e Uso de Hooks

- Sempre utilize os nomes corretos das propriedades retornadas por hooks customizados.
  - Exemplo: `useUserProfile` retorna `currentProfile`, não `profile`.
- Se um hook for alterado, atualize todos os usos no projeto.

### Props de Componentes

- Props opcionais devem ser tipadas com `?` e, ao passar para componentes, nunca envie `undefined` explicitamente.
  - Exemplo:
    ```tsx
    // Correto
    trend={trend ? trend : undefined}
    // Melhor ainda
    {...(trend ? { trend } : {})}
    ```
- Sempre tipar arrays de dados (ex: `Record<string, StatData[]>`) para garantir segurança de acesso.

### Valores Permitidos em Props

- Só utilize valores permitidos pelo tipo da prop.
  - Exemplo: Para cor de botão, use apenas `"primary" | "secondary" | "success" | "warning" | "info" | "error"`.

### NODE_ENV

- Nunca defina `NODE_ENV` em arquivos `.env` para projetos Next.js. O valor deve ser controlado pelo ambiente do terminal ou pelo comando de build.
- Só use os valores: `development`, `production` ou `test`.

### Fallbacks para Arrays

- Sempre use fallback para arrays que podem ser `undefined` ao fazer `.map()`.
  - Exemplo:
    ```tsx
    {(statsData ?? []).map(...)}
    ```

### Padronização de Componentes

- Se um componente espera uma prop de cor, defina um valor padrão e documente os valores aceitos na interface.

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

### Estrutura de Mensagens

```typescript
// shared/messages/pt-BR.ts
export const messages = {
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    loading: 'Carregando...',
  },
  user: {
    profile: 'Perfil do Usuário',
    email: 'E-mail',
    'email.help': 'Digite um e-mail válido',
    name: 'Nome',
    'name.help': 'Digite seu nome completo',
  },
  errors: {
    required: 'Campo obrigatório',
    invalidEmail: 'E-mail inválido',
    networkError: 'Erro de conexão',
  },
};
```

### Hook de Tradução

```typescript
// hooks/useTranslation.ts
import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return { t, changeLanguage, currentLanguage: i18n.language };
};
```

### Uso nas Aplicações

```typescript
// Em componentes
const { t } = useTranslation()

return (
  <Typography>{t('user.profile')}</Typography>
)
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

```typescript
// components/__tests__/UserCard.test.tsx
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

- ESLint configurado para TypeScript
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

```typescript
/**
 * Calcula o total de vendas para um período específico
 * @param startDate - Data de início do período
 * @param endDate - Data de fim do período
 * @param userId - ID do usuário (opcional)
 * @returns Promise com o total de vendas
 * @throws {ValidationError} Se as datas forem inválidas
 */
export const calculateSalesTotal = async (
  startDate: Date,
  endDate: Date,
  userId?: string
): Promise<number> => {
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
    "type-check": "turbo run type-check",
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
- [ ] TypeScript sem erros
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
