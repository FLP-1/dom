# Exemplos de Componentes - Diretrizes Práticas

**Arquivo:** `docs/EXEMPLOS_COMPONENTES.md`  
**Diretório:** `docs/`  
**Descrição:** Exemplos práticos de componentes seguindo as diretrizes de desenvolvimento  
**Data de Criação:** 2024-12-19  
**Última Alteração:** 2024-12-19

---

## 📋 Índice

1. [Componente de Input com Tooltip](#componente-de-input-com-tooltip)
2. [Card Reutilizável](#card-reutilizável)
3. [Hook Customizado](#hook-customizado)
4. [Serviço de API](#serviço-de-api)
5. [Página com Componentes](#página-com-componentes)
6. [Formulário com Validação](#formulário-com-validação)
7. [Lista com Paginação](#lista-com-paginação)
8. [Modal Reutilizável](#modal-reutilizável)

---

## 🎯 Componente de Input com Tooltip

### Input Component

```typescript
/**
 * @fileoverview CustomInput
 * @directory packages/ui/src/components/Input
 * @description Componente de input customizado com tooltip e validação
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React, { useState } from 'react'
import {
  TextField,
  TextFieldProps,
  Tooltip,
  IconButton,
  InputAdornment
} from '@mui/material'
import { Info as InfoIcon, Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { CustomInputProps } from './CustomInput.types'

export const CustomInput: React.FC<CustomInputProps> = ({
  name,
  label,
  type = 'text',
  required = false,
  helperText,
  error,
  tooltipText,
  showPasswordToggle = false,
  ...props
}) => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const inputType = type === 'password' && showPasswordToggle 
    ? (showPassword ? 'text' : 'password') 
    : type

  const endAdornment = (
    <InputAdornment position="end">
      {showPasswordToggle && type === 'password' && (
        <IconButton
          onClick={handlePasswordToggle}
          edge="end"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      )}
      {tooltipText && (
        <Tooltip
          title={tooltipText}
          open={showTooltip}
          onClose={() => setShowTooltip(false)}
          onOpen={() => setShowTooltip(true)}
        >
          <IconButton
            size="small"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <InfoIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </InputAdornment>
  )

  return (
    <TextField
      name={name}
      label={label}
      type={inputType}
      required={required}
      error={!!error}
      helperText={error || helperText}
      InputProps={{
        endAdornment
      }}
      fullWidth
      variant="outlined"
      {...props}
    />
  )
}

CustomInput.defaultProps = {
  type: 'text',
  required: false,
  showPasswordToggle: false
}
```

### Types

```typescript
/**
 * @fileoverview CustomInput.types
 * @directory packages/ui/src/components/Input
 * @description Tipos para o componente CustomInput
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import { TextFieldProps } from '@mui/material'

export interface CustomInputProps extends Omit<TextFieldProps, 'type'> {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  required?: boolean
  helperText?: string
  error?: string
  tooltipText?: string
  showPasswordToggle?: boolean
}
```

### Test

```typescript
/**
 * @fileoverview CustomInput.test
 * @directory packages/ui/src/components/Input
 * @description Testes para o componente CustomInput
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from '@/theme'
import { CustomInput } from './CustomInput'

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  )
}

describe('CustomInput', () => {
  it('should render input with label', () => {
    renderWithTheme(
      <CustomInput
        name="email"
        label="E-mail"
        tooltipText="Digite um e-mail válido"
      />
    )

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('should show tooltip on hover', () => {
    renderWithTheme(
      <CustomInput
        name="email"
        label="E-mail"
        tooltipText="Digite um e-mail válido"
      />
    )

    const tooltipButton = screen.getByRole('button')
    fireEvent.mouseEnter(tooltipButton)

    expect(screen.getByText('Digite um e-mail válido')).toBeInTheDocument()
  })

  it('should toggle password visibility', () => {
    renderWithTheme(
      <CustomInput
        name="password"
        label="Senha"
        type="password"
        showPasswordToggle
      />
    )

    const toggleButton = screen.getByLabelText('Mostrar senha')
    fireEvent.click(toggleButton)

    expect(screen.getByLabelText('Ocultar senha')).toBeInTheDocument()
  })
})
```

---

## 🃏 Card Reutilizável

### Product Card

```typescript
/**
 * @fileoverview ProductCard
 * @directory packages/ui/src/components/Card/ProductCard
 * @description Card reutilizável para exibição de produtos
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React, { memo } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Chip,
  Box,
  Tooltip
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Visibility
} from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { formatCurrency } from '@/utils/formatting/currency'
import { ProductCardProps } from './ProductCard.types'

export const ProductCard = memo<ProductCardProps>(({
  product,
  onFavorite,
  onAddToCart,
  onView,
  isFavorite = false,
  isInCart = false,
  ...props
}) => {
  const { t } = useTranslation()

  const handleFavorite = () => {
    onFavorite?.(product.id)
  }

  const handleAddToCart = () => {
    onAddToCart?.(product.id)
  }

  const handleView = () => {
    onView?.(product.id)
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
      {...props}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="h3" noWrap>
            {product.name}
          </Typography>
          <Tooltip title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
            <IconButton
              size="small"
              onClick={handleFavorite}
              color={isFavorite ? 'error' : 'default'}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="primary">
            {formatCurrency(product.price)}
          </Typography>
          {product.discount > 0 && (
            <Chip
              label={`-${product.discount}%`}
              color="error"
              size="small"
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Ver detalhes">
            <IconButton
              variant="outlined"
              size="small"
              onClick={handleView}
              sx={{ flex: 1 }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isInCart ? 'Remover do carrinho' : 'Adicionar ao carrinho'}>
            <IconButton
              variant="contained"
              size="small"
              onClick={handleAddToCart}
              color={isInCart ? 'error' : 'primary'}
              sx={{ flex: 1 }}
            >
              <ShoppingCart />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

ProductCard.defaultProps = {
  isFavorite: false,
  isInCart: false
}
```

### Types

```typescript
/**
 * @fileoverview ProductCard.types
 * @directory packages/ui/src/components/Card/ProductCard
 * @description Tipos para o componente ProductCard
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

export interface Product {
  id: string
  name: string
  description: string
  price: number
  discount: number
  image: string
  category: string
  stock: number
}

export interface ProductCardProps {
  product: Product
  onFavorite?: (productId: string) => void
  onAddToCart?: (productId: string) => void
  onView?: (productId: string) => void
  isFavorite?: boolean
  isInCart?: boolean
}
```

---

## 🎣 Hook Customizado

### useApi Hook

```typescript
/**
 * @fileoverview useApi
 * @directory packages/utils/src/hooks/useApi
 * @description Hook customizado para gerenciar chamadas de API
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import { useState, useCallback, useRef } from 'react'
import { ApiResponse, ApiError } from '@/types/api/ApiResponse'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: ApiError | null
}

interface UseApiOptions {
  immediate?: boolean
  onSuccess?: (data: any) => void
  onError?: (error: ApiError) => void
}

export const useApi = <T = any>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions = {}
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      // Cancelar requisição anterior se existir
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // Criar novo controller
      abortControllerRef.current = new AbortController()

      setState(prev => ({ ...prev, loading: true, error: null }))

      try {
        const response = await apiFunction(...args, abortControllerRef.current.signal)
        
        setState({
          data: response.data,
          loading: false,
          error: null
        })

        options.onSuccess?.(response.data)
        return response.data
      } catch (error) {
        const apiError: ApiError = {
          code: 'UNKNOWN_ERROR',
          message: 'Erro desconhecido',
          details: error
        }

        if (error instanceof Error) {
          apiError.message = error.message
        }

        setState({
          data: null,
          loading: false,
          error: apiError
        })

        options.onError?.(apiError)
        return null
      }
    },
    [apiFunction, options]
  )

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null
    })
  }, [])

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setState(prev => ({ ...prev, loading: false }))
    }
  }, [])

  return {
    ...state,
    execute,
    reset,
    cancel
  }
}
```

---

## 🌐 Serviço de API

### User Service

```typescript
/**
 * @fileoverview UserService
 * @directory packages/services/src/UserService
 * @description Serviço para gerenciar operações de usuário
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import { ApiResponse, PaginatedResponse } from '@/types/api/ApiResponse'
import { User, CreateUserRequest, UpdateUserRequest } from '@/types/entities/User'
import { apiClient } from '@/utils/apiClient'

export class UserService {
  private static readonly BASE_URL = '/api/users'

  /**
   * Busca todos os usuários com paginação
   * @param page - Página atual
   * @param limit - Limite de itens por página
   * @param search - Termo de busca opcional
   * @returns Promise com lista paginada de usuários
   */
  static async getUsers(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })

    if (search) {
      params.append('search', search)
    }

    const response = await apiClient.get<PaginatedResponse<User>>(
      `${this.BASE_URL}?${params.toString()}`
    )

    return response.data
  }

  /**
   * Busca usuário por ID
   * @param id - ID do usuário
   * @returns Promise com dados do usuário
   */
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await apiClient.get<ApiResponse<User>>(
      `${this.BASE_URL}/${id}`
    )

    return response.data
  }

  /**
   * Cria novo usuário
   * @param userData - Dados do usuário
   * @returns Promise com usuário criado
   */
  static async createUser(userData: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await apiClient.post<ApiResponse<User>>(
      this.BASE_URL,
      userData
    )

    return response.data
  }

  /**
   * Atualiza usuário existente
   * @param id - ID do usuário
   * @param userData - Dados para atualização
   * @returns Promise com usuário atualizado
   */
  static async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<ApiResponse<User>> {
    const response = await apiClient.put<ApiResponse<User>>(
      `${this.BASE_URL}/${id}`,
      userData
    )

    return response.data
  }

  /**
   * Remove usuário
   * @param id - ID do usuário
   * @returns Promise de confirmação
   */
  static async deleteUser(id: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      `${this.BASE_URL}/${id}`
    )

    return response.data
  }

  /**
   * Atualiza status do usuário
   * @param id - ID do usuário
   * @param status - Novo status
   * @returns Promise com usuário atualizado
   */
  static async updateUserStatus(
    id: string,
    status: User['status']
  ): Promise<ApiResponse<User>> {
    const response = await apiClient.patch<ApiResponse<User>>(
      `${this.BASE_URL}/${id}/status`,
      { status }
    )

    return response.data
  }
}
```

---

## 📄 Página com Componentes

### User List Page

```typescript
/**
 * @fileoverview UserListPage
 * @directory apps/web/src/pages/users
 * @description Página de listagem de usuários
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Skeleton
} from '@mui/material'
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { useApi } from '@/hooks/useApi'
import { UserService } from '@/services/UserService'
import { UserCard } from '@/components/UserCard'
import { Pagination } from '@/components/Pagination'
import { CreateUserModal } from '@/components/CreateUserModal'
import { User } from '@/types/entities/User'

export const UserListPage: React.FC = () => {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const {
    data: usersData,
    loading,
    error,
    execute: fetchUsers
  } = useApi(UserService.getUsers)

  useEffect(() => {
    fetchUsers(currentPage, 10, searchTerm)
  }, [currentPage, searchTerm, fetchUsers])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1) // Reset para primeira página
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRefresh = () => {
    fetchUsers(currentPage, 10, searchTerm)
  }

  const handleUserCreated = () => {
    setShowCreateModal(false)
    fetchUsers(currentPage, 10, searchTerm)
  }

  const handleUserDeleted = (userId: string) => {
    // Atualizar lista após deleção
    fetchUsers(currentPage, 10, searchTerm)
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          {t('users.title')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('common.refresh')}>
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('users.create')}>
            <IconButton
              color="primary"
              onClick={() => setShowCreateModal(true)}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label={t('users.search.placeholder')}
          value={searchTerm}
          onChange={handleSearch}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Users Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {usersData?.data.map((user: User) => (
              <Grid item xs={12} sm={6} md={4} key={user.id}>
                <UserCard
                  user={user}
                  onDelete={handleUserDeleted}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {usersData?.pagination && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                currentPage={currentPage}
                totalPages={usersData.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}

      {/* Create User Modal */}
      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleUserCreated}
      />
    </Container>
  )
}
```

---

## 📝 Formulário com Validação

### User Form

```typescript
/**
 * @fileoverview UserForm
 * @directory packages/ui/src/components/Form/UserForm
 * @description Formulário de usuário com validação
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React, { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from '@/hooks/useTranslation'
import { CustomInput } from '@/components/Input/CustomInput'
import { UserRole } from '@/types/entities/User'
import { UserFormProps } from './UserForm.types'

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .required('Nome é obrigatório'),
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  role: Yup.string()
    .oneOf(['admin', 'user', 'moderator'], 'Perfil inválido')
    .required('Perfil é obrigatório')
})

export const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  loading = false,
  error
}) => {
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: initialValues || {
      name: '',
      email: '',
      role: 'user' as UserRole
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSubmit(values)
    }
  })

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomInput
            name="name"
            label={t('user.name')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors.name}
            tooltipText={t('user.name.help')}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomInput
            name="email"
            label={t('user.email')}
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && formik.errors.email}
            tooltipText={t('user.email.help')}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <CustomInput
            name="role"
            label={t('user.role')}
            select
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.role && formik.errors.role}
            tooltipText={t('user.role.help')}
            required
            SelectProps={{
              native: true
            }}
          >
            <option value="user">{t('user.roles.user')}</option>
            <option value="moderator">{t('user.roles.moderator')}</option>
            <option value="admin">{t('user.roles.admin')}</option>
          </CustomInput>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading || !formik.isValid}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? t('common.saving') : t('common.save')}
        </Button>

        <Button
          type="button"
          variant="outlined"
          onClick={formik.resetForm}
          disabled={loading}
        >
          {t('common.reset')}
        </Button>
      </Box>
    </Box>
  )
}

UserForm.defaultProps = {
  loading: false
}
```

---

## 📋 Lista com Paginação

### Pagination Component

```typescript
/**
 * @fileoverview Pagination
 * @directory packages/ui/src/components/Pagination
 * @description Componente de paginação reutilizável
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React from 'react'
import {
  Pagination as MuiPagination,
  PaginationItem,
  Box,
  Typography
} from '@mui/material'
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { PaginationProps } from './Pagination.types'

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  ...props
}) => {
  const { t } = useTranslation()

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page)
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      {showInfo && (
        <Typography variant="body2" color="text.secondary">
          {t('pagination.showing', {
            start: startItem,
            end: endItem,
            total: totalItems
          })}
        </Typography>
      )}

      <MuiPagination
        page={currentPage}
        count={totalPages}
        onChange={handlePageChange}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
        renderItem={(item) => (
          <PaginationItem
            slots={{
              first: FirstPage,
              last: LastPage,
              previous: NavigateBefore,
              next: NavigateNext
            }}
            {...item}
          />
        )}
        {...props}
      />
    </Box>
  )
}

Pagination.defaultProps = {
  showInfo: true
}
```

---

## 🪟 Modal Reutilizável

### Confirmation Modal

```typescript
/**
 * @fileoverview ConfirmationModal
 * @directory packages/ui/src/components/Modal/ConfirmationModal
 * @description Modal de confirmação reutilizável
 * @created 2024-12-19
 * @lastModified 2024-12-19
 */

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material'
import { Close as CloseIcon, Warning as WarningIcon } from '@mui/icons-material'
import { useTranslation } from '@/hooks/useTranslation'
import { ConfirmationModalProps } from './ConfirmationModal.types'

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose,
  severity = 'warning',
  loading = false,
  ...props
}) => {
  const { t } = useTranslation()

  const handleConfirm = () => {
    onConfirm?.()
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const handleClose = () => {
    onClose?.()
  }

  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error'
      case 'warning':
        return 'warning'
      case 'info':
        return 'info'
      default:
        return 'primary'
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      {...props}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color={getSeverityColor()} />
        {title}
        <IconButton
          onClick={handleClose}
          sx={{ ml: 'auto' }}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleCancel}
          disabled={loading}
          variant="outlined"
        >
          {cancelText || t('common.cancel')}
        </Button>
        
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color={getSeverityColor()}
        >
          {confirmText || t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationModal.defaultProps = {
  severity: 'warning',
  loading: false
}
```

---

## 📋 Checklist de Implementação

### ✅ Componentes
- [ ] Cabeçalho em todos os arquivos
- [ ] JSDoc para documentação
- [ ] Props documentadas
- [ ] Default props configurados
- [ ] Tooltips implementados
- [ ] Testes escritos
- [ ] Documentação atualizada

### ✅ Hooks
- [ ] Lógica reutilizável
- [ ] JSDoc para documentação
- [ ] Tratamento de erros
- [ ] Cleanup adequado
- [ ] Performance otimizada

### ✅ Serviços
- [ ] Métodos bem definidos
- [ ] JSDoc completo
- [ ] Tratamento de erros
- [ ] Validação de parâmetros
- [ ] Comentários descritivos

### ✅ Páginas
- [ ] Componentes reutilizáveis
- [ ] Estados gerenciados
- [ ] Loading states
- [ ] Error handling
- [ ] Responsividade

---

**Última atualização:** 2024-12-19  
**Versão:** 1.0.0  
**Responsável:** Equipe de Desenvolvimento 