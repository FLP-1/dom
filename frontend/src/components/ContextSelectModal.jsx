/**
 * @fileoverview Modal de Seleção de Contexto (grupo/perfil)
 * @directory src/components
 * @description Modal para o usuário escolher grupo e papel ao acessar o sistema
 * @created 2024-12-19
 * @lastModified 2024-12-19
 * @author DOM Team
 */

import React from 'react'
import { Dialog, DialogTitle, DialogContent, Grid, Card, Typography, Avatar, Box, IconButton, Stack, Tooltip } from '@mui/material'
import { getProfileTheme } from '@/theme/profile-themes'
import CloseIcon from '@mui/icons-material/Close'
import LogoutIcon from '@mui/icons-material/Logout'
import { logoutAndGoHome } from '@/logout'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import WorkIcon from '@mui/icons-material/Work'
import HomeIcon from '@mui/icons-material/Home'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BusinessIcon from '@mui/icons-material/Business'
import GroupIcon from '@mui/icons-material/Group'

// Mapeamento de ícones por perfil
const profileIcons = {
  familiar: <FamilyRestroomIcon />,
  empregador: <HomeIcon />,
  empregado: <WorkIcon />,
  admin: <AdminPanelSettingsIcon />,
  parceiro: <BusinessIcon />,
  subordinado: <GroupIcon />,
  owner: <AdminPanelSettingsIcon />
}

const ContextSelectModal = ({ open, options, onSelect }) => {
  const [internalOpen, setInternalOpen] = React.useState(open)
  React.useEffect(() => { setInternalOpen(open) }, [open])

  const handleClose = () => setInternalOpen(false)

  return (
    <Dialog open={internalOpen} maxWidth="xs" fullWidth={false} onClose={handleClose} PaperProps={{ sx: { width: '60%', maxWidth: 400 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Selecione como deseja acessar
        <Box>
          <Tooltip title="Sair do sistema">
            <IconButton aria-label="Sair" onClick={logoutAndGoHome} size="small">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fechar">
            <IconButton aria-label="Fechar" onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {options.map(opt => (
            <Card
              key={opt.groupId + opt.role}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                cursor: 'pointer',
                border: `2px solid ${getProfileTheme(opt.profile).primaryColor}`,
                '&:hover': { boxShadow: 4 }
              }}
              onClick={() => onSelect(opt)}
              aria-label={`Selecionar grupo ${opt.groupName} como ${opt.role}`}
            >
              <Avatar sx={{ bgcolor: getProfileTheme(opt.profile).primaryColor, mr: 2 }}>
                {profileIcons[opt.profile] || <GroupIcon />}
              </Avatar>
              <Box>
                <Typography fontWeight={700}>{opt.groupName}</Typography>
                <Typography color="text.secondary">{opt.role}</Typography>
              </Box>
            </Card>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}

export default ContextSelectModal 