import * as dotenv from "dotenv";
import discord from "discord.js";
import { ChatGPTAPIBrowser } from 'chatgpt'

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
            // const api = new ChatGPTAPIBrowser({
            //     email: email,
            //     password: password,
            // });
            // await api.initSession();
            // const response = await api.sendMessage(message.content);

            // for (let i = 0; i < response.length; i += 2000) {
            //     const toSend = response.substring(i, Math.min(response.length, i + 2000));
            //     message.reply({content: toSend});
            // }
            message.reply({content: "Aktuell ist der ChatGPT Bot leider im Wartungsmodus, da Microsoft die externe Nutzung blockiert. Sobald es eine offizielle Schnittstelle gibt, werden wir diese anbinden. Danke für eure Geduld! :)"});
        } catch (e) {
            message.reply({content: e.message});
        }
    })();
});
