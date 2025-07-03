#!/usr/bin/env python3
"""
Teste de Instalação - DOM v1 Python
Valida se a instalação está funcionando corretamente

@fileoverview Teste de instalação do DOM v1
@directory .
@description Validação da instalação Python
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

import sys
import asyncio
from pathlib import Path
from domcore.utils.cpf_validator import CPFValidator
from domcore.utils.receita_federal import ReceitaFederalService
from domcore.core.enums import UserProfile
from domcore.models.user import UserProfileInfo, UserCreate

# Adiciona o diretório atual ao path
sys.path.append(str(Path(__file__).parent))


def test_imports():
    """Testa importação dos módulos principais"""
    print("🔍 Testando importações...")
    
    try:
        from domcore.core.enums import UserProfile, TaskStatus
        print("✅ Enums importados")
        
        from domcore.core.config import config
        print("✅ Configuração importada")
        
        from domcore.core.exceptions import DOMException, CPFError
        print("✅ Exceções importadas")
        
        from domcore.utils.cpf_validator import CPFValidator
        print("✅ Validador de CPF importado")
        
        from domcore.utils.receita_federal import ReceitaFederalService
        print("✅ Serviço RF importado")
        
        from domcore.models.user import User, UserProfileInfo
        print("✅ Modelos de usuário importados")
        
        return True
        
    except ImportError as e:
        print(f"❌ Erro de importação: {e}")
        return False


def test_cpf_validation():
    """Testa validação de CPF"""
    print("\n🔍 Testando validação de CPF...")
    
    try:
        # CPFs válidos
        cpfs_validos = ["529.982.247-25", "626.487.160-50", "168.995.350-09"]
        
        for cpf in cpfs_validos:
            if CPFValidator.validate_cpf(cpf):
                formatted = CPFValidator.format_cpf(cpf)
                print(f"✅ {cpf} -> {formatted}")
            else:
                print(f"❌ {cpf} - CPF inválido")
                return False
        
        # CPF inválido
        cpf_invalido = "123.456.789-10"
        if not CPFValidator.validate_cpf(cpf_invalido):
            print(f"✅ {cpf_invalido} - Corretamente rejeitado")
        else:
            print(f"❌ {cpf_invalido} - Deveria ser inválido")
            return False
        
        # Geração de CPF
        cpf_gerado = CPFValidator.generate_valid_cpf()
        if CPFValidator.validate_cpf(cpf_gerado):
            print(f"✅ CPF gerado: {cpf_gerado}")
        else:
            print(f"❌ CPF gerado inválido: {cpf_gerado}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na validação de CPF: {e}")
        return False


async def test_receita_federal():
    """Testa serviço da Receita Federal"""
    print("\n🔍 Testando serviço da Receita Federal...")
    
    try:
        service = ReceitaFederalService()
        
        # Testa consulta válida
        dados = await service.consultar_cpf("598.769.137-00")
        if dados and "nome" in dados:
            print(f"✅ Consulta RF: {dados['nome']}")
        else:
            print("❌ Consulta RF falhou")
            return False
        
        # Testa CPF não encontrado
        try:
            await service.consultar_cpf("999.888.777-66")
            print("❌ CPF não encontrado deveria gerar erro")
            return False
        except ReceitaFederalError:
            print("✅ CPF não encontrado - erro correto")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro no serviço RF: {e}")
        return False


def test_user_profiles():
    """Testa perfis de usuário"""
    print("\n🔍 Testando perfis de usuário...")
    
    try:
        for profile in UserProfile:
            # Testa configuração de tema
            tema = UserProfile.get_theme_config(profile)
            if tema and "primary_color" in tema:
                print(f"✅ {profile.value}: {tema['primary_color']}")
            else:
                print(f"❌ Tema não encontrado para {profile.value}")
                return False
            
            # Testa informações do perfil
            profile_info = UserProfileInfo.from_profile(profile)
            if profile_info.permissoes and profile_info.funcionalidades:
                print(f"   🔐 {len(profile_info.permissoes)} permissões")
                print(f"   ⚙️ {len(profile_info.funcionalidades)} funcionalidades")
            else:
                print(f"❌ Informações não encontradas para {profile.value}")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro nos perfis: {e}")
        return False


def test_user_creation():
    """Testa criação de usuário"""
    print("\n🔍 Testando criação de usuário...")
    
    try:
        # Dados válidos
        user_data = {
            "cpf": "529.982.247-25",
            "nome": "Maria Silva Santos",
            "email": "maria@exemplo.com",
            "telefone": "(11) 99999-9999",
            "perfil": UserProfile.EMPREGADOR,
            "senha": "senha123",
            "confirmar_senha": "senha123"
        }
        
        user_create = UserCreate(**user_data)
        print(f"✅ Usuário criado: {user_create.nome}")
        
        # Testa validação de email
        try:
            invalid_email_data = user_data.copy()
            invalid_email_data["email"] = "email-invalido"
            UserCreate(**invalid_email_data)
            print("❌ Email inválido deveria gerar erro")
            return False
        except ValueError:
            print("✅ Email inválido - erro correto")
        
        # Testa confirmação de senha
        try:
            invalid_password_data = user_data.copy()
            invalid_password_data["confirmar_senha"] = "senha-diferente"
            UserCreate(**invalid_password_data)
            print("❌ Senhas diferentes deveriam gerar erro")
            return False
        except ValueError:
            print("✅ Senhas diferentes - erro correto")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na criação de usuário: {e}")
        return False


def test_configuration():
    """Testa configuração do sistema"""
    print("\n🔍 Testando configuração...")
    
    try:
        from domcore.core.config import config
        
        # Verifica configurações básicas
        if config.environment:
            print(f"✅ Ambiente: {config.environment}")
        else:
            print("❌ Ambiente não configurado")
            return False
        
        if config.database:
            print(f"✅ Database: {config.database.host}:{config.database.port}")
        else:
            print("❌ Database não configurado")
            return False
        
        if config.security:
            print(f"✅ Security: {config.security.algorithm}")
        else:
            print("❌ Security não configurado")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na configuração: {e}")
        return False


async def run_all_tests():
    """Executa todos os testes"""
    print("🚀 Iniciando testes de instalação...")
    print("=" * 50)
    
    tests = [
        ("Importações", test_imports),
        ("Validação de CPF", test_cpf_validation),
        ("Receita Federal", test_receita_federal),
        ("Perfis de Usuário", test_user_profiles),
        ("Criação de Usuário", test_user_creation),
        ("Configuração", test_configuration),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if asyncio.iscoroutinefunction(test_func):
                result = await test_func()
            else:
                result = test_func()
            
            if result:
                passed += 1
            else:
                print(f"❌ Teste '{test_name}' falhou")
                
        except Exception as e:
            print(f"❌ Erro no teste '{test_name}': {e}")
    
    print("\n" + "=" * 50)
    print(f"📊 Resultados: {passed}/{total} testes passaram")
    
    if passed == total:
        print("🎉 Todos os testes passaram! Instalação OK!")
        return True
    else:
        print("❌ Alguns testes falharam. Verifique a instalação.")
        return False


if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1) 
