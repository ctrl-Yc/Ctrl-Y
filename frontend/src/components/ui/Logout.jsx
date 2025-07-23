import { useNavigate } from 'react-router-dom'
import { SidebarItem } from './SidebarItem' 
import { clearTokens } from '../../config/Token'

export const LogoutItem = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearTokens()
    navigate('/')
  }

  return (
    <SidebarItem
      icon="logout"
      text="ログアウト"
      isActive={false}
      onClick={handleLogout}
    />
  )
}
