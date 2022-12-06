import * as dotenv from "dotenv";
import discord from "discord.js";
import { ChatGPTAPI } from 'chatgpt'

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const session = process.env.OPENAI_SESSION_TOKEN;
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
        const api = new ChatGPTAPI({ sessionToken: session })
        await api.ensureAuth()
        const response = await api.sendMessage(message.content)
        message.reply({content: response});
    })()
});
