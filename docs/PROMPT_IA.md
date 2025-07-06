# 🤖 Prompt Template para IAs - DOM v1

## 📋 Template Obrigatório

Use este prompt **SEMPRE** ao trabalhar no projeto DOM v1:

```
# CONTEXTO DO PROJETO DOM v1

Este é um aplicativo multiplataforma (web, iOS, Android) com regras RIGOROSAS que DEVEM ser seguidas.

## 🚨 REGRAS OBRIGATÓRIAS (NUNCA IGNORAR)

### 1. **Mensagens Centralizadas (OBRIGATÓRIO)**
- ❌ NUNCA usar strings hardcoded como "Salvar", "Cancelar", "Dashboard"
- ✅ SEMPRE usar: `t('common.actions.save')`, `t('navigation.dashboard')`
- ✅ SEMPRE considerar o perfil do usuário: `t('empregador.dashboard.title')`

### 2. **JavaScript Puro (OBRIGATÓRIO)**
- ❌ NUNCA usar arquivos .ts/.tsx
- ❌ NUNCA usar tipagens explícitas, interfaces, enums, generics
- ✅ SEMPRE usar JavaScript puro (.js/.jsx)
- ✅ SEMPRE documentar props e funções com JSDoc

### 3. **Imports com Alias (OBRIGATÓRIO)**
- ❌ NUNCA usar: `import { Button } from '../../../components/Button'`
- ✅ SEMPRE usar: `import { Button } from '@/components/Button'`

### 4. **JSDoc Completo (OBRIGATÓRIO)**
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

### 5. **Perfis de Usuário (OBRIGATÓRIO)**
SEMPRE considerar os 7 perfis:
- empregador, empregado, familiar, parceiro, subordinado, admin, owner
- Interface ADAPTATIVA por perfil
- Temas PERSONALIZADOS por perfil
- Mensagens ESPECÍFICAS por perfil

### 6. **Tooltips (OBRIGATÓRIO)**
- ✅ SEMPRE usar tooltips em inputs e botões
- ✅ SEMPRE usar mensagens centralizadas nos tooltips

### 7. **Componentes Reutilizáveis (OBRIGATÓRIO)**
- ✅ Máximo 300 linhas por arquivo
- ✅ Props documentadas via JSDoc
- ✅ Memoização com React.memo
- ✅ Adaptação por perfil obrigatória

## 🎯 ESTRUTURA OBRIGATÓRIA

### Para Componentes React:
```javascript
/**
 * @fileoverview Nome do Componente
 * @directory apps/web/src/components
 * @description Descrição do componente
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Nome do Desenvolvedor
 */

import { memo } from 'react'
import { useMessages } from '@/hooks/useMessages'
import { useUserProfile } from '@/hooks/useUserProfile'

/**
 * @param {Object} props
 * @param {string} [props.profile]
 */
const ComponentName = memo(({ profile }) => {
  const { t } = useMessages({ profile })
  const { currentProfile } = useUserProfile()

  return (
    <div>
      {t('message.key')}
    </div>
  )
})

ComponentName.displayName = 'ComponentName'
export default ComponentName
```

### Para Hooks:
```javascript
/**
 * @fileoverview Nome do Hook
 * @directory apps/web/src/hooks
 * @description Descrição do hook
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author Nome do Desenvolvedor
 */

import { useState, useEffect, useCallback } from 'react'

/**
 * @param {Object} options
 * @param {string} [options.profile]
 */
export const useHookName = (options = {}) => {
  const { profile = 'empregador' } = options

  // implementação

  return {
    // dados
  }
}
```

## 🔍 VALIDAÇÃO AUTOMÁTICA

O projeto tem validação automática que:
- ❌ BLOQUEIA commits se regras não forem seguidas
- 🔍 DETECTA strings hardcoded automaticamente
- 🚫 PROÍBE uso de tipagens e arquivos TypeScript
- 📝 VERIFICA JSDoc obrigatório
- 🎯 VALIDA consideração de perfis

## 📝 EXEMPLOS CORRETOS

### ✅ Correto - Mensagem Centralizada:
```javascript
<Typography>{t('empregador.dashboard.title')}</Typography>
<Button>{t('common.actions.save')}</Button>
```

### ❌ Incorreto - String Hardcoded:
```javascript
<Typography>Painel do Empregador</Typography>
<Button>Salvar</Button>
```

### ✅ Correto - Import com Alias:
```javascript
import { Button } from '@/components/Button'
import { useMessages } from '@/hooks/useMessages'
```

### ❌ Incorreto - Import Relativo:
```javascript
import { Button } from '../../../components/Button'
import { useMessages } from '../../hooks/useMessages'
```

## 🎨 TEMAS POR PERFIL

SEMPRE implementar temas adaptativos:

```javascript
const createProfileTheme = (profile) => {
  switch (profile) {
    case 'empregador':
      return createTheme({
        palette: { primary: { main: '#1976d2' } },
        typography: { h4: { fontSize: '1.5rem' } }
      })
    case 'empregado':
      return createTheme({
        palette: { primary: { main: '#2e7d32' } },
        typography: { h4: { fontSize: '2rem', fontWeight: 700 } }
      })
    // outros perfis...
  }
}
```

## 🚀 COMANDOS DE VALIDAÇÃO

Antes de entregar código, execute:
```bash
npm run validate
npm run quality-check
```

## ⚠️ LEMBRETE FINAL

**NUNCA** ignore estas regras. O sistema de validação BLOQUEARÁ commits que não as respeitem.

**SEMPRE** considere os 7 perfis de usuário em qualquer implementação.

**SEMPRE** use mensagens centralizadas em vez de strings hardcoded.

**SEMPRE** use imports com "@/" em vez de caminhos relativos.

**SEMPRE** inclua JSDoc completo em todos os arquivos.

---

Agora implemente a funcionalidade solicitada seguindo TODAS estas regras rigorosamente.
```

## 📋 Como Usar

1. **Copie o template acima**
2. **Cole no início de cada prompt para IA**
3. **Adicione sua solicitação específica**
4. **Execute validação antes de aceitar código**

## 🎯 Exemplo de Uso

```
[COLE O TEMPLATE ACIMA AQUI]

Agora crie um componente de formulário de cadastro de empregado que:
- Use Material-UI
- Seja adaptativo por perfil
- Tenha validação
- Use mensagens centralizadas
- Siga todas as regras estabelecidas
```

## ✅ Resultado Esperado

A IA irá:
- ✅ Usar mensagens centralizadas
- ✅ Implementar temas por perfil
- ✅ Incluir JSDoc completo
- ✅ Usar imports com @/
- ✅ Seguir todas as regras
