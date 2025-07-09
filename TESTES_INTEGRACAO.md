# 🧪 TESTES DE INTEGRAÇÃO - DOM v1

## 🎯 **Visão Geral**

Os testes de integração conectam **realmente** com o backend e banco de dados, testando o fluxo completo de autenticação sem mocks artificiais.

## 🚀 **Como Executar**

### 1. **Preparar o Ambiente**

```bash
# 1. Iniciar o backend
cd dom-v1
python main.py

# 2. Em outro terminal, executar testes de integração
cd frontend
npm run test:integration
```

### 2. **Executar Testes Específicos**

```bash
# Todos os testes de integração
npm run test:integration

# Apenas testes unitários (sem backend)
npm run test:unit

# Testes com watch mode
npm run test:watch
```

## 📋 **Testes Implementados**

### ✅ **Login Real**
- Login com usuário empregador real do banco
- Rejeição de credenciais inválidas
- Validação de dados retornados

### ✅ **Validação de Token JWT Real**
- Token gerado pelo backend real
- Validação de formato JWT (3 partes)
- Verificação de expiração

### ✅ **Refresh de Token Real**
- Renovação automática de token
- Verificação de token diferente
- Persistência no localStorage

### ✅ **Logout Real**
- Limpeza completa de dados
- Remoção do localStorage
- Redirecionamento

### ✅ **Permissões Reais**
- Verificação baseada no perfil real
- Teste de rotas específicas
- Validação de acesso negado

### ✅ **Headers de Autorização Reais**
- Geração de headers com token real
- Formato correto Bearer token
- Consistência entre estado e headers

## 🔧 **Configuração**

### **Variáveis de Ambiente**

```env
# .env.local
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### **Usuários de Teste**

Os testes usam usuários reais do banco:

```javascript
const TEST_USERS = {
  empregador: {
    cpf: '303.617.927-51',
    password: '123456',
    profile: 'empregador'
  },
  empregado: {
    cpf: '123.456.789-01', 
    password: '123456',
    profile: 'empregado'
  }
}
```

## ⚠️ **Comportamento quando Backend não está Disponível**

Se o backend não estiver rodando:
- ✅ Testes não falham
- ⚠️ Aviso é exibido
- 📝 Sugestão para iniciar o backend

## 🎯 **Vantagens dos Testes de Integração**

### ✅ **Realismo**
- Testa com dados reais do banco
- Valida tokens JWT reais
- Verifica fluxo completo

### ✅ **Confiabilidade**
- Não depende de mocks complexos
- Detecta problemas de integração
- Valida comportamento real

### ✅ **Manutenibilidade**
- Testes mais simples de entender
- Menos frágeis a mudanças
- Documentação viva do sistema

## 🔍 **Debugging**

### **Verificar Backend**

```bash
# Testar se o backend está respondendo
curl http://localhost:8000/health

# Testar login diretamente
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"cpf":"303.617.927-51","password":"123456"}'
```

### **Logs dos Testes**

```bash
# Executar com logs detalhados
npm run test:integration -- --verbose

# Executar teste específico
npm run test:integration -- --testNamePattern="Login Real"
```

## 📊 **Cobertura**

### **Cenários Testados**
- ✅ Login bem-sucedido
- ✅ Login com credenciais inválidas
- ✅ Validação de token JWT
- ✅ Refresh automático
- ✅ Logout completo
- ✅ Verificação de permissões
- ✅ Headers de autorização

### **Cenários Pendentes**
- 🔄 Múltiplos usuários simultâneos
- 🔄 Expiração de token
- 🔄 Rate limiting
- 🔄 Erros de rede
- 🔄 Timeout de requisições

## 🚀 **Próximos Passos**

1. **Adicionar mais cenários de teste**
2. **Implementar testes de performance**
3. **Criar ambiente de teste isolado**
4. **Adicionar testes de stress**
5. **Implementar testes de segurança**

---

**Status**: ✅ **Implementado e Funcional**  
**Última Atualização**: 2024-12-19 