import { API_URL } from "$lib/config";

let error: string | null = null;

export async function chatMistral(prompt: string) {
  try {
    const res = await fetch(`${API_URL}/chatMistral`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error(`Erreur ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    return data.response;
  } catch (err) {
    console.error("Erreur:", err);
    error = "Une erreur est survenue lors de la communication avec le serveur";
  }
}
