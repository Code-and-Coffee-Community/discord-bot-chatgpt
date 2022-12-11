import * as dotenv from "dotenv";
import discord from "discord.js";
import {ChatGPTAPI} from "chatgpt";

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const session = process.env.OPENAI_SESSION_TOKEN;
const logChannelId = process.env.LOG_CHANNEL_ID;

const {Client, GatewayIntentBits} = discord;

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
];

const client = new Client({intents});
client.login(token);

client.channels.fetch();

client.on("messageCreate", (message) => {
    if (!message.content.startsWith("GPT:")) {
        return;
    }

    (async () => {
        try {
            const api = new ChatGPTAPI({sessionToken: session});
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
