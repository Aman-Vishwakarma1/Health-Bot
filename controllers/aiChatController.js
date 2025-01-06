const session = require("express-session");
const { OpenAI } = require("openai");
require("dotenv").config();

const configuration = {
  apiKey: process.env.OPENAI_KEY,
  baseURL: process.env.AI_MODEL_BASE_URL,
  dangerouslyAllowBrowser: true,
};

const openai = new OpenAI(configuration);

exports.aiChat = async (req, res, next) => {
  const { prompt } = req.body;
  console.log(prompt);
  try {
    const { modelResult, modelPredictionAccuracy } = req.body;
    req.session.chatArr = [];
    const chatHistory = req.session.chatArr;
    const input = [
      {
        role: "system",
        content:
          "Just provide information regarding Parkinson Disease. You are a knowledgeable medical assistant specializing in Parkinson's disease. Provide accurate, up-to-date, and empathetic responses to user inquiries about Parkinson's disease, including symptoms, treatments, management strategies, and recent research findings. Ensure that all information is sourced from reputable medical literature and guidelines. a ai model tested Keep responses concise (50 words).",
      },
    ];

    chatHistory.forEach((msg) => {
      input.push({
        role: "assistant",
        content: msg,
      });
    });
    input.push({
      role: "user",
      content: prompt,
    });
    const completion = await openai.chat.completions.create({
      model: "pai-001",
      messages: input,
    });
    const response = completion.choices[0].message.content;
    const responseValidationKeyword = [
      "PD",
      "pd",
      "PARKINSON",
      "parkinson",
      "parkinson disease",
    ];
    const isValidResponse = responseValidationKeyword.some((word) => {
      return response.includes(word);
    });

    if (isValidResponse) {
      req.session.chatArr?.push(response);
      // return res.status(200).json(req.session.chatArr);
      return res.status(200).json(response);
    } else {
      return res.status(422).json({ message: "Invalid Prompt" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "error occured, Please try again !", err });
  }
};

exports.aiChatExit = async (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ message: "Exit Successfully" });
  });
};
