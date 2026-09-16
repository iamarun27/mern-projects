import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";

// export async function sendMessage(req, res) {

//     const { message, chat: chatId } = req.body;


//     let title = null, chat = null;

//     if (!chatId) {
//         title = await generateChatTitle(message);
//         chat = await chatModel.create({
//             user: req.user.id,
//             title
//         })
//     }

//     const userMessage = await messageModel.create({
//         chat: chatId || chat._id,
//         content: message,
//         role: "user"
//     })

//     const messages = await messageModel.find({ chat: chatId || chat._id })

//     const result = await generateResponse(messages);

//     const aiMessage = await messageModel.create({
//         chat: chatId || chat._id,
//         content: result,
//         role: "ai"
//     })


//     res.status(201).json({
//         title,
//         chat,
//         aiMessage
//     })

// }

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        console.log("1. Message received:", message);
        console.log("2. Chat ID:", chatId);

        let title = null, chat = null;

        if (!chatId) {
            console.log("3. Generating chat title...");

            title = await generateChatTitle(message);

            console.log("4. Title generated:", title);

            chat = await chatModel.create({
                user: req.user.id,
                title
            });

            console.log("5. Chat created:", chat._id);
        }

        const userMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: message,
            role: "user"
        });

        console.log("6. User message saved");

        const messages = await messageModel.find({
            chat: chatId || chat._id
        });

        console.log("7. Messages fetched:", messages.length);

        console.log("8. Generating AI response...");

        const result = await generateResponse(messages);

        console.log("9. AI response generated");

        const aiMessage = await messageModel.create({
            chat: chatId || chat._id,
            content: result,
            role: "ai"
        });

        console.log("10. AI message saved");

        res.status(201).json({
            title,
            chat,
            aiMessage
        });

    } catch (error) {
        console.error("CHAT ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to process message",
            error: error.message
        });
    }
}

export async function getChats(req, res) {
    const user = req.user

    const chats = await chatModel.find({ user: user.id })

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    })
}

export async function getMessages(req, res) {
    const { chatId } = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat: chatId
    })

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req, res) {

    const { chatId } = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    await messageModel.deleteMany({
        chat: chatId
    })

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}