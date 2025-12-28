const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function classifyIncident(description, location) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are an emergency dispatch AI assistant. Classify this incident and respond ONLY with valid JSON (no markdown, no backticks).

Incident: "${description}"
Location: ${location}

Provide classification in this exact JSON format:
{
  "severity": "low|medium|high|critical",
  "urgency": 1-10,
  "reasoning": "brief explanation",
  "recommendedUnits": ["police"|"fire"|"ambulance"],
  "estimatedResponseTime": "X minutes"
}`,
        },
      ],
    });

    const responseText = message.content[0].text.trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error("Invalid AI response format");
  } catch (error) {
    console.error("AI Classification Error:", error);
    // Fallback classification
    return {
      severity: "medium",
      urgency: 5,
      reasoning: "AI classification unavailable, using default",
      recommendedUnits: ["police"],
      estimatedResponseTime: "10 minutes",
    };
  }
}

module.exports = { classifyIncident };
