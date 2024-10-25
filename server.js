import { Telegraf } from 'telegraf';
import fetch from 'node-fetch';
import express from 'express'
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

// Replace with your Telegram bot token and ChatGPT API key
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

app.use(bodyParser.json());

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
bot.launch();
bot.start((ctx) => ctx.reply('Welcome! Ask me anything.'));

bot.on('text', async (ctx) => {
    
    const userMessage = ctx.message.text;
    console.log(userMessage)
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: userMessage }],
            }),
        });

        const data = await response.json();
        console.log(data)

        const reply = data.choices[0].message.content;
        
        ctx.reply(reply);
    } catch (error) {
        console.error('Error:', error);
         ctx.reply(error)
         ctx.reply('Sorry, I encountered an error. Please try again later.');
    }
});

const PORT = process.env.PORT 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});