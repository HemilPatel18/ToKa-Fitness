import "./ChatMessage.css"

export default function ChatMessage({initials, message, time, isOutgoing}) {
    return (
        <>
            <div className={`message-row${isOutgoing ? ' message-row--outgoing' : ''}`}>
                <span className="avatar avatar--small">{initials}</span>
                <div className="message-content">
                    <div className="message-bubble">{message}</div>
                    <time>{time}</time>
                </div>
            </div>
        </>
    )
}