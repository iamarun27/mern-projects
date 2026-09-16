import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setError, setLoading, createNewChat, addNewMessage, addMessages } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {

    const dispatch = useDispatch()


    // async function handleSendMessage({ message, chatId }) {
    //     dispatch(setLoading(true))
    //     const data = await sendMessage({ message, chatId })
    //     const { chat, aiMessage } = data
    //     if (!chatId)
    //         dispatch(createNewChat({
    //             chatId: chat._id,
    //             title: chat.title,
    //         }))
    //     dispatch(addNewMessage({
    //         chatId: chatId || chat._id,
    //         content: message,
    //         role: "user",
    //     }))
    //     dispatch(addNewMessage({
    //         chatId: chatId || chat._id,
    //         content: aiMessage.content,
    //         role: aiMessage.role,
    //     }))
    //     dispatch(setCurrentChatId(chat._id))
    // }

//     async function handleSendMessage({ message, chatId }) {
//     try {
//         dispatch(setLoading(true))

//         const data = await sendMessage({ message, chatId })

//         const { chat, aiMessage } = data

//         if (!chatId) {
//             dispatch(createNewChat({
//                 chatId: chat._id,
//                 title: chat.title,
//             }))
//         }

//         dispatch(addNewMessage({
//             chatId: chatId || chat._id,
//             content: message,
//             role: "user",
//         }))

//         dispatch(addNewMessage({
//             chatId: chatId || chat._id,
//             content: aiMessage.content,
//             role: aiMessage.role,
//         }))

//         dispatch(setCurrentChatId(chatId || chat._id))

//     } catch (error) {
//         console.error(
//             "Send message failed:",
//             error.response?.data || error.message
//         )

//         dispatch(setError(
//             error.response?.data?.message || "Failed to send message"
//         ))
//     } finally {
//         dispatch(setLoading(false))
//     }
// }

async function handleSendMessage({ message, chatId }) {
    try {
        console.log("1. handleSendMessage called", {
            message,
            chatId
        });

        dispatch(setLoading(true));

        console.log("2. Calling sendMessage API");

        const data = await sendMessage({ message, chatId });

        console.log("3. API response:", data);

        const { chat, aiMessage } = data;

        if (!chatId) {
            dispatch(createNewChat({
                chatId: chat._id,
                title: chat.title,
            }));
        }

        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: message,
            role: "user",
        }));

        dispatch(addNewMessage({
            chatId: chatId || chat._id,
            content: aiMessage.content,
            role: aiMessage.role,
        }));

        dispatch(setCurrentChatId(chatId || chat._id));

    } catch (error) {
        console.error(
            "4. Send message failed:",
            error.response?.data || error.message
        );

        dispatch(setError(
            error.response?.data?.message || "Failed to send message"
        ));

    } finally {
        dispatch(setLoading(false));
    }
}




    async function handleGetChats() {
        dispatch(setLoading(true))
        const data = await getChats()
        const { chats } = data
        dispatch(setChats(chats.reduce((acc, chat) => {
            acc[ chat._id ] = {
                id: chat._id,
                title: chat.title,
                messages: [],
                lastUpdated: chat.updatedAt,
            }
            return acc
        }, {})))
        dispatch(setLoading(false))
    }

    async function handleOpenChat(chatId, chats) {

        console.log(chats[ chatId ]?.messages.length)

        if (chats[ chatId ]?.messages.length === 0) {
            const data = await getMessages(chatId)
            const { messages } = data

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role,
            }))

            dispatch(addMessages({
                chatId,
                messages: formattedMessages,
            }))
        }
        dispatch(setCurrentChatId(chatId))
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat
    }

}