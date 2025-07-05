"""
Configuração de relacionamentos SQLAlchemy para DOM v1

@fileoverview Configuração de relacionamentos entre modelos
@directory domcore/models
@description Configuração de relacionamentos SQLAlchemy para evitar importações circulares
@created 2024-12-19
@lastModified 2024-12-19
@author Equipe DOM v1
"""

from sqlalchemy.orm import relationship

def configure_relationships():
    """
    Configura todos os relacionamentos SQLAlchemy após a importação de todos os modelos.
    Isso evita importações circulares.
    """
    
    # Importar modelos aqui para evitar importações circulares
    from .user import UserDB, UserSession, UserGroupRole
    from .group import Group
    
    # Relacionamentos para UserSession
    UserSession.user = relationship('UserDB', backref='sessions')
    UserSession.group = relationship('Group', backref='sessions')
    
    # Relacionamentos para UserGroupRole
    UserGroupRole.user = relationship('UserDB', backref='user_group_roles')
    UserGroupRole.group = relationship('Group', backref='user_group_roles')
    
    # Relacionamentos para UserDB
    UserDB.active_sessions = relationship('UserSession', 
                                         primaryjoin="and_(UserDB.id==UserSession.user_id, "
                                                    "UserSession.expires_at > func.now())",
                                         backref='active_user')
    
    # Relacionamentos para Group
    Group.active_users = relationship('UserGroupRole',
                                     primaryjoin="Group.id==UserGroupRole.group_id",
                                     backref='active_group') 