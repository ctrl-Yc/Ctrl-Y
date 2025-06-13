import { Card } from "./Card"

export const Cards = ({ items, onItemClick, cardClassName = '' }) => {
    return (
        <div>
            {items.map((item) => (
                <Card
                    key={item.id}
                    title={item.title}
                    onClick={() => onItemClick(item.path)}
                    className={cardClassName}
                />
            ))}
        </div>
    )
}
