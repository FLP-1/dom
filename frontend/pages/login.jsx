/**
 * @fileoverview Login Page
 * @directory pages
 * @description Tela de login com validação de CPF, carrossel motivacional e integração com backend
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from '@/utils/i18n'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  Alert,
  Grid,
  Paper,
  Chip
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import theme from '@/theme'
import { useAuth } from '@/hooks/useAuth'
import ContextSelectModal from '@/components/ContextSelectModal'
import { useUser } from '@/context/UserContext'

// Função simples de validação de CPF
const validateCPF = (cpf) => {
  const numbers = cpf.replace(/\D/g, '')
  if (numbers.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false
  
  // Validação do primeiro dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers[9])) return false
  
  // Validação do segundo dígito verificador
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(numbers[10])) return false
  
  return true
}

// Componentes estilizados
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
  padding: theme.spacing(2)
}))

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 450,
  width: '100%',
  borderRadius: 24,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  overflow: 'visible'
}))

const LogoContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(3)
}))

const Logo = styled('img')(({ theme }) => ({
  width: 80,
  height: 80,
  marginBottom: theme.spacing(2)
}))

const MotivationalCarousel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.success.main}10 100%)`,
  border: `1px solid ${theme.palette.primary.main}20`,
  borderRadius: 16,
  textAlign: 'center',
  // Altura fixa para evitar movimento da tela
  height: 120,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden'
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main
    }
  }
}))

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(1.5),
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  marginTop: theme.spacing(2)
}))

const FooterLinks = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  textAlign: 'center',
  '& a': {
    color: theme.palette.secondary.main, // Mudou para azul
    textDecoration: 'none',
    margin: `0 ${theme.spacing(1)}`,
    '&:hover': {
      textDecoration: 'underline'
    }
  }
}))

// Frases motivacionais serão carregadas das traduções
const getMotivationalPhrases = (t) => {
  try {
    const phrases = t('login.motivational', { returnObjects: true })
    if (Array.isArray(phrases)) {
      return phrases.map((text, index) => ({
        text,
        author: `DOM ${index + 1}`
      }))
    }
  } catch (error) {
    console.warn('Erro ao carregar frases motivacionais:', error)
  }
  
  // Fallback para frases padrão
  return [
    {
      text: "Dom é poder, DOM é conexão! 💪",
      author: "Sistema DOM"
    },
    {
      text: "Seu dom natural é cuidar, nosso DOM é facilitar! 🏠",
      author: "DOM Team"
    },
    {
      text: "Dom de liderança + DOM de tecnologia = Sucesso! 🚀",
      author: "DOM Platform"
    },
    {
      text: "Transforme seu dom em resultados com DOM! ✨",
      author: "DOM Solutions"
    }
  ]
}

const LoginPage = () => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const [formData, setFormData] = useState({
    cpf: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const { login, isLoading: authLoading, error: authError } = useAuth()
  const { setUser, setActiveContext } = useUser()
  const [showContextModal, setShowContextModal] = useState(false)
  const [contextOptions, setContextOptions] = useState([])
  const [pendingUserData, setPendingUserData] = useState(null)

  // Carrossel de frases motivacionais
  const motivationalPhrases = getMotivationalPhrases(t)
  
  useEffect(() => {
    if (motivationalPhrases.length > 0) {
      const interval = setInterval(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % motivationalPhrases.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [motivationalPhrases.length])

  // Limpa localStorage ao acessar a tela de login
  useEffect(() => {
    localStorage.removeItem('userToken')
    localStorage.removeItem('userData')
    localStorage.removeItem('activeContext')
    sessionStorage.removeItem('contextModalShown')
  }, [])

  // Máscara de CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleCPFChange = (event) => {
    const value = event.target.value
    const formattedValue = formatCPF(value)
    setFormData(prev => ({ ...prev, cpf: formattedValue }))
    
    // Validação em tempo real
    if (formattedValue.length === 14) {
      const isValid = validateCPF(formattedValue)
      setErrors(prev => ({
        ...prev,
        cpf: isValid ? undefined : 'CPF inválido'
      }))
    } else {
      setErrors(prev => ({ ...prev, cpf: undefined }))
    }
  }

  const handlePasswordChange = (event) => {
    setFormData(prev => ({ ...prev, password: event.target.value }))
    setErrors(prev => ({ ...prev, password: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    console.log('🔍 Login Debug: Botão Entrar clicado!')
    console.log('🔍 Login Debug: Dados do formulário:', formData)
    setIsLoading(true)
    setErrors({})

    // Validações
    if (!formData.cpf || formData.cpf.length < 14) {
      setErrors(prev => ({ ...prev, cpf: t('login.cpf_required', 'CPF é obrigatório') }))
      setIsLoading(false)
      return
    }

    if (!validateCPF(formData.cpf)) {
      setErrors(prev => ({ ...prev, cpf: t('login.cpf_invalid', 'CPF inválido') }))
      setIsLoading(false)
      return
    }
    
    if (!formData.password || formData.password.length < 6) {
      setErrors(prev => ({ ...prev, password: t('login.password_min_length', 'Senha deve ter pelo menos 6 caracteres') }))
      setIsLoading(false)
      return
    }

    try {
      console.log('🔍 Login Debug: Chamando hook de autenticação...')
      // Usar o hook de autenticação
      const data = await login({
        cpf: formData.cpf.replace(/\D/g, ''),
        password: formData.password,
        remember_me: rememberMe
      })

      console.log('🔍 Login Debug: Resposta do login:', data)
      
      // O hook useAuth já retorna os dados do usuário diretamente
      // Não precisa verificar data.success pois o hook já faz isso
      localStorage.setItem('userToken', data.access_token)
      // Salvar também em cookie para o middleware
      document.cookie = `userToken=${data.access_token}; path=/; SameSite=Lax`
      // Se o usuário tem múltiplos contextos/perfis, exibe o modal
      if (Array.isArray(data.contexts) && data.contexts.length > 1) {
        setPendingUserData(data)
        setContextOptions(data.contexts)
        setShowContextModal(true)
        return
      }
      // Se só tem um contexto, salva direto e redireciona
      setUser(data)
      setActiveContext(data.contexts ? data.contexts[0] : null)
      if (data.contexts && data.contexts[0]) {
        localStorage.setItem('activeContext', JSON.stringify(data.contexts[0]))
      }
      router.push(`/dashboard?profile=${(data.contexts && data.contexts[0]?.profile) || data.profile || 'empregador'}`)
    } catch (error) {
      console.error('❌ Login Debug: Erro no login:', error)
      setErrors(prev => ({ ...prev, general: error.message }))
    } finally {
      setIsLoading(false)
    }
  }

  // Handler para quando o usuário seleciona um contexto/perfil no modal
  const handleSelectContext = (context) => {
    if (pendingUserData) {
      setUser(pendingUserData)
      setActiveContext(context)
      localStorage.setItem('activeContext', JSON.stringify(context))
      setShowContextModal(false)
      setPendingUserData(null)
      router.push(`/dashboard?profile=${context.profile}`)
    }
  }

  return (
    <LoginContainer>
      {/* Modal de seleção de contexto/perfil */}
      <ContextSelectModal open={showContextModal} options={contextOptions} onSelect={handleSelectContext} />
      <LoginCard>
        <CardContent sx={{ padding: 4 }}>
          <LogoContainer>
            <Logo
              src="/Logo_CasaMaoCoracao.png"
              alt="DOM - Logo"
              aria-label="Logo DOM"
            />
            <Typography variant="h4" component="h1" gutterBottom>
              {t('login.welcome_title', 'Bem-vindo ao DOM')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('login.subtitle', 'Faça login para acessar sua conta')}
            </Typography>
          </LogoContainer>

          {/* Carrossel de frases motivacionais com altura fixa */}
          <MotivationalCarousel>
            <Typography variant="h6" gutterBottom>
              💡 {motivationalPhrases[currentPhraseIndex].text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              — {motivationalPhrases[currentPhraseIndex].author}
            </Typography>
          </MotivationalCarousel>

          {/* Formulário de login */}
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            autoComplete="new-password"
          >
            {(errors.general || authError) && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.general || authError}
              </Alert>
            )}

            <StyledTextField
              fullWidth
              label={t('login.cpf', 'CPF')}
              value={formData.cpf}
              onChange={handleCPFChange}
              error={!!errors.cpf}
              helperText={errors.cpf}
              placeholder="000.000.000-00"
              autoComplete="off"
              inputProps={{
                autoComplete: "off",
                "data-lpignore": "true",
                "data-form-type": "other"
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                )
              }}
              aria-describedby="cpf-helper-text"
            />

            <StyledTextField
              fullWidth
              label={t('login.password', 'Senha')}
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handlePasswordChange}
              error={!!errors.password}
              helperText={errors.password}
              autoComplete="new-password"
              inputProps={{
                autoComplete: "new-password",
                "data-lpignore": "true"
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              aria-describedby="password-helper-text"
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label={t('login.remember', 'Lembrar de mim')}
              />
              <Typography variant="body2" color="text.secondary">
                {t('login.forgot', 'Esqueceu a senha?')}
              </Typography>
            </Box>

            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading || authLoading}
              endIcon={isLoading || authLoading ? undefined : <ArrowForwardIcon />}
            >
              {isLoading || authLoading ? t('login.entering', 'Entrando...') : t('login.login', 'Entrar')}
            </StyledButton>
          </Box>

          {/* Links do footer */}
          <FooterLinks>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('login.no_account', 'Não tem uma conta?')} <Typography component="span" color="secondary" sx={{ cursor: 'pointer' }}>{t('login.click_here', 'Clique aqui')}</Typography>
            </Typography>
            <Box>
                              <Typography component="span" color="secondary" sx={{ cursor: 'pointer', mr: 2 }}>
                  {t('login.view_plans', 'Ver Planos')}
                </Typography>
                <Typography component="span" color="secondary" sx={{ cursor: 'pointer', mr: 2 }}>
                  {t('login.terms', 'Termos de Uso')}
                </Typography>
                <Typography component="span" color="secondary" sx={{ cursor: 'pointer' }}>
                  {t('login.privacy', 'Política de Privacidade')}
                </Typography>
            </Box>
          </FooterLinks>
        </CardContent>
      </LoginCard>
    </LoginContainer>
  )
}

export default LoginPage

 