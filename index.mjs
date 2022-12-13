import * as dotenv from "dotenv";
import discord from "discord.js";
import { ChatGPTAPI, getOpenAIAuth } from 'chatgpt'

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const logChannelId = process.env.DISCORD_LOG_CHANNEL_ID;

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
            const openAIAuth = await getOpenAIAuth({
                email: email,
                password: password
            })

            const api = new ChatGPTAPI({ ...openAIAuth });
            await api.ensureAuth();
            const response = await api.sendMessage(message.content);

            for (let i = 0; i < response.length; i += 2000) {
                const toSend = response.substring(i, Math.min(response.length, i + 2000));
                message.reply({content: toSend});
            }
        } catch (e) {
            client.channels.fetch(logChannelId).then((channel) => {
                channel.send({content: e.message});
            });
        }
    })();
});
