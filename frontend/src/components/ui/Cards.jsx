import { Card } from "./Card"

export const Cards = ({ items, onItemClick, cardClassName = '' }) => {
    return (
        <div className="flex flex-wrap justify-center mt-90">
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
