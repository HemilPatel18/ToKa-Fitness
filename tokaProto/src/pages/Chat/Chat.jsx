import { useEffect, useRef, useState } from 'react'
import ChatIdentifier from '../../components/ChatIdentifier/ChatIdentifier'
import ChatMessage from '../../components/ChatMessage/ChatMessage'
import { ChevronRight } from '@boxicons/react'

import api, { backendUrl } from '../../api'

import './Chat.css'

export default function Chat() {
    const [message, setMessage] = useState('')
    const [chats, setChats] = useState([])
    const [users, setUsers] = useState([])
    const [selectedChatIndex, setSelectedChatIndex] = useState(0)
    const [isSocketReady, setIsSocketReady] = useState(false)
    const [isUserPickerOpen, setIsUserPickerOpen] = useState(false)
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    const [selectedUserEmails, setSelectedUserEmails] = useState([])
    const [isCreatingChat, setIsCreatingChat] = useState(false)
    const socketRef = useRef(null)
    const messageHistoryRef = useRef(null)

    const selectedChat = chats[selectedChatIndex] ?? chats[0]
    const currentUserEmail = localStorage.getItem('userEmail')

    async function handleNewMessageClick() {
        setIsUserPickerOpen((isOpen) => !isOpen)
        if (users.length > 0 || isLoadingUsers) {
            return
        }

        const userEmail = localStorage.getItem('userEmail')
        if (!userEmail) {
            return
        }

        setIsLoadingUsers(true)
        try {
            const response = await api.get('/auth/users', {
                params: { user_email: userEmail }
            })
            setUsers(response.data)
        } catch (error) {
            console.error(
                'Unable to load users:',
                error.response?.data || error.message
            )
        } finally {
            setIsLoadingUsers(false)
        }
    }

    async function handleSubmit(event) {
        event.preventDefault()

        const messageText = message.trim()
        const userEmail = localStorage.getItem('userEmail')
        if (!messageText || !selectedChat || !userEmail || !isSocketReady) {
            return
        }

        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            return
        }

        socketRef.current.send(JSON.stringify({ message: messageText }))
        setMessage('')
    }

    function toggleUserSelection(email) {
        setSelectedUserEmails((selectedEmails) => (
            selectedEmails.includes(email)
                ? selectedEmails.filter((selectedEmail) => selectedEmail !== email)
                : [...selectedEmails, email]
        ))
    }

    async function handleCreateChat() {
        const userEmail = localStorage.getItem('userEmail')
        if (!userEmail || selectedUserEmails.length === 0 || isCreatingChat) {
            return
        }

        setIsCreatingChat(true)
        try {
            const response = await api.post('/auth/chat', {
                user_email: userEmail,
                member_emails: selectedUserEmails
            })
            const createdChat = response.data
            const existingIndex = chats.findIndex((chat) => (
                chat.name === createdChat.name && chat.chat_type === createdChat.chat_type
            ))

            if (existingIndex >= 0) {
                setSelectedChatIndex(existingIndex)
            } else {
                setChats([...chats, createdChat])
                setSelectedChatIndex(chats.length)
            }
            setSelectedUserEmails([])
            setIsUserPickerOpen(false)
        } catch (error) {
            console.error(
                'Unable to create chat:',
                error.response?.data || error.message
            )
        } finally {
            setIsCreatingChat(false)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.replace('/auth')
            return
        }

        async function loadChats() {
            const userEmail = localStorage.getItem("userEmail")
            if (!userEmail) {
                console.error("No user email found in localStorage");
                return
            }

            try {
                const response = await api.get('/auth/chat', {
                    params: {
                        user_email: userEmail
                    }
                })

                setChats(response.data)
            } catch (error) {
                console.error(
                    "Unable to load chats:",
                    error.response?.data || error.message
                )
            }
        }

        loadChats()
    }, [])

    useEffect(() => {
        if (!selectedChat || !currentUserEmail) {
            return
        }

        const websocketProtocol = backend_url.startsWith('https') ? 'wss' : 'ws'
        const websocketHost = backend_url.replace(/^https?:\/\//, '')
        const websocket = new WebSocket(
            `${websocketProtocol}://${websocketHost}/auth/ws/chat?chat_name=${encodeURIComponent(selectedChat.name)}&user_email=${encodeURIComponent(currentUserEmail)}`
        )
        socketRef.current = websocket

        websocket.onopen = () => {
            setIsSocketReady(true)
        }

        websocket.onmessage = (event) => {
            const incomingMessage = JSON.parse(event.data)
            setChats((currentChats) => currentChats.map((chat, chatIndex) => (
                chatIndex === selectedChatIndex
                    ? { ...chat, messages: [...chat.messages, incomingMessage] }
                    : chat
            )))
        }

        websocket.onclose = () => {
            setIsSocketReady(false)
            if (socketRef.current === websocket) {
                socketRef.current = null
            }
        }

        return () => {
            setIsSocketReady(false)
            websocket.close()
            if (socketRef.current === websocket) {
                socketRef.current = null
            }
        }
    }, [selectedChat?.name, selectedChatIndex, currentUserEmail])

    useEffect(() => {
        const messageHistory = messageHistoryRef.current
        if (messageHistory) {
            messageHistory.scrollTop = messageHistory.scrollHeight
        }
    }, [selectedChatIndex, selectedChat?.messages?.length])

    return (
        <section className="chat-page">
            <div className="chat-shell">
                <aside className="conversation-panel">
                    <div className="conversation-heading">
                        <div>
                            <span className="eyebrow">Your space</span>
                            <h1>Messages</h1>
                        </div>
                        <button
                            className="icon-button"
                            type="button"
                            aria-label="Start a new message"
                            aria-expanded={isUserPickerOpen}
                            onClick={handleNewMessageClick}
                        >
                            +
                        </button>
                    </div>

                    {isUserPickerOpen && (
                        <div className="user-picker">
                            <strong>Start a conversation</strong>
                            {isLoadingUsers && <span className="user-picker__status">Loading users...</span>}
                            {!isLoadingUsers && users.length === 0 && (
                                <span className="user-picker__status">No other users found.</span>
                            )}
                            {!isLoadingUsers && users.map((user) => (
                                <label className="user-option" key={user.email}>
                                    <input
                                        className="user-option__checkbox"
                                        type="checkbox"
                                        checked={selectedUserEmails.includes(user.email)}
                                        onChange={() => toggleUserSelection(user.email)}
                                    />
                                    <span className="avatar avatar--small">{user.initials}</span>
                                    <span className="user-option__copy">
                                        <strong>{user.name}</strong>
                                        <span>{user.email}</span>
                                    </span>
                                </label>
                            ))}
                            <button
                                className="create-chat-button"
                                type="button"
                                disabled={selectedUserEmails.length === 0 || isCreatingChat}
                                onClick={handleCreateChat}
                            >
                                {isCreatingChat ? 'Creating...' : 'Create chat'}
                            </button>
                        </div>
                    )}

                    <label className="search-field">
                        <span aria-hidden="true">⌕</span>
                        <input type="search" placeholder="Search conversations" aria-label="Search conversations" />
                    </label>

                    <nav className="conversation-list" aria-label="Conversations">
                        {chats.map((chat, chatIndex) => (
                            <ChatIdentifier
                                key={`${chat.chat_type}-${chat.name}-${chatIndex}`}
                                initials={chat.initials}
                                name={chat.name}
                                chat_type={chat.chat_type}
                                active={chatIndex === selectedChatIndex}
                                onClick={() => setSelectedChatIndex(chatIndex)}
                            />
                        ))}
                    </nav>
                </aside>

                <div className="message-panel">
                    <header className="message-header">
                        <div className="profile-heading">
                            <span className="avatar avatar--large">{selectedChat?.initials}</span>
                            <div>
                                <h2>{selectedChat?.name ?? 'Select a conversation'}</h2>
                                <span className="online-status">
                                    <i />
                                    {selectedChat?.chat_type === 'group'
                                        ? `${selectedChat.members?.length ?? 0} members online`
                                        : 'Direct message'}
                                </span>
                            </div>
                        </div>
                        <button className="more-button" type="button" aria-label="More conversation options">•••</button>
                    </header>

                    <div className="message-history" ref={messageHistoryRef} aria-live="polite">
                        <div className="day-divider"><span>Today</span></div>
                        {selectedChat?.messages?.map((chatMessage, messageIndex) => (
                                <ChatMessage
                                    key={`chat-${selectedChatIndex}-message-${messageIndex}`}
                                    initials={chatMessage.initials}
                                    message={chatMessage.message}
                                    time={chatMessage.time}
                                    isOutgoing={chatMessage.user === currentUserEmail}
                                />
                            ))}
                        {/* <div className="message-row">
                                    <span className="avatar avatar--small">TC</span>
                                    <div className="message-content">
                                        <div className="message-bubble">Welcome to the ToKa Community! Share your wins, ask questions, and keep each other moving.</div>
                                        <time>10:38 AM</time>
                                    </div>
                                </div>
                                <div className="message-row">
                                    <span className="avatar avatar--small">TC</span>
                                    <div className="message-content">
                                        <div className="message-bubble">I completed my first week of morning workouts today. Feeling proud of the consistency!</div>
                                        <time>10:40 AM</time>
                                    </div>
                                </div>
                                <div className="message-row">
                                    <span className="avatar avatar--small">TC</span>
                                    <div className="message-content">
                                        <div className="message-bubble">That is brilliant progress. Keep showing up, one session at a time.</div>
                                        <time>10:42 AM</time>
                                    </div>
                                </div> */}
                    </div>

                    <form className="composer" onSubmit={handleSubmit}>
                        <button className="attach-button" type="button" aria-label="Attach a file">+</button>
                        <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a message..." aria-label="Message" disabled={!isSocketReady} />
                        <button className="send-button" type="submit" aria-label="Send message" disabled={!isSocketReady || !message.trim() || !selectedChat}><ChevronRight /></button>
                    </form>
                </div>
            </div>
        </section>
    )
}