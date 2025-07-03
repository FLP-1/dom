# Estrutura do Projeto DOM v1

## 📁 Organização dos Diretórios

```
dom-v1/
├── 📄 README.md                    # Documentação principal
├── 📄 requirements.txt             # Dependências Python
├── 📄 REFATORACAO_PYTHON.md       # Documentação da refatoração
├── 📄 .gitignore                   # Arquivos ignorados pelo Git
├── 📄 .cursorrules                 # Regras do Cursor AI
│
├── 📁 dom_v1/                      # Pacote principal Python
│   ├── 📄 __init__.py             # Inicialização do pacote
│   ├── 📁 core/                   # Definições principais
│   │   ├── 📄 __init__.py
│   │   ├── 📄 enums.py           # Perfis, status, tipos
│   │   ├── 📄 config.py          # Configurações do sistema
│   │   └── 📄 exceptions.py      # Exceções customizadas
│   ├── 📁 models/                 # Entidades do sistema
│   │   ├── 📄 __init__.py
│   │   └── 📄 user.py            # Modelo de usuário
│   └── 📁 utils/                  # Utilitários
│       ├── 📄 __init__.py
│       ├── 📄 cpf_validator.py   # Validação de CPF
│       └── 📄 receita_federal.py # Serviço RF
│
├── 📁 assets/                      # Recursos estáticos
│   ├── 📁 examples/               # Exemplos de telas HTML/CSS
│   │   ├── 📄 *.html             # Telas de exemplo
│   │   └── 📄 *.css              # Estilos de exemplo
│   └── 📁 static/                 # Arquivos estáticos
│       ├── 📄 *.ico              # Favicons
│       └── 📄 *.png              # Logos e imagens
│
├── 📁 docs/                        # Documentação técnica
│   ├── 📄 APLICATIVO.md          # Visão geral do aplicativo
│   ├── 📄 PERFIS_USUARIOS.md     # Perfis de usuário
│   ├── 📄 DIRETRIZES_DESENVOLVIMENTO.md
│   ├── 📄 ESTRUTURA_APLICATIVO.md
│   ├── 📄 EXEMPLOS_COMPONENTES.md
│   ├── 📄 EXEMPLO_IMPLEMENTACAO.md
│   ├── 📄 GARANTIA_REGRAS.md
│   ├── 📄 PROMPT_IA.md
│   ├── 📄 RESUMO_SISTEMA_GARANTIA.md
│   ├── 📄 CHANGELOG.md
│   └── 📄 CONTRIBUINDO.md
│
├── 📁 notebooks/                   # Jupyter Notebooks
│   └── 📄 DOM_v1_Demonstracao.ipynb # Demonstração interativa
│
├── 📁 scripts/                     # Scripts de automação
│   ├── 📄 setup_python.py         # Setup automático
│   └── 📄 test_installation.py    # Testes de instalação
│
├── 📁 tests/                       # Testes automatizados
├── 📁 logs/                        # Logs do sistema
└── 📁 data/                        # Dados do sistema
```

## 🎯 Propósito de Cada Diretório

### 📁 `dom_v1/` - Código Principal
- **core/**: Definições fundamentais do sistema
  - `enums.py`: Perfis de usuário, status, tipos
  - `config.py`: Configurações centralizadas
  - `exceptions.py`: Tratamento de erros customizado

- **models/**: Entidades de dados
  - `user.py`: Modelo de usuário com Pydantic

- **utils/**: Utilitários e serviços
  - `cpf_validator.py`: Validação completa de CPF
  - `receita_federal.py`: Serviço de consulta RF

### 📁 `assets/` - Recursos Estáticos
- **examples/**: Telas de exemplo HTML/CSS para referência visual
- **static/**: Arquivos estáticos (favicons, logos, imagens)

### 📁 `docs/` - Documentação Técnica
- Documentação completa do sistema
- Diretrizes de desenvolvimento
- Exemplos e guias

### 📁 `notebooks/` - Desenvolvimento Interativo
- Jupyter Notebooks para prototipagem
- Demonstrações interativas
- Análise de dados

### 📁 `scripts/` - Automação
- Scripts de setup e configuração
- Testes de instalação
- Utilitários de desenvolvimento

### 📁 `tests/` - Testes Automatizados
- Testes unitários
- Testes de integração
- Cobertura de código

### 📁 `logs/` - Logs do Sistema
- Logs de aplicação
- Logs de erro
- Logs de auditoria

### 📁 `data/` - Dados do Sistema
- Arquivos de dados
- Backups
- Dados de exemplo

## 🚀 Como Usar

### 1. Setup Inicial
```bash
# Execute o script de setup
python scripts/setup_python.py

# Ative o ambiente virtual
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac
```

### 2. Desenvolvimento
```bash
# Execute a demonstração
jupyter notebook notebooks/DOM_v1_Demonstracao.ipynb

# Execute testes
python scripts/test_installation.py
```

### 3. Estrutura de Desenvolvimento
```python
# Importe módulos
from dom_v1.core.enums import UserProfile
from dom_v1.utils.cpf_validator import CPFValidator
from dom_v1.models.user import UserCreate

# Use as funcionalidades
if CPFValidator.validate_cpf("123.456.789-01"):
    print("CPF válido!")
```

## 📋 Convenções

### Nomenclatura
- **Arquivos Python**: `snake_case.py`
- **Diretórios**: `snake_case/`
- **Classes**: `PascalCase`
- **Funções/Variáveis**: `snake_case`
- **Constantes**: `UPPER_SNAKE_CASE`

### Organização
- **Um arquivo por funcionalidade**
- **Imports organizados** (stdlib, third-party, local)
- **Documentação JSDoc** em todos os arquivos
- **Testes para cada módulo**

### Estrutura de Arquivos
- **`__init__.py`** em todos os diretórios Python
- **README.md** em diretórios principais
- **`.gitignore`** atualizado para Python

## 🔧 Manutenção

### Adicionando Novos Módulos
1. Crie o arquivo no diretório apropriado
2. Adicione documentação JSDoc
3. Atualize `__init__.py` se necessário
4. Crie testes correspondentes
5. Atualize esta documentação

### Estrutura de Imports
```python
# Imports padrão
import os
import sys
from typing import Dict, List

# Imports de terceiros
import pandas as pd
import numpy as np

# Imports locais
from dom_v1.core.enums import UserProfile
from dom_v1.utils.cpf_validator import CPFValidator
```

## 📈 Próximos Passos

### Fase 1 - Core (✅ Concluído)
- [x] Estrutura organizada
- [x] Validação de CPF
- [x] Perfis de usuário
- [x] Configurações

### Fase 2 - Expansão (🔄 Em desenvolvimento)
- [ ] API FastAPI
- [ ] Banco de dados
- [ ] Autenticação
- [ ] Interface web

### Fase 3 - Produção (📋 Planejado)
- [ ] Deploy automatizado
- [ ] Monitoramento
- [ ] Backup
- [ ] Documentação completa

---

**🎉 Estrutura organizada e pronta para desenvolvimento!** 