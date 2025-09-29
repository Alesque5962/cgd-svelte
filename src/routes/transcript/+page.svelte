<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/config";
  import { chatMistral } from "$lib/cgd";

  let media: any[] = [];
  let mediaRecorder: any = null;
  const formData = new FormData();
  let prompt = "";
  let response: Promise<string>;
  let loading = false;
  let error: string | null = null;

  onMount(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e: any) => media.push(e.data);
  });

  async function startRecording() {
    mediaRecorder.start();
  }

  async function stopRecording() {
    loading = true;
    error = null;

    mediaRecorder.stop();
    mediaRecorder.onstop = async function () {
      const audio = document.querySelector("audio");
      const audioBlob = new Blob(media, { type: "audio/mp3" });
      const file = new File([audioBlob], "audio.mp3", { type: "audio/mp3" });
      formData.append("audioFile", file, "audio.mp3");
      audio.src = window.URL.createObjectURL(audioBlob);

      try {
        const res = await fetch(`${API_URL}/voxtral`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        prompt = data.response;
        media = []; /* Reset media array */

        response = await chatMistral(prompt);
      } catch (err) {
        error =
          "Une erreur est survenue lors de la communication avec le serveur";
      }
    };
  }
</script>

<div class="transcript-container">
  <section>
    <audio controls></audio>
    <div class="recording">
      <button on:click={startRecording}>Démarrer</button>
      <button on:click={stopRecording}>Arrêter</button>
    </div>
  </section>

  {#if error}
    <div class="error">
      <p>{error}</p>
    </div>
  {/if}

  {#if prompt}
    <div class="response">
      <h3>Votre question formulée par le serveur Voxtral:</h3>
      <p>{prompt}</p>
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
  .transcript-container {
    padding: clamp(1rem, 5vh, 4rem);
    max-width: var(--max-width);
    margin: 8.6vh auto;
    width: 100%;
  }

  .recording {
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding: 1rem;
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
    .transcript-container {
      padding: var(--padding-mobile);
    }

    .recording {
      flex-direction: column;
      align-items: center;
    }

    button {
      width: 25%;
      margin: 0;
    }
  }
</style>
