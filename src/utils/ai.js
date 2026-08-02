export async function fetchAIInsights(codeA, codeB, results) {
  const apiKey = import.meta.env.VITE_HF_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_HF_API_KEY is not configured.");
  }

  const systemPrompt = "You are an expert computer scientist and competitive programming coach. Analyze the two provided code solutions and their actual execution times. Explain why one solution outperformed the other based on time complexity (Big O) and algorithmic approach. Structure your response strictly in Markdown using three headers: '### The Winner', '### Why it Won', and '### Approach Difference'. Keep it highly technical and concise.";
  
  const userPrompt = `
Solution A:
\`\`\`
${codeA}
\`\`\`

Solution B:
\`\`\`
${codeB}
\`\`\`

Execution Results Summary:
${JSON.stringify(results, null, 2)}
  `;

  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct:novita",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.1
      }),
    }
  );

  const result = await response.json();

  if (result.error) {
      throw new Error(result.error.message || result.error);
  }

  return result.choices[0].message.content;
}
