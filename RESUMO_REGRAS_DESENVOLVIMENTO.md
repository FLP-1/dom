# 📋 RESUMO DAS REGRAS DE DESENVOLVIMENTO - DOM v1

**Arquivo:** `RESUMO_REGRAS_DESENVOLVIMENTO.md`  
**Diretório:** `/`  
**Descrição:** Resumo completo das regras e diretrizes de desenvolvimento  
**Data de Criação:** 2024-12-19  
**Última Alteração:** 2024-12-19  

---

## 🎯 **VISÃO GERAL DO PROJETO**

O **DOM v1** é um aplicativo multiplataforma (web, iOS, Android) desenvolvido com:
- **Monorepo** usando Turbo
- **React/Next.js** para web
- **React Native** para mobile
- **MUI v5** (Material-UI moderno)
- **Prisma + PostgreSQL**
- **Internacionalização completa**
- **JavaScript puro** (TypeScript PROIBIDO)

---

## 🚫 **REGRA ABSOLUTA: PROIBIÇÃO TOTAL DE TYPESCRIPT**

### ❌ **NUNCA PERMITIDO:**
- Arquivos `.ts` ou `.tsx`
- Interfaces TypeScript (`interface`, `type`)
- Tipagens explícitas (`: string`, `: number`)
- Generics (`<T>`, `Array<T>`)
- Enums TypeScript (`enum`)
- Namespaces (`namespace`)
- Decorators TypeScript (`@Component`)
- Imports de tipos (`import type`)

### ✅ **OBRIGATÓRIO:**
- **JavaScript puro** (.js, .jsx)
- **JSDoc** para documentação
- **PropTypes** para validação (quando necessário)
- **Comentários descritivos** para estruturas de dados

---

## 👥 **PERFIS DE USUÁRIOS (7 PERFIS DISTINTOS)**

### 1. **Empregadores** (Mulheres 35-50 anos)
- **UI/UX**: Eficiência máxima, menos cliques, interface limpa
- **Tema**: Verde profissional (#2E7D32)
- **Prioridades**: Dashboard rápido, notificações inteligentes

### 2. **Empregados Domésticos** (Mulheres 30-60 anos)
- **UI/UX**: Simplicidade extrema, textos grandes, botões grandes
- **Tema**: Laranja acolhedor (#FF6B35)
- **Prioridades**: Interface simples, tutorial interativo, modo offline

### 3. **Familiares dos Empregadores** (15-70 anos)
- **UI/UX**: Adaptável por idade, compartilhamento fácil
- **Tema**: Roxo familiar (#9C27B0)
- **Prioridades**: Modo básico/avançado, notificações familiares

### 4. **Parceiros** (Donos de negócios)
- **UI/UX**: Interface empresarial, métricas em destaque
- **Tema**: Azul empresarial (#1565C0)
- **Prioridades**: Dashboard de métricas, white label, APIs

### 5. **Subordinados dos Parceiros** (Funcionários)
- **UI/UX**: Eficiência operacional, clareza de responsabilidades
- **Tema**: Verde operacional (#388E3C)
- **Prioridades**: Interface operacional, relatórios automáticos

### 6. **Administradores** (Desenvolvedores/suporte)
- **UI/UX**: Máxima informação, acesso rápido, dados técnicos
- **Tema**: Vermelho admin (#D32F2F)
- **Prioridades**: Painel administrativo, logs detalhados

### 7. **Donos** (Fundadores)
- **UI/UX**: Visão estratégica, acesso completo, interface premium
- **Tema**: Preto executivo (#000000)
- **Prioridades**: Dashboard executivo, acesso ao código/banco

---

## 📋 **REGRAS OBRIGATÓRIAS**

### 1. **Cabeçalho JSDoc em Todos os Arquivos**
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

### 2. **Imports com Alias @/**
```javascript
// ✅ Correto
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

// ❌ Incorreto
import { Button } from '../../../components/ui/Button'
```

### 3. **Proibição de "any"**
```javascript
// ❌ NUNCA fazer isso
const data: any = response.data

// ✅ Sempre fazer isso
const data = response.data // JavaScript puro
```

### 4. **Consideração de Perfis Obrigatória**
```javascript
// ✅ Correto - Componente adaptativo
const UserProfile = ({ profile, user }) => {
  const theme = getThemeByProfile(profile)
  const isSimpleInterface = profile === 'empregado' || profile === 'familiar'
  
  return (
    <ThemeProvider theme={theme}>
      <Box className={`user-profile ${isSimpleInterface ? 'simple' : 'advanced'}`}>
        {/* Interface adaptada ao perfil */}
      </Box>
    </ThemeProvider>
  )
}
```

### 5. **Tooltips Obrigatórios**
```javascript
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

### 6. **Componentes Reutilizáveis**
- **Máximo 300 linhas** por arquivo
- **Props interface** obrigatória
- **Default props** quando apropriado
- **Memoização** para performance
- **Adaptação por perfil** obrigatória

### 7. **Mensagens Centralizadas (next-i18next OBRIGATÓRIO)**
```javascript
// ✅ Correto - next-i18next com perfil
import { useTranslation } from 'next-i18next'

const { t } = useTranslation('common')
const { profile } = useUserProfile()

const message = t(`${profile}.user.profile`) || t('user.profile')
return <Typography>{message}</Typography>

// ❌ Incorreto - react-i18next
import { useTranslation } from 'react-i18next'

// ❌ Incorreto - strings hardcoded
return <Typography>Perfil do Usuário</Typography>
```

---

## 🎨 **PADRÕES DE UI/UX**

### MUI v5 (Material-UI moderno)
- Usar componentes MUI v5 como base
- Preferir ícones e cards sobre botões simples
- Tema centralizado e consistente

### Acessibilidade
- **ARIA labels** obrigatórios
- **Navegação por teclado**
- **Contraste adequado**
- **Screen reader friendly**

---

## 🏗️ **ESTRUTURA DE ARQUIVOS**

### Nomenclatura
- **kebab-case**: arquivos e diretórios (`user-profile.js`)
- **PascalCase**: componentes React (`UserProfile.jsx`)
- **camelCase**: variáveis e funções (`getUserData()`)
- **snake_case**: banco de dados (`user_profiles`)

### Organização
```
components/
├── ComponentName/
│   ├── ComponentName.jsx
│   ├── ComponentName.test.jsx
│   └── index.js
```

---

## 🧪 **TESTES**

### Obrigatórios
- **Testes unitários** para todos os componentes
- **Testes de integração** para serviços
- **Coverage mínimo** de 80%

### Padrão de Teste
```javascript
describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})
```

---

## 🔒 **SEGURANÇA**

### Validação
- **Sempre validar** inputs do usuário
- **Sanitizar dados** antes de salvar
- **Verificar permissões** antes de operações

### Dados Sensíveis
- **Nunca expor** dados sensíveis no frontend
- **Usar variáveis de ambiente** para configurações
- **Criptografar dados** sensíveis

---

## 📱 **MULTIPLATAFORMA**

### Compartilhamento de Código
- Usar pacotes compartilhados (`packages/`)
- Lógica de negócio reutilizável
- Tipos compartilhados (JavaScript)

### Específico por Plataforma
- Componentes específicos quando necessário
- Adaptações de UI para cada plataforma
- APIs nativas quando apropriado

---

## 🚀 **PERFORMANCE**

### Otimizações
- **Lazy loading** de componentes pesados
- **Memoização** com React.memo, useMemo, useCallback
- **Bundle splitting** por rotas
- **Otimização de imagens**

### Monitoramento
- **Métricas de performance**
- **Error tracking**
- **Analytics de uso**

---

## 🌍 **INTERNACIONALIZAÇÃO**

### ⚠️ **OBRIGATÓRIO: Usar next-i18next (NÃO react-i18next)**

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

## 📚 **DOCUMENTAÇÃO**

### JSDoc Obrigatório
```javascript
/**
 * Calcula o total de vendas
 * @param {Date} startDate - Data de início
 * @param {Date} endDate - Data de fim
 * @returns {Promise<number>} Promise com o total
 * @throws {Error} Se as datas forem inválidas
 */
export const calculateSalesTotal = async (startDate, endDate) => {
  // implementação
}
```

---

## 🔄 **COMMITS**

### Padrão Semântico
```bash
feat: adiciona autenticação com Google
fix: corrige validação de e-mail
docs: atualiza documentação da API
refactor: refatora componente UserCard
test: adiciona testes para UserService
```

---

## ⚠️ **PROIBIÇÕES**

### NUNCA fazer:
- ❌ Usar `any` no JavaScript
- ❌ Hardcodar strings no código
- ❌ Duplicar código
- ❌ Criar arquivos maiores que 300 linhas
- ❌ Esquecer tooltips nos inputs
- ❌ Ignorar testes
- ❌ Usar imports relativos longos
- ❌ Esquecer cabeçalhos nos arquivos
- ❌ **Ignorar o perfil do usuário**
- ❌ **Criar interfaces genéricas sem adaptação**
- ❌ **Usar temas padrão para todos os perfis**
- ❌ **Implementar funcionalidades sem validar permissões**
- ❌ **Usar TypeScript** (qualquer forma)
- ❌ **Usar react-i18next em projetos Next.js**
- ❌ **Configurar i18next manualmente**

---

## ✅ **CHECKLIST DE QUALIDADE**

Antes de finalizar qualquer código:
- [ ] Cabeçalho incluído
- [ ] Imports com "@/"
- [ ] Sem uso de `any`
- [ ] Tooltips implementados
- [ ] Mensagens centralizadas
- [ ] **Perfil do usuário considerado**
- [ ] **Componente adaptativo implementado**
- [ ] **Tema específico aplicado**
- [ ] **Permissões validadas**
- [ ] Testes escritos
- [ ] ESLint sem erros
- [ ] JavaScript sem erros
- [ ] Documentação atualizada

---

## 🎯 **PRIORIDADES**

1. **Qualidade do código** acima de velocidade
2. **Reutilização** acima de duplicação
3. **Acessibilidade** para todos os usuários
4. **Performance** em todas as plataformas
5. **Segurança** em todas as operações
6. **Testes** para todas as funcionalidades
7. **Documentação** para manutenibilidade
8. **Adaptação por perfil** em todas as funcionalidades

---

## 🛡️ **SISTEMA DE GARANTIA**

### Validação Automática
- **Script de validação** (`scripts/validate-rules.js`)
- **Hook de pre-commit** (`.husky/pre-commit`)
- **ESLint rigoroso** (`.eslintrc.js`)
- **Configurações VS Code** (`.vscode/settings.json`)
- **Snippets automáticos** (`.vscode/dom-v1.code-snippets`)

### Relatórios de Qualidade
```
📊 RELATÓRIO DE VALIDAÇÃO
📁 Arquivos verificados: 45
❌ ERROS ENCONTRADOS: 3
⚠️  AVISOS: 2
💥 Total de problemas: 5
```

---

## 📖 **DOCUMENTOS RELACIONADOS**

- [Diretrizes de Desenvolvimento](./docs/DIRETRIZES_DESENVOLVIMENTO.md)
- [Estrutura do Projeto](./docs/ESTRUTURA_PROJETO.md)
- [Perfis de Usuários](./docs/PERFIS_USUARIOS.md)
- [Regras JavaScript](./docs/REGRAS_JAVASCRIPT.md)
- [Garantia de Regras](./docs/GARANTIA_REGRAS.md)

---

**Nota**: Este resumo deve ser consultado antes de qualquer desenvolvimento no projeto DOM v1. As regras são obrigatórias para todos os desenvolvedores e IAs. 