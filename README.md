# DOM v1 - Sistema de Gestão Doméstica

## 🏠 Sobre o Projeto

O DOM v1 é um sistema multiplataforma de gestão doméstica desenvolvido com **Python** (backend) e **JavaScript/Next.js** (frontend), focado em conectar empregadores e empregados domésticos de forma eficiente e segura.

## 🚀 Tecnologias

### Backend (Python)
- **FastAPI** - Framework web moderno e rápido
- **SQLAlchemy** - ORM para banco de dados
- **PostgreSQL** - Banco de dados principal
- **Prisma** - ORM alternativo para consultas complexas
- **Pydantic** - Validação de dados
- **JWT** - Autenticação e autorização

### Frontend (JavaScript/Next.js)
- **Next.js 15** - Framework React para produção
- **Material-UI v2** - Biblioteca de componentes
- **React Hooks** - Gerenciamento de estado
- **next-i18next** - Internacionalização
- **JavaScript puro** - Sem TypeScript (regra do projeto)

## 👥 Perfis de Usuários

O sistema atende 7 perfis distintos:

1. **Empregadores** - Mulheres 35-50 anos, ocupadas, boa experiência digital
2. **Empregados Domésticos** - Mulheres 30-60 anos, pouca escolaridade, experiência digital limitada
3. **Familiares dos Empregadores** - 15-70 anos, experiência digital variada
4. **Parceiros** - Donos de negócios, experiência avançada, foco em ROI
5. **Subordinados dos Parceiros** - Funcionários dos parceiros, operação
6. **Administradores** - Desenvolvedores/suporte, experiência avançada
7. **Donos** - Fundadores, experiência expert, controle total

## 📋 Regras Obrigatórias

### Cabeçalho em Todos os Arquivos
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

### Imports com Alias
```javascript
// ✅ Correto
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

// ❌ Incorreto
import { Button } from '../../../components/ui/Button'
```

### Proibição de "any" e TypeScript
```javascript
// ❌ NUNCA fazer
const data: any = response.data

// ✅ Sempre fazer
const data = response.data
```

### Internacionalização Obrigatória
```javascript
// ✅ Correto - Mensagens centralizadas
const { t } = useTranslation('common')
return <Button>{t('common.save')}</Button>

// ❌ Incorreto
return <Button>Salvar</Button>
```

### Consideração de Perfis
```javascript
// ✅ Correto - Componente adaptativo
const UserProfile = ({ profile, user }) => {
  const theme = getThemeByProfile(profile)
  const isSimpleInterface = profile === 'empregado' || profile === 'familiar'
  
  return (
    <ThemeProvider theme={theme}>
      <Box className={`user-profile ${isSimpleInterface ? 'simple' : 'advanced'}`}>
        {/* Interface adaptada ao perfil */}
      </Box>
    </ThemeProvider>
  )
}
```

## 🎯 Diretrizes de Desenvolvimento

### 1. Internacionalização (pt-BR, en, es)
- Usar `next-i18next` para todas as mensagens
- Centralizar textos nos arquivos de tradução
- Suportar português, inglês e espanhol

### 2. Não usar hardcode
- Nenhum texto fixo na interface
- Todas as mensagens vêm dos arquivos de tradução
- Incluir tooltips em todos os inputs

### 3. Centralização de mensagens
- Todas as mensagens em arquivos de tradução
- Fácil manutenção e adaptação por perfil
- Suporte a múltiplos idiomas

## 🏗️ Estrutura do Projeto

```
dom-v1/
├── frontend/                 # Aplicação Next.js
│   ├── pages/               # Páginas da aplicação
│   ├── src/                 # Código fonte
│   │   ├── theme/          # Temas e configurações
│   │   └── components/     # Componentes reutilizáveis
│   ├── public/             # Arquivos estáticos
│   │   └── locales/        # Arquivos de tradução
│   └── package.json
├── domcore/                # Backend Python
│   ├── core/              # Configurações e conexões
│   ├── models/            # Modelos de dados
│   ├── services/          # Lógica de negócio
│   └── utils/             # Utilitários
├── docs/                  # Documentação
├── scripts/               # Scripts de automação
└── README.md
```

## 🚀 Como Executar

### Backend (Python)
```bash
cd domcore
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
pip install -r requirements.txt
python main.py
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## 📱 Funcionalidades

### Dashboard Adaptativo
- Interface personalizada por perfil de usuário
- Cards de tarefas, notificações e estatísticas
- Cabeçalho com data/hora, wifi e geolocalização
- Navegação lateral responsiva

### Sistema de Login
- Validação de CPF em tempo real
- Carrossel de frases motivacionais
- Mensagens de erro específicas e amigáveis
- Suporte a múltiplos idiomas

### Gestão de Tarefas
- Criação e acompanhamento de tarefas
- Progresso visual com barras de progresso
- Filtros por status e prioridade
- Notificações automáticas

## 🔒 Segurança

- Validação rigorosa de inputs
- Autenticação JWT
- Sanitização de dados
- Verificação de permissões por perfil
- Criptografia de dados sensíveis

## 🌍 Internacionalização

O projeto suporta três idiomas:
- **Português (pt-BR)** - Idioma padrão
- **Inglês (en)** - Para usuários internacionais
- **Espanhol (es)** - Para mercado latino-americano

## 📚 Documentação

- [Estrutura do Projeto](docs/ESTRUTURA_PROJETO.md)
- [Perfis de Usuários](docs/PERFIS_USUARIOS.md)
- [Diretrizes de Desenvolvimento](docs/DIRETRIZES_DESENVOLVIMENTO.md)
- [Exemplos de Componentes](docs/EXEMPLOS_COMPONENTES.md)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Email**: contato@domv1.com
- **Website**: https://domv1.com
- **Issues**: [GitHub Issues](https://github.com/domv1/issues)

---

**Desenvolvido com ❤️ pela equipe DOM v1** 