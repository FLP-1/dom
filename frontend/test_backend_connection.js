/**
 * @fileoverview Teste de conexão com backend
 * @description Script para verificar se o backend está funcionando corretamente
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

const BACKEND_URL = 'http://localhost:8000'

async function testBackendConnection() {
  console.log('🔍 Testando conexão com o backend...')
  
  try {
    // Teste 1: Health check
    console.log('\n1. Testando health check...')
    const healthResponse = await fetch(`${BACKEND_URL}/health`)
    console.log('Status:', healthResponse.status)
    console.log('OK:', healthResponse.ok)
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json()
      console.log('Health data:', healthData)
    }
    
    // Teste 2: Login direto no backend
    console.log('\n2. Testando login direto no backend...')
    const loginResponse = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpf: '30361792751',
        password: '123456'
      })
    })
    
    console.log('Login Status:', loginResponse.status)
    console.log('Login OK:', loginResponse.ok)
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('Login data:', JSON.stringify(loginData, null, 2))
    } else {
      const errorData = await loginResponse.text()
      console.log('Login error:', errorData)
    }
    
    // Teste 3: Login via API Next.js
    console.log('\n3. Testando login via API Next.js...')
    const nextLoginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cpf: '303.617.927-51',
        password: '123456'
      })
    })
    
    console.log('Next.js Login Status:', nextLoginResponse.status)
    console.log('Next.js Login OK:', nextLoginResponse.ok)
    
    if (nextLoginResponse.ok) {
      const nextLoginData = await nextLoginResponse.json()
      console.log('Next.js Login data:', JSON.stringify(nextLoginData, null, 2))
    } else {
      const errorData = await nextLoginResponse.text()
      console.log('Next.js Login error:', errorData)
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar conexão:', error.message)
  }
}

// Executar teste
testBackendConnection() 