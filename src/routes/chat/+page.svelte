<script lang="ts">
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
      prompt = ""; // Reinitialise prompt after sending
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
    <button type="submit" disabled={loading || !prompt.trim()}>
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
    padding: clamp(1rem, 5vh, 4rem);
    max-width: var(--max-width);
  }

  textarea {
    width: 50%;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1rem;
    margin: 2vh auto 5vh auto;
    border-radius: 4px;
    border: 1px solid #ccc;
  }

  button {
    padding: clamp(0.5rem, 2vh, 1.5rem) clamp(1rem, 3vw, 2rem);
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: clamp(1rem, 2vw, 1.25rem);
    min-width: clamp(5rem, 50vw, 15rem);
  }

  button:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }

  button:disabled {
    background-color: var(--disabled-color);
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

  @media (max-width: 768px) {
    .chat-container {
      padding: var(--padding-mobile);
    }

    textarea {
      margin: 3.5vh auto 5vh auto;
    }

    button {
      width: 25%;
      margin: 0;
    }
  }
</style>
