#!/usr/bin/env python3
"""
Script de Setup - DOM v1 Python
Configuração automática do ambiente Python

@fileoverview Script de setup do DOM v1
@directory .
@description Configuração automática do ambiente Python
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import os
import sys
import subprocess
import platform
from pathlib import Path


def print_header():
    """Imprime cabeçalho do setup"""
    print("=" * 60)
    print("🚀 DOM v1 - Setup Python")
    print("Sistema de Gestão Doméstica")
    print("=" * 60)
    print()


def check_python_version():
    """Verifica versão do Python"""
    print("🐍 Verificando versão do Python...")
    
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ é necessário!")
        print(f"   Versão atual: {version.major}.{version.minor}.{version.micro}")
        sys.exit(1)
    
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} - OK")
    return True


def create_virtual_environment():
    """Cria ambiente virtual"""
    print("\n🔧 Criando ambiente virtual...")
    
    venv_path = Path("venv")
    
    if venv_path.exists():
        print("✅ Ambiente virtual já existe")
        return venv_path
    
    try:
        subprocess.run([sys.executable, "-m", "venv", "venv"], check=True)
        print("✅ Ambiente virtual criado")
        return venv_path
    except subprocess.CalledProcessError:
        print("❌ Erro ao criar ambiente virtual")
        sys.exit(1)


def get_activate_script():
    """Retorna script de ativação baseado no SO"""
    system = platform.system().lower()
    
    if system == "windows":
        return "venv\\Scripts\\activate"
    else:
        return "venv/bin/activate"


def install_dependencies():
    """Instala dependências"""
    print("\n📦 Instalando dependências...")
    
    # Determina comando de pip baseado no SO
    if platform.system().lower() == "windows":
        pip_cmd = "venv\\Scripts\\pip"
    else:
        pip_cmd = "venv/bin/pip"
    
    try:
        # Atualiza pip
        subprocess.run([pip_cmd, "install", "--upgrade", "pip"], check=True)
        print("✅ Pip atualizado")
        
        # Instala dependências
        subprocess.run([pip_cmd, "install", "-r", "requirements.txt"], check=True)
        print("✅ Dependências instaladas")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Erro ao instalar dependências: {e}")
        sys.exit(1)


def create_env_file():
    """Cria arquivo .env de exemplo"""
    print("\n⚙️ Criando arquivo .env...")
    
    env_content = """# DOM v1 - Configurações de Ambiente

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=dom_v1
DB_USER=postgres
DB_PASSWORD=

# Security
SECRET_KEY=dom-v1-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
BCRYPT_ROUNDS=12

# Receita Federal
RECEITA_API_URL=https://api.receita.fazenda.gov.br
RECEITA_TIMEOUT=30
RECEITA_MAX_RETRIES=3
RECEITA_RETRY_DELAY=1

# Notifications
EMAIL_ENABLED=true
SMS_ENABLED=true
PUSH_ENABLED=true
WHATSAPP_ENABLED=true

# Environment
ENVIRONMENT=development
DEBUG=true
"""
    
    env_path = Path(".env")
    if not env_path.exists():
        with open(env_path, "w", encoding="utf-8") as f:
            f.write(env_content)
        print("✅ Arquivo .env criado")
    else:
        print("✅ Arquivo .env já existe")


def create_directories():
    """Cria diretórios necessários"""
    print("\n📁 Criando diretórios...")
    
    directories = [
        "notebooks",
        "tests",
        "logs",
        "data",
        "docs"
    ]
    
    for directory in directories:
        Path(directory).mkdir(exist_ok=True)
        print(f"✅ Diretório {directory}/ criado")


def test_installation():
    """Testa a instalação"""
    print("\n🧪 Testando instalação...")
    
    try:
        # Testa importação dos módulos principais
        test_code = """
import sys
sys.path.append('.')

try:
    from domcore.core.enums import UserProfile
    from domcore.utils.cpf_validator import CPFValidator
    from domcore.utils.receita_federal import ReceitaFederalService
    print("✅ Módulos importados com sucesso")
    
    # Testa validação de CPF
    cpf = "123.456.789-01"
    if CPFValidator.validate_cpf(cpf):
        print("✅ Validação de CPF funcionando")
    else:
        print("❌ Validação de CPF falhou")
        
except ImportError as e:
    print(f"❌ Erro de importação: {e}")
    sys.exit(1)
"""
        
        # Executa teste
        result = subprocess.run([sys.executable, "-c", test_code], 
                              capture_output=True, text=True)
        
        if result.returncode == 0:
            print(result.stdout.strip())
            print("✅ Instalação testada com sucesso")
        else:
            print("❌ Erro no teste de instalação")
            print(result.stderr)
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Erro ao testar instalação: {e}")
        sys.exit(1)


def print_next_steps():
    """Imprime próximos passos"""
    print("\n" + "=" * 60)
    print("🎉 Setup concluído com sucesso!")
    print("=" * 60)
    
    activate_script = get_activate_script()
    
    print("\n📋 Próximos passos:")
    print(f"1. Ative o ambiente virtual:")
    print(f"   {activate_script}")
    print()
    print("2. Execute o Jupyter Notebook:")
    print("   jupyter notebook notebooks/DOM_v1_Demonstracao.ipynb")
    print()
    print("3. Ou execute o servidor de desenvolvimento:")
    print("   python -m dom_v1.main")
    print()
    print("📚 Documentação:")
    print("   - README_Python.md")
    print("   - notebooks/DOM_v1_Demonstracao.ipynb")
    print()
    print("🔧 Configuração:")
    print("   - Edite o arquivo .env com suas configurações")
    print("   - Configure o banco de dados PostgreSQL")
    print()
    print("🚀 Boa sorte com o desenvolvimento!")


def main():
    """Função principal"""
    print_header()
    
    # Verifica versão do Python
    check_python_version()
    
    # Cria ambiente virtual
    create_virtual_environment()
    
    # Instala dependências
    install_dependencies()
    
    # Cria arquivo .env
    create_env_file()
    
    # Cria diretórios
    create_directories()
    
    # Testa instalação
    test_installation()
    
    # Próximos passos
    print_next_steps()


if __name__ == "__main__":
    main() 
