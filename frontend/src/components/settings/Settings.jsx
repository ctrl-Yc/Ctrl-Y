import { Cards } from "../ui/Cards"

export const Settings = ({ onSettingItemClick }) => {
 const settingItems = [
    { id: 'salary', title: '給与', icon: '/images/icon-money.png', cardClassName: 'w-12 h-12 md:w-20 md:h-20'},
    { id: 'notice', title: '通知', icon: '/images/icon-notice.png', cardClassName: 'w-12 h-12 md:w-20 md:h-20'},
    { id: 'account', title: 'アカウント', icon: '/images/icon-account.png', cardClassName: 'w-12 h-12 md:w-20 md:h-20'},
    { id: 'child', title: '子供', icon: '/images/icon-children.png', cardClassName: 'w-14 h-12 md:w-24 md:h-20'}
  ];

  // CardsからクリックされたときにTopに通知
  const handleClick = (itemId) => {
    if (onSettingItemClick) {
      onSettingItemClick(itemId);
    }
  };

  return (
      <div className="
        h-[800px] w-[400px] bg-[url('/images/mobile_note.png')] bg-no-repeat bg-center bg-[length:380px_700px] mt-5
        md:m-15 md:h-full md:w-full md:bg-[url('/images/note.png')] md:bg-no-repeat md:bg-[length:100%_100%] md:bg-center md:flex md:flex-col
      ">
        <h1 className="
          text-3xl font-bold p-4 -mt-6
          md:text-5xl md:p-30
        ">設定</h1>
        
          <Cards
            items={settingItems}
            onItemClick={(item) => handleClick(item.id)}
            className="-mt-20"
          />
      </div>
  )
}
