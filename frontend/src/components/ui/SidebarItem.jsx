export const SidebarItem = ({text, isActive, onClick }) => {
    const itemClasses = `
        py-3 px-4 flex items-center cursor-pointer 
        hover:bg-orange-200 hover:text-white 
        rounded-md transition-colors duration-200
        ${isActive ? 'bg-orange-300 text-white' : ''} // <= isActive が true ならアクティブスタイル
    `;

    // とりあえずtextで表示
    const renderIcon = () => {
        if (text === "おてつだい一覧") return <img src='/images/icon-task.png' className="h-12 w-12"/>;
        if (text === "おこづかい記録") return <img src='/images/icon-money.png'  className="h-12 w-12"/>;
        if (text === "設定") return <img src='/images/icon-setting.png'  className="h-12 w-12"/>;
        if (text === "ログアウト")
        return "";
    };
    return (
        <li className={itemClasses} onClick={onClick}>
            <span className="mr-6 text-2xl">{renderIcon()}</span>
            <span className="font-semibold text-3xl text-black">{text}</span>
        </li>
    )
}


