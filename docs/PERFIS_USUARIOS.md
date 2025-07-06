# Perfis de Usuários - Diretrizes de Desenvolvimento

## 🎯 Visão Geral

O DOM v1 atende 7 perfis distintos. Cada perfil tem necessidades, habilidades e expectativas específicas que devem nortear o desenvolvimento.

## 👥 Perfis e Diretrizes

### 1. Empregadores
**Características**: Mulheres 35-50 anos, ocupadas, boa experiência digital
**UI/UX**: Eficiência máxima, menos cliques, interface limpa
**Prioridades**: Dashboard rápido, notificações inteligentes, integração com agenda
**Tema**: Verde profissional (#2E7D32), texto compacto, animações sutis

### 2. Empregados Domésticos  
**Características**: Mulheres 30-60 anos, pouca escolaridade, experiência digital limitada
**UI/UX**: Simplicidade extrema, textos grandes, botões grandes
**Prioridades**: Interface simples, tutorial interativo, modo offline, WhatsApp
**Tema**: Laranja acolhedor (#FF6B35), texto 16px, espaçamento generoso

### 3. Familiares dos Empregadores
**Características**: 15-70 anos, experiência digital variada, uso esporádico
**UI/UX**: Adaptável por idade, compartilhamento fácil, permissões claras
**Prioridades**: Modo básico/avançado, notificações familiares, integração social
**Tema**: Roxo familiar (#9C27B0), adaptativo por idade

### 4. Parceiros
**Características**: Donos de negócios, experiência avançada, foco em ROI
**UI/UX**: Interface empresarial, métricas em destaque, personalização
**Prioridades**: Dashboard de métricas, white label, APIs, relatórios detalhados
**Tema**: Azul empresarial (#1565C0), cinza profissional (#424242)

### 5. Subordinados dos Parceiros
**Características**: Funcionários dos parceiros, experiência média, operação
**UI/UX**: Eficiência operacional, clareza de responsabilidades, auditoria
**Prioridades**: Interface operacional, relatórios automáticos, permissões específicas
**Tema**: Verde operacional (#388E3C), âmbar atenção (#FFA000)

### 6. Administradores do Aplicativo
**Características**: Desenvolvedores/suporte, experiência avançada, técnico
**UI/UX**: Máxima informação, acesso rápido, dados técnicos
**Prioridades**: Painel administrativo, logs detalhados, configurações avançadas
**Tema**: Vermelho admin (#D32F2F), fonte monospace, espaçamento denso

### 7. Donos do Aplicativo
**Características**: Fundadores, experiência expert, controle total
**UI/UX**: Visão estratégica, acesso completo, interface premium
**Prioridades**: Dashboard executivo, acesso ao código/banco, relatórios estratégicos
**Tema**: Preto executivo (#000000), dourado premium (#FFD700)

## 🎨 Padrões de Desenvolvimento

### Sistema de Temas Adaptativo
```javascript
const getThemeByProfile = (profile) => {
  const themes = {
    empregador: empregadorTheme,
    empregado: empregadoTheme,
    familiar: familiarTheme,
    parceiro: parceiroTheme,
    subordinado: subordinadoTheme,
    admin: adminTheme,
    owner: ownerTheme
  }
  return themes[profile] || defaultTheme
}
```

### Componentes Adaptativos
```javascript
/**
 * @param {Object} props
 * @param {string} props.profile
 * @param {React.ReactNode} props.children
 */
const AdaptiveComponent = ({ profile, children }) => {
  const theme = getThemeByProfile(profile)
  return (
    <ThemeProvider theme={theme}>
      <Box className={`adaptive-component ${profile}`}>
        {children}
      </Box>
    </ThemeProvider>
  )
}
```

### Detecção de Perfil
```javascript
import { useState, useEffect } from 'react'

const useUserProfile = (userData) => {
  const [profile, setProfile] = useState('empregador')
  const [permissions, setPermissions] = useState([])
  
  useEffect(() => {
    const detectedProfile = detectUserProfile(userData)
    setProfile(detectedProfile)
    setPermissions(loadUserPermissions(detectedProfile))
  }, [userData])
  
  return { profile, permissions }
}
```

## 📝 Diretrizes para Desenvolvedores

### Sempre Considerar:
- **Perfil do usuário** antes de implementar
- **Limitações** e habilidades específicas
- **Contexto de uso** (dispositivo, frequência)
- **Expectativas** de cada perfil

### Padrões Obrigatórios:
- **Componentes adaptativos** para cada perfil
- **Validação de permissões** antes de renderizar
- **Temas específicos** por perfil
- **Mensagens personalizadas** por perfil
- **Analytics específicos** por perfil

## 🤖 Diretrizes para IAs

### Antes de Sugerir Código:
1. **Identificar** o perfil do usuário
2. **Considerar** limitações técnicas
3. **Adaptar** sugestões ao perfil
4. **Priorizar** funcionalidades relevantes
5. **Sugerir** melhorias específicas

### Exemplos de Adaptação:
- **Empregadores**: Foco em eficiência e rapidez
- **Empregados**: Simplicidade e clareza
- **Familiares**: Adaptabilidade por idade
- **Parceiros**: Métricas e resultados
- **Admins**: Informação densa e acesso rápido
- **Owners**: Visão estratégica e controle total

## 🎯 Checklist de Implementação

### Para Cada Perfil:
- [ ] Tema específico implementado
- [ ] Navegação personalizada
- [ ] Permissões definidas
- [ ] Componentes adaptativos
- [ ] Mensagens específicas
- [ ] Analytics configurados
- [ ] Testes escritos
- [ ] Documentação atualizada

### Para Desenvolvedores:
- [ ] Sempre considerar o perfil
- [ ] Testar com diferentes perfis
- [ ] Validar permissões
- [ ] Usar componentes adaptativos
- [ ] Documentar decisões

### Para IAs:
- [ ] Identificar perfil antes de sugerir
- [ ] Adaptar sugestões ao perfil
- [ ] Considerar limitações
- [ ] Priorizar funcionalidades relevantes
- [ ] Sugerir melhorias específicas

## 📚 Recursos

- [Diretrizes de Desenvolvimento](./DIRETRIZES_DESENVOLVIMENTO.md)
- [Estrutura do Projeto](./ESTRUTURA_PROJETO.md)
- [Exemplos de Componentes](./EXEMPLOS_COMPONENTES.md)

---

**Nota**: Este documento deve ser revisado conforme o projeto evolui e novos insights são descobertos. 