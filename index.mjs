import * as dotenv from "dotenv";
import discord from "discord.js";
import puppeteer from 'puppeteer';
import { ChatGPTAPI, getOpenAIAuth } from 'chatgpt'

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;

const email = process.env.OPENAI_EMAIL;
const password = process.env.OPENAI_PASSWORD;

const {Client, GatewayIntentBits} = discord;

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
];

const client = new Client({intents});
client.login(token);

client.on("messageCreate", (message) => {
    if (!message.content.startsWith("GPT:")) {
        return;
    }

    (async () => {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ["--no-sandbox", "--exclude-switches", "enable-automation"],
                ignoreHTTPSErrors: true,
            });

            const openAIAuth = await getOpenAIAuth({
                email: email,
                password: password,
                browser: browser
            })

            const api = new ChatGPTAPI({ ...openAIAuth });
            await api.ensureAuth();
            const response = await api.sendMessage(message.content);

            for (let i = 0; i < response.length; i += 2000) {
                const toSend = response.substring(i, Math.min(response.length, i + 2000));
                message.reply({content: toSend});
            }
        } catch (e) {
            message.reply({content: e.message});
        }
    })();
});
