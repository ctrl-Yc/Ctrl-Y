import { Cards } from "../ui/Cards"

export const Settings = ({ onSettingItemClick }) => {
 const settingItems = [
    { id: 'salary', title: '給与', icon: '/images/icon-money.png', cardClassName: 'w-22 h-22 md:w-28 md:h-28 m-4 mx-auto'},
    { id: 'notice', title: '通知', icon: '/images/icon-notice.png', cardClassName: 'w-22 h-22 md:w-28 md:h-28 m-4 mx-auto'},
    { id: 'account', title: 'アカウント', icon: '/images/icon-account.png', cardClassName: 'w-22 h-22 md:w-28 md:h-28 m-4 mx-auto'},
    { id: 'child', title: '子供', icon: '/images/icon-children.png', cardClassName: 'w-30 h-24 md:w-36 md:h-30 m-2 mb-4 mx-auto'}
  ];

  // CardsからクリックされたときにTopに通知
  const handleClick = (itemId) => {
    if (onSettingItemClick) {
      onSettingItemClick(itemId);
    }
  };

  return (
      <div className="bg-orange-100 w-full h-full rounded-xl">
        <h1 className="text-3xl font-bold text-center pt-6 mx-auto md:text-5xl md:pt-10">設定</h1>
        
          <Cards
            items={settingItems}
            onItemClick={(item) => handleClick(item.id)}
            cardClassName=""
          />
      </div>
  )
}
