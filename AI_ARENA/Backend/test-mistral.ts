import { ChatMistralAI } from "@langchain/mistralai";
import config from "./src/config/config.js";

const model = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: config.MISTRAL_API_KEY,
});

const response = await model.invoke("Say hello");

console.log(response.content);