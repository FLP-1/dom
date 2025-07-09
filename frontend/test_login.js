/**
 * @fileoverview Teste de Login
 * @description Script para testar o fluxo de login e identificar problemas
 */

// Simular dados de login
const testCredentials = {
  cpf: '12345678901',
  password: '123456',
  remember_me: false
}

// Testar o endpoint de login
async function testLogin() {
  console.log('🧪 Testando login...')
  
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCredentials)
    })
    
    console.log('📡 Status da resposta:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ Login bem-sucedido:', data)
      
      // Testar se os dados estão sendo salvos corretamente
      console.log('💾 Salvando dados no localStorage...')
      localStorage.setItem('userToken', data.access_token)
      localStorage.setItem('userData', JSON.stringify(data))
      
      console.log('🔍 Verificando dados salvos:')
      console.log('Token:', localStorage.getItem('userToken'))
      console.log('User Data:', localStorage.getItem('userData'))
      
      // Testar redirecionamento
      console.log('🔄 Testando redirecionamento...')
      window.location.href = '/dashboard?profile=' + (data.profile || 'empregador')
      
    } else {
      const errorData = await response.json()
      console.log('❌ Erro no login:', errorData)
    }
  } catch (error) {
    console.log('💥 Erro na requisição:', error)
  }
}

// Executar teste
testLogin() 