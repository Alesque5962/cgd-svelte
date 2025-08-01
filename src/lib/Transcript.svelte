<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/config";
  import { chatMistral } from "../cgd.js";

  let media: any[] = [];
  let mediaRecorder: any = null;
  const formData = new FormData();
  let prompt = "";
  let response: Promise<string>;
  let loading = false;
  let error: string | null = null;
  let backend_status: { status: string } | undefined = undefined;

  onMount(async () => {
    // Check backend status
    /* console.log("API_URL = ", API_URL); */
    const response = await fetch(`${API_URL}/health`);
    backend_status = await response.json();

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
        console.log(`Envoi de la requête à ${API_URL}/voxtral`);
        const res = await fetch(`${API_URL}/voxtral`, {
          method: "POST",
          body: formData,
        });
        console.log("Réponse du serveur:", res);

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        console.log("Réponse du serveur Voxtral:", data);
        prompt = data.response;
        media = []; /* We reset our media array */

        response = await chatMistral(prompt);
        console.log("Réponse du serveur Chat Mistral :", response);
      } catch (err) {
        console.error("Erreur:", err);
        error =
          "Une erreur est survenue lors de la communication avec le serveur";
      }
    };
  }
</script>

{#if backend_status && backend_status.status == "ok"}
  <div>
    <section>
      <audio controls></audio>
      <button on:click={startRecording}>Record</button>
      <button on:click={stopRecording}>Stop</button>
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
{/if}

<style>
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
