export async function fetchAIInsights(codeA, codeB, results) {
  const response = await fetch("/api/insights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codeA, codeB, results })
  });
  
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  
  return data.insights;
}
