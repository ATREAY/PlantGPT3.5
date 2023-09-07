import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import steps from './prompt.json' assert {type: "json"};

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // const response = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: `I want you to act as a Botanist and provide me steps to grow a particular plant. I will provide you with a plant name and your role is to generate stepwise info about how to grow a plant. My first request is:${prompt}`,
    //   // temperature: 0, // Higher values means the model will take more risks.
    //    max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
    //   // top_p: 1, // alternative to sampling with temperature, called nucleus sampling
    //   // frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
    //   // presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    // });

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "user", "content": `I want you to act as a Botanist and provide me steps to grow a particular plant. I will provide you with a plant name and your role is to generate stepwise info about how to grow a plant. Give me 7 steps. My first request is:${prompt}`}
      ],
      max_tokens: 1000,
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))