export const SidebarItem = ({text, isActive, onClick }) => {
const itemClasses = `
    md:py-3 md:px-4 md:flex md:items-center md:cursor-pointer md:hover:bg-orange-200 md:hover:text-white md:rounded-md md:transition-colors md:duration-200
    ${isActive ? 'md:bg-orange-300 md:text-white' : ''}
`;

    // とりあえずtextで表示
    const renderIcon = () => {
        if (text === "おてつだい一覧") return <img src='/images/icon-task.png' className="h-12 w-12"/>;
        if (text === "おこづかい記録") return <img src='/images/icon-money.png'  className="h-12 w-12"/>;
        if (text === "設定") return <img src='/images/icon-setting.png'  className="h-12 w-12"/>;
        if (text === "ログアウト") return <img src="/images/icon-logout.png" className="h-12 w-12" />
        return "";
    };
    const getMobileConfig = () => {
        if (text === "おてつだい一覧") return { label: "一覧", bg: "bg-orange-200" };
        if (text === "おこづかい記録") return { label: "記録", bg: "bg-green-200" };
        if (text === "設定") return { label: "設定", bg: "bg-blue-200" };
        if (text === "ログアウト") return { label: "ログアウト", bg: "bg-red-200" };
        return { label: text, bg: "" };
    };
    return (
        <li className={`list-none ${itemClasses}`} onClick={onClick}>
            <span className="hidden md:inline md:mr-6 md:text-2xl">{renderIcon()}</span>
            <span className={`md:hidden text-[17px] font-semibold text-b px-1 py-2  rounded ${getMobileConfig().bg} writing-vertical-rl inline-block h-23 text-center mt-12 ml-1`}  style={{ userSelect: 'none', WebkitTapHighlightColor: 'transparent' }}>
                {getMobileConfig().label}  
            </span>
            <span className="hidden md:block text-3xl font-semibold text-black">
                {text}
            </span>
        </li>
    )
}


