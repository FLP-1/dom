# TO DO

- [ ] Remover o ajuste temporário de sys.path no início de `domcore/get_dashboard_stats.py` antes de subir para produção.
  - Esse ajuste foi adicionado para permitir rodar o script diretamente durante o desenvolvimento local.
  - Para produção, utilize sempre `python -m domcore.get_dashboard_stats` ou configure corretamente o PYTHONPATH. 

## 🔧 Ajustes de Dependências

### Warning Passlib/bcrypt
- [ ] **Problema:** Warning `(trapped) error reading bcrypt version ... AttributeError: module 'bcrypt' has no attribute '__about__'`
- [ ] **Causa:** Passlib tenta acessar `bcrypt.__about__.__version__`, mas bcrypt 4.1.0+ removeu esse atributo
- [ ] **Status:** Não afeta funcionamento, apenas gera warning no log

#### Soluções:
- [ ] **Opção 1 - Downgrade (Recomendado para produção):**
  ```bash
  pip install 'bcrypt==4.0.1'
  ```
- [ ] **Opção 2 - Ignorar warning (Desenvolvimento):**
  - Warning não afeta segurança nem funcionamento
  - Pode ser ignorado até atualização do Passlib
- [ ] **Opção 3 - Aguardar correção oficial:**
  - Monitorar releases do Passlib para versão compatível com bcrypt 4.1.0+
  - Issue oficial: https://github.com/pyca/bcrypt/issues/684

#### Recomendações:
- **Produção:** Fazer downgrade do bcrypt para 4.0.1 (log limpo)
- **Desenvolvimento:** Pode ignorar o warning
- **Monitoramento:** Atualizar Passlib quando nova versão for lançada 