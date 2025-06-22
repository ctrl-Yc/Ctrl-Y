import { Cards } from "./Cards"

export const Settings = ({ onSettingItemClick }) => {
 const settingItems = [
    { id: 'salary', title: '給与', icon: ''},
    { id: 'notice', title: '通知', icon: ''},
    { id: 'account', title: 'アカウント', icon: ''},
    { id: 'child', title: '子供', icon: ''},
  ];

  // CardsからクリックされたときにTopに通知
  const handleClick = (itemId) => {
    if (onSettingItemClick) {
      onSettingItemClick(itemId);
    }
  };

  return (
    <div>
      <h1>設定</h1>
      <Cards
        items={settingItems}
        onItemClick={(item) => handleClick(item.id)}
        cardClassName="h-40"
      />
    </div>
  )
}
