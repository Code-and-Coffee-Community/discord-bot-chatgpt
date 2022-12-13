import * as dotenv from "dotenv";
import discord, {Message} from "discord.js";
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

            const completion = response.data.choices[0].text;

            for (let i = 0; i < completion.length; i += 2000) {
                const toSend = completion.substring(i, Math.min(completion.length, i + 2000));
                message.reply({content: toSend});
            }
        } catch (e) {
            message.reply({content: `Bei der Anfrage an OpenAI ist ein Fehler aufgetreten. Bitte probiere es später nochmals.`});
        }
    })();
});
