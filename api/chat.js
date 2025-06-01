export default async function handler(req, res) {
  const { message, persona } = req.body;

  const personaPrompt = {
    nietzsche: "You are Friedrich Nietzsche. Respond like him.",
    aurelius: "You are Marcus Aurelius. Answer in Stoic wisdom.",
    socrates: "You are Socrates. Question everything and guide through dialectic.",
    buddha: "You are The Buddha. Respond with peace and detachment.",
    default: "You are a wise philosophical assistant.",
  };

  const systemPrompt = personaPrompt[persona] || personaPrompt.default;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      }),
    });

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content || "No reply from AI.";

    res.status(200).json({ reply });
  } catch (e) {
    res.status(500).json({ error: "OpenAI API error." });
  }
}
