export const SidebarItem = ({text, isActive, onClick }) => {
    const itemClasses = `
        py-3 px-4 flex items-center cursor-pointer 
        hover:bg-orange-600 hover:text-white 
        rounded-md transition-colors duration-200
        ${isActive ? 'bg-orange-600 text-white' : ''} // <= isActive が true ならアクティブスタイル
    `;

    // とりあえずtextで表示
    const renderIcon = () => {
        if (text === "お手伝い一覧") return "📋";
        if (text === "おこづかい記録") return "💰";
        if (text === "設定") return "⚙️";
        return "";
    };
    return (
        <li className={itemClasses} onClick={onClick}>
            <span className="mr-3 text-xl">{renderIcon()}</span>
            <span className="font-semibold text-lg">{text}</span>
        </li>
    )
}


