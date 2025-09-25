export function Card({Children} : {Children: React.ReactNode}) {
    return (
        <div className="p-5 border">
            {Children}
        </div>
    )
}