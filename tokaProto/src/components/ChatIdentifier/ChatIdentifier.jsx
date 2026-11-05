import "./ChatIdentifier.css"

export default function ChatIdentifier({initials, name, chat_type, active, onClick}) {
    return (
        <>
            <button
                className={`conversation${active ? ' conversation--active' : ''}`}
                type="button"
                aria-pressed={active}
                onClick={onClick}
            >
                <span className="avatar">{initials}</span>
                <span className="conversation-copy">
                    <strong>{name}</strong>
                    <span>{chat_type}</span>
                </span>
                <time>Yesterday</time>
            </button>
        </>
    )
}