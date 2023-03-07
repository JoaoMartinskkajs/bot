import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { io } from 'socket.io-client';
import express from 'express';

const socket = io("https://vizionserver.onrender.com");

const app = express();

const token = process.env.TOKEN;
if(!token){
    throw new Error("Missing Token");
};

interface MessageBody{
    update: {
        update_id: number,
        message: {
            message_id: number,
            from: {
                id: number,
                is_bot: boolean,
                first_name: string,
                language_code: string
            },
            chat: {
                id: number,
                title: string,
                type: string,
                all_members_are_administrators: boolean
            },
            date: number,
            text?: string,
            entities: []
        }
    }
};

try{
    const bot = new Telegraf(token);
    
    const DoubleChatId = -806141861;
    const MinesChatId = -892180024;
    const CrashChatId = -877692774;
    
    bot.on('message', async (ctx) => {
    
        const msg = ctx as unknown as MessageBody
    
        const MessageID = msg.update.message.from.id;
        const CloneID = process.env.CLONEID as number | unknown;
        const ChatID = msg.update.message.chat.id;
    
        function sendSignal(){
             socket.emit('signal', msg.update.message.text)
        };
        
        if(MessageID == CloneID){
            ChatID == DoubleChatId && sendSignal()
        };
    });
    
    bot.launch({
        webhook:{
            domain: "https://vizionserver.onrender.com",
            port: 10001
        }
    });
    console.log('Running');

    app.get('/', (req, res) => {
        res.sendStatus(200)
    });

    app.listen(process.env.PORT)
}

catch(err){
    console.log(err)
}