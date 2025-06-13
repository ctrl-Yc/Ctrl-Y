import { Cards } from "./Cards"
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const navigate = useNavigate();

  const settingItems = [
    { id: 'money', title: '給与', path: '', icon: ''},
    { id: 'notice', title: '通知', path: '', icon: ''},
    { id: 'account', title: 'アカウント', path: '', icon: ''},
    { id: 'child', title: '子供', path: '', icon: ''},
  ];

  // Cardsコンポーネントから受け取るクリックハンドラ
  const handleSettingItemClick = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>設定</h1>
      <Cards
        items={settingItems}
        onItemClick={handleSettingItemClick}
        cardClassName="h-40"
      />
    </div>
  )
}
