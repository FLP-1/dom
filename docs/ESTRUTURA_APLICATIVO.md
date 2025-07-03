# DOM v1 - Estrutura do Aplicativo

## 🎯 Visão Geral

O DOM v1 é um sistema completo de gestão doméstica que controla todos os aspectos dos serviços domésticos, desde planejamento até gestão burocrática dos empregados.

## 🏗️ Arquitetura do Sistema

### Módulos Principais

```
DOM v1
├── 📋 Gestão de Tarefas
├── 👥 Gestão de Empregados
├── 💰 Gestão Financeira
├── 📊 Controle de Ponto
├── 📄 Gestão Documental
├── 💬 Comunicação
├── 📱 Controle de Empréstimos
└── ⚙️ Administração
```

## 📋 Módulo 1: Gestão de Tarefas

### Funcionalidades por Perfil

#### **Empregadores**
- **Dashboard de Tarefas**: Visão geral com status, prioridades e prazos
- **Planejamento**: Criar, editar e agendar tarefas
- **Delegação**: Atribuir responsabilidades aos empregados
- **Acompanhamento**: Monitorar execução em tempo real
- **Reprogramação**: Alterar prazos e prioridades
- **Relatórios**: Métricas de produtividade e conclusão

#### **Empregados Domésticos**
- **Lista de Tarefas**: Interface simples com tarefas do dia
- **Status Update**: Marcar início, progresso e conclusão
- **Fotos**: Enviar fotos como comprovação
- **Comunicação**: Solicitar esclarecimentos
- **Histórico**: Ver tarefas concluídas

#### **Familiares**
- **Visualização**: Ver tarefas em andamento
- **Ajuda**: Marcar disponibilidade para ajudar
- **Notificações**: Receber alertas sobre tarefas importantes

### Estrutura de Dados

```typescript
interface Task {
  id: string
  title: string
  description: string
  category: TaskCategory
  priority: 'baixa' | 'média' | 'alta' | 'urgente'
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
  assignedTo: string[] // IDs dos empregados
  createdBy: string // ID do empregador
  dueDate: Date
  estimatedDuration: number // em minutos
  actualDuration?: number
  location: string
  materials?: string[]
  photos?: string[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface TaskCategory {
  id: string
  name: string
  color: string
  icon: string
  profile: UserProfile[] // perfis que podem ver/criar
}
```

## 👥 Módulo 2: Gestão de Empregados

### Funcionalidades por Perfil

#### **Empregadores**
- **Cadastro Completo**: Dados pessoais, documentos, experiência
- **Contratos**: Criação e gestão de contratos de trabalho
- **Admissão/Demissão**: Processos completos com documentação
- **Perfil Profissional**: Histórico, habilidades, avaliações
- **Substituições**: Gestão de férias e ausências

#### **Empregados Domésticos**
- **Perfil Pessoal**: Visualizar e atualizar dados pessoais
- **Documentos**: Upload e visualização de documentos
- **Histórico**: Ver histórico de trabalho e avaliações
- **Benefícios**: Visualizar benefícios e direitos

#### **Administradores**
- **Gestão Completa**: Acesso total aos dados dos empregados
- **Compliance**: Verificação de documentação e legalidade
- **Relatórios**: Estatísticas e relatórios gerenciais

### Estrutura de Dados

```typescript
interface Employee {
  id: string
  personalInfo: {
    name: string
    cpf: string
    rg: string
    birthDate: Date
    address: Address
    phone: string
    email: string
    emergencyContact: Contact
  }
  workInfo: {
    admissionDate: Date
    dismissalDate?: Date
    position: string
    salary: number
    workSchedule: WorkSchedule
    benefits: Benefit[]
    skills: Skill[]
  }
  documents: {
    cpf: Document
    rg: Document
    workCard: Document
    medicalCertificate: Document
    backgroundCheck: Document
    others: Document[]
  }
  performance: {
    evaluations: Evaluation[]
    incidents: Incident[]
    achievements: Achievement[]
  }
  status: 'active' | 'inactive' | 'vacation' | 'sick_leave'
  profile: UserProfile
  createdAt: Date
  updatedAt: Date
}
```

## 💰 Módulo 3: Gestão Financeira

### Funcionalidades por Perfil

#### **Empregadores**
- **Controle de Salários**: Gestão completa de remunerações
- **Benefícios**: Vale-refeição, transporte, saúde
- **Impostos**: Cálculo e recolhimento automático
- **Relatórios**: Demonstrativos e balanços
- **Orçamento**: Planejamento e controle de gastos

#### **Empregados Domésticos**
- **Holerite**: Visualização do contracheque
- **Histórico**: Ver histórico de pagamentos
- **Benefícios**: Status dos benefícios recebidos

#### **Administradores**
- **Gestão Completa**: Controle total das finanças
- **Compliance Fiscal**: Verificação de obrigações
- **Auditoria**: Rastreamento de todas as transações

### Estrutura de Dados

```typescript
interface Payroll {
  id: string
  employeeId: string
  month: number
  year: number
  grossSalary: number
  deductions: Deduction[]
  benefits: Benefit[]
  netSalary: number
  taxes: Tax[]
  status: 'pending' | 'processed' | 'paid'
  paymentDate?: Date
  paymentMethod: 'pix' | 'transfer' | 'check'
  createdAt: Date
  updatedAt: Date
}

interface Deduction {
  type: 'inss' | 'irrf' | 'fgts' | 'other'
  description: string
  amount: number
  percentage?: number
}

interface Benefit {
  type: 'vale_refeicao' | 'vale_transporte' | 'plano_saude' | 'other'
  description: string
  amount: number
  employerContribution: number
  employeeContribution: number
}
```

## 📊 Módulo 4: Controle de Ponto

### Funcionalidades por Perfil

#### **Empregadores**
- **Dashboard de Ponto**: Visão geral da jornada de trabalho
- **Horários**: Definir horários de trabalho
- **Aprovação**: Aprovar/rejeitar registros de ponto
- **Relatórios**: Horas trabalhadas, extras, faltas
- **Alertas**: Notificações sobre irregularidades

#### **Empregados Domésticos**
- **Registro de Ponto**: Entrada e saída com geolocalização
- **Histórico**: Visualizar registros do mês
- **Justificativas**: Solicitar correções de ponto

#### **Administradores**
- **Gestão Completa**: Controle total do sistema de ponto
- **Compliance**: Verificação de conformidade legal
- **Auditoria**: Rastreamento de todos os registros

### Estrutura de Dados

```typescript
interface TimeRecord {
  id: string
  employeeId: string
  date: Date
  entries: TimeEntry[]
  exits: TimeEntry[]
  totalWorkedHours: number
  overtimeHours: number
  status: 'pending' | 'approved' | 'rejected'
  notes?: string
  location: {
    latitude: number
    longitude: number
    address: string
  }
  createdAt: Date
  updatedAt: Date
}

interface TimeEntry {
  id: string
  timestamp: Date
  type: 'entry' | 'exit'
  method: 'app' | 'fingerprint' | 'manual'
  location: {
    latitude: number
    longitude: number
    address: string
  }
  photo?: string // selfie para comprovação
}
```

## 📄 Módulo 5: Gestão Documental

### Funcionalidades por Perfil

#### **Empregadores**
- **Upload de Documentos**: Envio de documentos dos empregados
- **Organização**: Categorização e tags
- **Validação**: Verificação de documentos
- **Renovação**: Alertas de documentos vencidos
- **Backup**: Armazenamento seguro

#### **Empregados Domésticos**
- **Upload Pessoal**: Envio de documentos pessoais
- **Visualização**: Ver documentos enviados
- **Status**: Verificar status de validação

#### **Administradores**
- **Gestão Completa**: Controle total da documentação
- **Compliance**: Verificação de conformidade legal
- **Auditoria**: Rastreamento de todos os documentos

### Estrutura de Dados

```typescript
interface Document {
  id: string
  employeeId: string
  type: DocumentType
  name: string
  description: string
  fileUrl: string
  fileSize: number
  mimeType: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  uploadDate: Date
  expirationDate?: Date
  validatedBy?: string
  validatedAt?: Date
  notes?: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

enum DocumentType {
  CPF = 'cpf',
  RG = 'rg',
  WORK_CARD = 'work_card',
  MEDICAL_CERTIFICATE = 'medical_certificate',
  BACKGROUND_CHECK = 'background_check',
  CONTRACT = 'contract',
  PAYSLIP = 'payslip',
  OTHER = 'other'
}
```

## 💬 Módulo 6: Comunicação

### Funcionalidades por Perfil

#### **Empregadores**
- **Chat Individual**: Comunicação direta com empregados
- **Chat em Grupo**: Comunicação com família
- **Anúncios**: Comunicados importantes
- **Notificações**: Alertas personalizados
- **Histórico**: Arquivo de conversas

#### **Empregados Domésticos**
- **Chat Simples**: Interface intuitiva para comunicação
- **Notificações**: Receber alertas importantes
- **Fotos**: Enviar fotos das tarefas
- **Status**: Marcar disponibilidade

#### **Familiares**
- **Chat Familiar**: Comunicação com empregadores
- **Notificações**: Receber atualizações importantes
- **Participação**: Ajudar na gestão

### Estrutura de Dados

```typescript
interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  type: 'text' | 'image' | 'file' | 'location'
  attachments?: Attachment[]
  readBy: string[]
  status: 'sent' | 'delivered' | 'read'
  createdAt: Date
  updatedAt: Date
}

interface Chat {
  id: string
  type: 'individual' | 'group' | 'family'
  participants: string[]
  name?: string
  lastMessage?: Message
  unreadCount: Record<string, number>
  createdAt: Date
  updatedAt: Date
}

interface Notification {
  id: string
  userId: string
  type: 'task' | 'payment' | 'document' | 'system'
  title: string
  message: string
  data?: any
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Date
}
```

## 📱 Módulo 7: Controle de Empréstimos

### Funcionalidades por Perfil

#### **Empregadores**
- **Solicitações**: Aprovar/rejeitar pedidos de empréstimo
- **Gestão**: Controle de valores e prazos
- **Desconto**: Integração com folha de pagamento
- **Relatórios**: Histórico de empréstimos
- **Configurações**: Definir limites e regras

#### **Empregados Domésticos**
- **Solicitação**: Pedir empréstimo ou adiantamento
- **Acompanhamento**: Ver status e histórico
- **Pagamento**: Visualizar descontos na folha

#### **Administradores**
- **Gestão Completa**: Controle total dos empréstimos
- **Compliance**: Verificação de conformidade
- **Auditoria**: Rastreamento de todas as transações

### Estrutura de Dados

```typescript
interface Loan {
  id: string
  employeeId: string
  type: 'loan' | 'advance'
  amount: number
  interestRate: number
  installments: number
  installmentAmount: number
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'paid' | 'defaulted'
  requestDate: Date
  approvalDate?: Date
  startDate?: Date
  endDate?: Date
  reason: string
  approvedBy?: string
  payments: LoanPayment[]
  createdAt: Date
  updatedAt: Date
}

interface LoanPayment {
  id: string
  loanId: string
  installment: number
  amount: number
  dueDate: Date
  paymentDate?: Date
  status: 'pending' | 'paid' | 'overdue'
  payrollId?: string
  createdAt: Date
}
```

## ⚙️ Módulo 8: Administração

### Funcionalidades por Perfil

#### **Administradores**
- **Gestão de Usuários**: Criar e gerenciar contas
- **Configurações**: Parâmetros do sistema
- **Backup**: Backup e restauração de dados
- **Logs**: Auditoria de ações
- **Suporte**: Atendimento ao cliente

#### **Donos**
- **Acesso Total**: Código fonte e banco de dados
- **Métricas**: KPIs do negócio
- **Configurações Avançadas**: Parâmetros técnicos
- **Relatórios Executivos**: Visão estratégica

### Estrutura de Dados

```typescript
interface SystemConfig {
  id: string
  key: string
  value: any
  description: string
  category: 'general' | 'payroll' | 'time' | 'communication'
  editable: boolean
  createdAt: Date
  updatedAt: Date
}

interface AuditLog {
  id: string
  userId: string
  action: string
  entity: string
  entityId: string
  oldValues?: any
  newValues?: any
  ipAddress: string
  userAgent: string
  createdAt: Date
}
```

## 🎨 Interface por Perfil

### Empregadores
- **Dashboard**: Métricas principais, tarefas pendentes, alertas
- **Navegação**: Rápida e eficiente
- **Cores**: Verde profissional (#2E7D32)
- **Layout**: Compacto e informativo

### Empregados Domésticos
- **Interface**: Simples e intuitiva
- **Botões**: Grandes e bem espaçados
- **Cores**: Laranja acolhedor (#FF6B35)
- **Texto**: Grande e claro

### Familiares
- **Adaptação**: Por idade e experiência
- **Compartilhamento**: Fácil e intuitivo
- **Cores**: Roxo familiar (#9C27B0)
- **Layout**: Balanceado

### Parceiros
- **Métricas**: Em destaque
- **Personalização**: White label
- **Cores**: Azul empresarial (#1565C0)
- **Layout**: Profissional

### Administradores
- **Informação**: Densa e técnica
- **Acesso**: Rápido a todas as funções
- **Cores**: Vermelho admin (#D32F2F)
- **Layout**: Funcional

### Donos
- **Visão**: Estratégica e executiva
- **Controle**: Total do sistema
- **Cores**: Preto executivo (#000000)
- **Layout**: Premium

## 🔄 Fluxos Principais

### 1. Gestão de Tarefas
```
Empregador → Cria Tarefa → Atribui Empregado → Empregado Executa → 
Empregador Aprova → Sistema Registra → Relatório Gerado
```

### 2. Gestão de Empregados
```
Empregador → Cadastra Empregado → Upload Documentos → 
Administrador Valida → Contrato Gerado → Sistema Ativo
```

### 3. Controle de Ponto
```
Empregado → Registra Entrada → Sistema Valida → Empregador Aprova → 
Relatório Gerado → Folha de Pagamento Atualizada
```

### 4. Gestão Financeira
```
Sistema → Calcula Salário → Aplica Descontos → Gera Holerite → 
Empregador Aprova → Pagamento Processado → Comprovante Gerado
```

## 📱 Plataformas

### Web (Next.js)
- **Empregadores**: Dashboard completo
- **Administradores**: Painel administrativo
- **Parceiros**: Interface empresarial

### Mobile (React Native)
- **Empregados**: Interface simplificada
- **Familiares**: Acesso básico
- **Empregadores**: Acesso móvel

### Admin Panel (Next.js)
- **Administradores**: Gestão completa
- **Donos**: Acesso executivo

## 🔒 Segurança

### Autenticação
- JWT tokens
- Refresh tokens
- 2FA para perfis críticos

### Autorização
- RBAC (Role-Based Access Control)
- Permissões granulares por perfil
- Auditoria completa

### Dados
- Criptografia em trânsito e repouso
- Backup automático
- Compliance LGPD

## 📊 Analytics

### Métricas por Perfil
- **Empregadores**: Produtividade, eficiência
- **Empregados**: Performance, pontualidade
- **Parceiros**: ROI, crescimento
- **Administradores**: Sistema, usuários
- **Donos**: Negócio, estratégia

### Relatórios
- Automáticos e personalizados
- Exportação em múltiplos formatos
- Dashboards interativos

---

**Nota**: Esta estrutura garante que cada perfil tenha a experiência otimizada para suas necessidades e habilidades, mantendo a funcionalidade completa do sistema. 