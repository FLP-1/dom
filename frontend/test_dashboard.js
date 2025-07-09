/**
 * @fileoverview Teste do Dashboard
 * @description Script para testar o carregamento do dashboard
 */

// Simular dados de usuário válidos
const mockUserData = {
  id: 1,
  name: "João Silva",
  nickname: "João",
  cpf: "12345678901",
  profile: "empregador",
  email: "joao@example.com",
  celular: "11987654321",
  user_photo: null,
  access_token: "mock_token_123"
}

// Testar carregamento do dashboard
function testDashboard() {
  console.log('🧪 Testando carregamento do dashboard...')
  
  // Limpar dados anteriores
  localStorage.clear()
  
  // Simular login bem-sucedido
  console.log('💾 Salvando dados de teste...')
  localStorage.setItem('userToken', mockUserData.access_token)
  localStorage.setItem('userData', JSON.stringify(mockUserData))
  
  console.log('🔍 Verificando dados salvos:')
  console.log('Token:', localStorage.getItem('userToken'))
  console.log('User Data:', localStorage.getItem('userData'))
  
  // Verificar se os dados estão corretos
  const savedUserData = JSON.parse(localStorage.getItem('userData'))
  console.log('✅ Dados salvos corretamente:', savedUserData)
  
  // Testar redirecionamento para dashboard
  console.log('🔄 Redirecionando para dashboard...')
  window.location.href = '/dashboard?profile=empregador'
}

// Executar teste
testDashboard() 