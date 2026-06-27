const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractFilters(message) {
  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are PlotBridge AI.

Extract search filters from the user's message.

Return ONLY valid JSON.

Example:

{
 "city": "",
 "category": "",
 "budget": null,
 "minArea": null,
 "maxArea": null
}

Budget must be in rupees.

If a field isn't mentioned, keep it null or empty.
`
      },
      {
        role: "user",
        content: message
      }
    ]
  });

  return JSON.parse(completion.choices[0].message.content);
}

module.exports = {
  extractFilters
};