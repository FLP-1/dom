# Guia de Contribuição

Obrigado por considerar contribuir para o DOM v1! Este documento fornece diretrizes para contribuições.

## 📋 Índice

- [Como Contribuir](#como-contribuir)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Fluxo de Desenvolvimento](#fluxo-de-desenvolvimento)
- [Padrões de Código](#padrões-de-código)
- [Testes](#testes)
- [Commits](#commits)
- [Pull Requests](#pull-requests)
- [Reportando Bugs](#reportando-bugs)
- [Solicitando Funcionalidades](#solicitando-funcionalidades)
- [Código de Conduta](#código-de-conduta)

## 🚀 Como Contribuir

### Tipos de Contribuição

- **🐛 Bug Fixes**: Correções de bugs
- **✨ Features**: Novas funcionalidades
- **📚 Documentação**: Melhorias na documentação
- **🧪 Testes**: Adição ou melhoria de testes
- **🎨 UI/UX**: Melhorias na interface
- **⚡ Performance**: Otimizações
- **🔒 Segurança**: Correções de segurança

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git
- Docker (opcional, mas recomendado)
- VS Code (recomendado)

## ⚙️ Configuração do Ambiente

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/dom-v1.git
cd dom-v1

# Adicione o repositório original como upstream
git remote add upstream https://github.com/original/dom-v1.git
```

### 2. Instalação

```bash
# Instale dependências
npm install

# Configure o ambiente
cp env.example .env.local
# Edite .env.local com suas configurações

# Execute o setup
npm run setup
```

### 3. Verificação

```bash
# Verifique se tudo está funcionando
npm run quality-check
npm run test
```

## 🔄 Fluxo de Desenvolvimento

### 1. Crie uma Branch

```bash
# Atualize sua branch main
git checkout main
git pull upstream main

# Crie uma nova branch para sua feature
git checkout -b feature/nome-da-feature
# ou
git checkout -b fix/nome-do-bug
```

### 2. Desenvolva

- Siga os [padrões de código](#padrões-de-código)
- Escreva testes para novas funcionalidades
- Mantenha commits pequenos e focados
- Documente mudanças significativas

### 3. Teste

```bash
# Execute testes
npm run test

# Verifique qualidade
npm run quality-check

# Verifique tipos
npm run type-check
```

### 4. Commit

```bash
# Use commits semânticos
git commit -m "feat: adiciona autenticação com Google"
git commit -m "fix: corrige validação de e-mail"
git commit -m "docs: atualiza README"
```

### 5. Push e Pull Request

```bash
git push origin feature/nome-da-feature
```

## 📝 Padrões de Código

### TypeScript

- **NUNCA** use `any`
- Sempre tipar funções e variáveis
- Use interfaces para objetos
- Prefira `type` para unions e intersections

```typescript
// ✅ Correto
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  // implementação
};

// ❌ Incorreto
const getUser = async (id: any): Promise<any> => {
  // implementação
};
```

### Imports

- **SEMPRE** use imports com alias `@/`
- Evite imports relativos longos

```typescript
// ✅ Correto
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

// ❌ Incorreto
import { Button } from '../../../components/ui/Button';
```

### Cabeçalhos

- **TODOS** os arquivos devem ter cabeçalho JSDoc

```typescript
/**
 * @fileoverview UserProfile Component
 * @directory components/user/UserProfile
 * @description Componente para exibição e edição do perfil do usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Seu Nome
 */
```

### Componentes

- Máximo 300 linhas por arquivo
- Props interface obrigatória
- Memoização quando apropriado
- Tooltips em todos os inputs

```typescript
interface UserProfileProps {
  user: User;
  onSave: (user: User) => void;
  isLoading?: boolean;
}

export const UserProfile = memo<UserProfileProps>(
  ({ user, onSave, isLoading = false }) => {
    // implementação
  }
);
```

### Internacionalização

- **SEMPRE** use mensagens centralizadas
- Nunca hardcode strings

```typescript
// ✅ Correto
const { t } = useTranslation()
return <Typography>{t('user.profile.title')}</Typography>

// ❌ Incorreto
return <Typography>Perfil do Usuário</Typography>
```

## 🧪 Testes

### Tipos de Testes

- **Unitários**: Testam funções isoladas
- **Integração**: Testam interação entre componentes
- **E2E**: Testam fluxos completos

### Cobertura

- Mínimo 80% de cobertura
- Teste todos os caminhos críticos
- Teste casos de erro

### Exemplo de Teste

```typescript
describe('UserProfile', () => {
  it('should render user information correctly', () => {
    const user = mockUser()
    render(<UserProfile user={user} onSave={jest.fn()} />)

    expect(screen.getByText(user.name)).toBeInTheDocument()
    expect(screen.getByText(user.email)).toBeInTheDocument()
  })

  it('should call onSave when form is submitted', async () => {
    const onSave = jest.fn()
    const user = mockUser()

    render(<UserProfile user={user} onSave={onSave} />)

    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(user)
    })
  })
})
```

## 📝 Commits

### Padrão Semântico

```bash
# Estrutura
<tipo>(<escopo>): <descrição>

# Exemplos
feat: adiciona autenticação com Google
fix(auth): corrige validação de e-mail
docs: atualiza documentação da API
refactor: refatora componente UserCard
test: adiciona testes para UserService
style: corrige formatação do código
perf: otimiza performance do componente
ci: atualiza configuração do GitHub Actions
```

### Tipos

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Tarefas de manutenção
- `perf`: Melhorias de performance
- `ci`: Integração contínua

## 🔀 Pull Requests

### Checklist

- [ ] Código segue padrões estabelecidos
- [ ] Testes passam
- [ ] Cobertura mínima de 80%
- [ ] Documentação atualizada
- [ ] Commits semânticos
- [ ] Descrição clara do PR
- [ ] Screenshots (se aplicável)

### Template

```markdown
## Descrição

Breve descrição das mudanças

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Testes

- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes E2E

## Screenshots

Adicione screenshots se aplicável

## Checklist

- [ ] Código segue padrões
- [ ] Testes passam
- [ ] Documentação atualizada
```

## 🐛 Reportando Bugs

### Template de Bug Report

```markdown
## Descrição do Bug

Descrição clara e concisa do bug

## Passos para Reproduzir

1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

## Comportamento Esperado

O que deveria acontecer

## Comportamento Atual

O que está acontecendo

## Screenshots

Se aplicável

## Ambiente

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão: [ex: 1.0.0]

## Informações Adicionais

Qualquer contexto adicional
```

## 💡 Solicitando Funcionalidades

### Template de Feature Request

```markdown
## Descrição

Descrição clara da funcionalidade desejada

## Problema

Qual problema esta funcionalidade resolveria

## Solução Proposta

Como você gostaria que funcionasse

## Alternativas Consideradas

Outras soluções que você considerou

## Contexto Adicional

Qualquer contexto adicional
```

## 🤝 Código de Conduta

### Nossos Padrões

- Seja respeitoso e inclusivo
- Use linguagem apropriada
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade

### Nossas Responsabilidades

- Manter ambiente acolhedor
- Resolver conflitos de forma justa
- Remover conteúdo inadequado

### Aplicação

- Violações serão investigadas
- Ações apropriadas serão tomadas
- Confidencialidade será mantida

## 📞 Contato

- **Issues**: [GitHub Issues](https://github.com/original/dom-v1/issues)
- **Discussions**: [GitHub Discussions](https://github.com/original/dom-v1/discussions)
- **Email**: contato@dom-v1.com

## 🙏 Agradecimentos

Obrigado por contribuir para o DOM v1! Suas contribuições ajudam a tornar este projeto melhor para todos.

---

**Nota**: Este guia está em constante evolução. Sugestões de melhorias são bem-vindas!
