import * as dotenv from "dotenv";
import discord from "discord.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiOrganization = process.env.OPENAI_ORGANIZATION_ID;

const {Client, GatewayIntentBits} = discord;

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
];

const openaiApiConfiguration = new Configuration({
    organization: openaiOrganization,
    apiKey: openaiApiKey
});
const openai = new OpenAIApi(openaiApiConfiguration);

const client = new Client({intents});
client.login(token);

client.on("messageCreate", (message) => {
    if (!message.content.startsWith("GPT:")) {
        return;
    }

    (async () => {
        try {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: message.content,
            });

            for (let i = 0; i < response.length; i += 2000) {
                const toSend = response.substring(i, Math.min(response.length, i + 2000));
                message.reply({content: toSend});
            }
        } catch (e) {
            console.log(e);
            message.reply({content: e.message});
        }
    })();
});
