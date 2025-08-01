<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/config";
  import { chatMistral } from "$lib/cgd";

  let prompt = "";
  let question = "";
  let response = "";
  let loading = false;
  let error: string | null = null;

  async function handleSubmit() {
    if (!prompt.trim()) return;

    loading = true;

    try {
      question = prompt; // Store the question before sending
      response = await chatMistral(prompt);
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

<div class="chat-container">
  <form on:submit|preventDefault={handleSubmit}>
    <textarea
      bind:value={prompt}
      placeholder="Posez votre question..."
      rows="4"
      disabled={loading}
    ></textarea>
    <button id="submit" type="submit" disabled={loading || !prompt.trim()}>
      {loading ? "Envoi en cours..." : "Envoyer"}
    </button>
  </form>

  {#if error}
    <div class="error">
      <p>{error}</p>
    </div>
  {/if}

  {#if question}
    <div class="response">
      <h3>Votre question :</h3>
      <p>{question}</p>
    </div>
  {/if}

  {#if response}
    <div class="response">
      <h3>Réponse du Chat Mistral :</h3>
      <p>{response}</p>
    </div>
  {/if}
</div>

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
    width: 10vw;
    padding: 2vh 1vw;
    margin-top: 2.5vh;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  #submit {
    margin-top: 1vh;
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
