# 🛡️ Garantia de Respeito às Regras - DOM v1

## 📋 Visão Geral

Este documento descreve o sistema completo implementado para **garantir** que **todos** os desenvolvedores (humanos e IAs) sempre respeitem as diretrizes estabelecidas no projeto DOM v1.

## 🚨 Problema Identificado

Como observado, mesmo com regras bem definidas, **IAs e desenvolvedores humanos** podem:
- ❌ Ignorar mensagens centralizadas
- ❌ Usar `any` no JavaScript
- ❌ Fazer imports relativos longos
- ❌ Hardcodar strings
- ❌ Esquecer JSDoc
- ❌ Não considerar perfis de usuário

## ✅ Solução Implementada

### 1. **Script de Validação Automática** (`scripts/validate-rules.js`)

#### Funcionalidades:
- 🔍 **Validação de JSDoc** em todos os arquivos
- 🚫 **Detecção de `any`** proibido
- 📁 **Verificação de imports** com `@/`
- 🏷️ **Detecção de strings hardcoded**
- 📝 **Validação de estrutura** de mensagens
- 🪝 **Verificação de hooks** obrigatórios

#### Como usar:
```bash
# Validação básica
npm run validate

# Validação rigorosa
npm run validate:strict

# Verificação completa de qualidade
npm run quality-check
```

### 2. **Hook de Pre-commit** (`.husky/pre-commit`)

#### Funcionalidades:
- 🚫 **Bloqueia commits** se regras não forem respeitadas
- 🔄 **Executa validação** automaticamente
- 🧹 **Aplica linting** e formatação
- ✅ **Verifica JavaScript** e JSDoc

#### Resultado:
```
❌ Validação falhou! Commit bloqueado.
💡 Corrija os erros antes de fazer commit.
```

### 3. **ESLint Rigoroso** (`.eslintrc.js`)

#### Regras Implementadas:
```javascript
// ❌ PROIBIDO: Uso de 'any'
'no-restricted-syntax': [
  'error',
  {
    selector: 'Identifier[name="any"]',
    message: 'NUNCA use "any" - sempre defina tipos específicos'
  }
],

// ❌ PROIBIDO: Imports relativos longos
'no-restricted-imports': [
  'error',
  {
    patterns: [
      {
        group: ['../../../*', '../../*'],
        message: 'Use imports com "@/" em vez de caminhos relativos longos'
      }
    ]
  }
],

// ❌ PROIBIDO: Strings hardcoded específicas
'no-restricted-syntax': [
  'error',
  {
    selector: 'Literal[value=/^(DOM v1|Dashboard|Tarefas|Empregados|Pagamentos|Documentos|Configurações|Salvar|Cancelar|Editar|Excluir)$/]',
    message: 'Use mensagens centralizadas em vez de strings hardcoded'
  }
],

// ✅ OBRIGATÓRIO: JSDoc em funções públicas
'jsdoc/require-jsdoc': [
  'error',
  {
    publicOnly: true,
    require: {
      FunctionDeclaration: true,
      MethodDefinition: true,
      ClassDeclaration: true,
    },
  },
],
```

### 4. **Configurações do VS Code** (`.vscode/settings.json`)

#### Funcionalidades:
- 🔄 **Format automático** ao salvar
- 🧹 **Linting automático** ao salvar
- 📝 **Organização automática** de imports
- 🚫 **Regras específicas** do DOM v1
- 🎨 **Configurações de editor** otimizadas

### 5. **Snippets Automáticos** (`.vscode/dom-v1.code-snippets`)

#### Snippets Disponíveis:
- `dom-component` - Componente React com regras
- `dom-hook` - Hook personalizado com regras
- `dom-message` - Mensagem centralizada
- `dom-import` - Import com alias `@/`
- `dom-interface` - Definição de dados JavaScript
- `dom-function` - Função com JSDoc
- `dom-tooltip` - Componente com tooltip
- `dom-permission` - Validação de permissões
- `dom-theme` - Tema por perfil
- `dom-test` - Teste de componente

## 🎯 Como Usar o Sistema

### Para Desenvolvedores Humanos:

1. **Instalar extensões obrigatórias:**
   ```bash
   # VS Code Extensions
   - ESLint
   - Prettier
   - JavaScript (ES6) code snippets
   - Material Icon Theme
   ```

2. **Usar snippets automáticos:**
   ```typescript
   // Digite "dom-component" e pressione Tab
   // Será gerado um componente com todas as regras
   ```

3. **Executar validação antes de commits:**
   ```bash
   npm run validate
   ```

### Para IAs (Prompts):

1. **Sempre incluir no prompt:**
   ```
   IMPORTANTE: Este projeto segue regras rigorosas:
   - SEMPRE usar mensagens centralizadas (t('key'))
   - NUNCA usar 'any' no TypeScript
   - SEMPRE usar imports com '@/'
   - SEMPRE incluir JSDoc completo
   - SEMPRE considerar perfis de usuário
   - SEMPRE usar tooltips em inputs
   ```

2. **Usar templates forçados:**
   ```typescript
   // Template obrigatório para componentes
   /**
    * @fileoverview Nome do arquivo
    * @directory caminho/do/diretorio
    * @description Descrição detalhada
    * @created 2024-12-19
    * @lastModified 2024-12-19
    * @author Nome do Desenvolvedor
    */
   ```

## 📊 Relatório de Validação

O sistema gera relatórios detalhados:

```
================================================================================
📊 RELATÓRIO DE VALIDAÇÃO
================================================================================

📁 Arquivos verificados: 45

❌ ERROS ENCONTRADOS (3):
  • components/Button.tsx: Cabeçalho JSDoc obrigatório não encontrado
  • hooks/useData.ts: Uso de "any" detectado (2 ocorrências)
  • pages/dashboard.tsx: Imports relativos longos detectados

⚠️  AVISOS (2):
  • utils/helpers.ts: String hardcoded "Salvar" detectada
  • components/Form.tsx: console.log detectado

💥 Total de problemas: 5
```

## 🔧 Configuração de CI/CD

### GitHub Actions (`.github/workflows/quality-check.yml`):

```yaml
name: Quality Check
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run quality-check
      - run: npm run validate:strict
```

## 🎯 Benefícios do Sistema

### ✅ **Para Desenvolvedores:**
- 🚀 **Desenvolvimento mais rápido** com snippets
- 🛡️ **Prevenção de erros** automática
- 📚 **Documentação automática** com JSDoc
- 🎨 **Consistência visual** garantida

### ✅ **Para IAs:**
- 📋 **Templates obrigatórios** forçados
- 🔍 **Validação automática** de regras
- 📝 **Estrutura consistente** garantida
- 🎯 **Foco no código** em vez de formatação

### ✅ **Para o Projeto:**
- 🏗️ **Arquitetura consistente**
- 🌍 **Internacionalização garantida**
- 🎨 **UI/UX adaptativa** por perfil
- 📈 **Qualidade de código** elevada

## 🚀 Próximos Passos

1. **Implementar validação de perfis:**
   - Verificar se componentes consideram todos os 7 perfis
   - Validar temas específicos por perfil

2. **Adicionar validação de acessibilidade:**
   - Verificar ARIA labels
   - Validar navegação por teclado

3. **Criar dashboard de qualidade:**
   - Métricas de conformidade
   - Relatórios de tendências

## 📞 Suporte

Se encontrar problemas com o sistema de validação:

1. **Verificar logs:** `npm run validate --verbose`
2. **Consultar documentação:** `docs/DIRETRIZES_DESENVOLVIMENTO.md`
3. **Abrir issue:** Descrever problema específico
4. **Contatar equipe:** Para dúvidas sobre regras

---

**🎉 Com este sistema, garantimos que TODAS as regras sejam sempre respeitadas!**
