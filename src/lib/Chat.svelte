<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/config";

  let prompt = "";
  let response = "";
  let loading = false;
  let error: string | null = null;
  let backend_status: { status: string } | undefined = undefined;

  onMount(async () => {
    // Check backend status
    /* console.log("API_URL = ", API_URL); */
    const response = await fetch(`${API_URL}/health`);
    backend_status = await response.json();
    /* console.log("Backend status:", backend_status);
    if (backend_status && backend_status.status == "ok") {
      console.log("Backend is running and healthy.");
    } else {
      console.error("Backend is not healthy:", backend_status);
      error = "Le backend n'est pas disponible. Veuillez réessayer plus tard.";
    } */
  });

  async function handleSubmit() {
    if (!prompt.trim()) return;

    loading = true;
    error = null;

    try {
      console.log(`Envoi de la requête à ${API_URL}/chatMistral`);
      const res = await fetch(`${API_URL}/chatMistral`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      console.log("Réponse du serveur:", res);
      console.log("Corps de la requête:", JSON.stringify({ prompt }));

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${await res.text()}`);
      }

      const data = await res.json();
      console.log("Réponse du serveur:", data);
      response = data.response;
      prompt = ""; // Réinitialise le prompt après l'envoi
    } catch (err) {
      console.error("Erreur:", err);
      error =
        "Une erreur est survenue lors de la communication avec le serveur";
    } finally {
      loading = false;
    }
  }
</script>

{#if backend_status && backend_status.status == "ok"}
  <div class="chat-container">
    <form on:submit|preventDefault={handleSubmit}>
      <textarea
        bind:value={prompt}
        placeholder="Posez votre question..."
        rows="4"
        disabled={loading}
      ></textarea>
      <button type="submit" disabled={loading || !prompt.trim()}>
        {loading ? "Envoi en cours..." : "Envoyer"}
      </button>
    </form>

    {#if error}
      <div class="error">
        <p>{error}</p>
      </div>
    {/if}

    {#if response}
      <div class="response">
        <h3>Réponse:</h3>
        <p>{response}</p>
      </div>
    {/if}
  </div>
{/if}

<style>
  .chat-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    resize: vertical;
  }

  button {
    padding: 10px 20px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover:not(:disabled) {
    background-color: #45a049;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .response,
  .error {
    margin-top: 20px;
    padding: 15px;
    border-radius: 4px;
  }

  .response {
    background-color: #f5f5f5;
  }

  .error {
    background-color: #ffebee;
    color: #c62828;
  }
</style>
