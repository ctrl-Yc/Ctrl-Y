import { Card } from "./Card"

export const Cards = ({ items, onItemClick, cardClassName = '' }) => {
    return (
        <div className="flex flex-grid flex-wrap justify-center mt-10 md:mt-30">
            {items.map((item) => (
                <Card
                    key={item.id}
                    title={item.title}
                    onClick={() => onItemClick(item)}
                    className={item.cardClassName || cardClassName}
                    icon={item.icon}
                />
            ))}
        </div>
    )
}
