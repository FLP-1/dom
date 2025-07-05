#!/usr/bin/env python3
"""
Script para buscar estatísticas do dashboard do banco de dados

@fileoverview Script de estatísticas do dashboard
@directory domcore
@description Script Python para buscar estatísticas reais do banco de dados
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

# Ajuste temporário para permitir imports ao rodar diretamente
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
# TODO: Remover este bloco antes de subir para produção

import json
from datetime import datetime
from domcore.services.dashboard_service import DashboardService
from domcore.core.enums import UserProfile

def main():
    """Função principal do script"""
    # Redireciona stderr para stdout para capturar logs
    import sys
    sys.stderr = sys.stdout
    
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Uso: python get_dashboard_stats.py <profile> <user_id>"}))
        sys.exit(1)
    
    try:
        profile_str = sys.argv[1]
        user_id = sys.argv[2]
        
        # Converte string para enum
        try:
            profile = UserProfile(profile_str)
        except ValueError:
            print(json.dumps({"error": f"Perfil inválido: {profile_str}"}))
            sys.exit(1)
        
        # Busca estatísticas usando o serviço
        with DashboardService() as service:
            stats = service.get_dashboard_stats(user_id, profile)
        
        # Retorna apenas JSON válido
        result = json.dumps(stats, ensure_ascii=False, default=str)
        print(result)
        
    except Exception as e:
        print(json.dumps({"error": f"Erro interno: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main() 