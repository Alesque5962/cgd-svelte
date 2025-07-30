<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/config";

  let media: any[] = [];
  let mediaRecorder: any = null;
  const formData = new FormData();
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

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e: any) => media.push(e.data);
    /* mediaRecorder.onstop = function () {
      const audio = document.querySelector("audio");
      const blob = new Blob(media, { type: "audio/ogg; codecs=opus" });
      media = []; We reset our media array
      audio.src = window.URL.createObjectURL(blob);
    }; */

    /* console.log("Backend status:", backend_status);
    if (backend_status && backend_status.status == "ok") {
      console.log("Backend is running and healthy.");
    } else {
      console.error("Backend is not healthy:", backend_status);
      error = "Le backend n'est pas disponible. Veuillez réessayer plus tard.";
    } */
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
        console.log(`Envoi de la requête à ${API_URL}/whisper`);

        /* const audioBlob = new Blob(this.recordedChunks, { type: "audio/mp3" }); */
        /* const formData = new FormData();
      const file = new File([audioBlob], "audio.mp3", { type: "audio/mp3" });
      formData.append("file", file, "audio.mp3"); */
        /* formData.append("model", "whisper-1"); */

        const res = await fetch(`${API_URL}/whisper`, {
          method: "POST",
          /* headers: {
            "Content-Type": "multipart/form-data",
          }, */
          body: formData,
        });
        console.log("Réponse du serveur:", res);
        /* console.log("Corps de la requête:", JSON.stringify({ prompt })); */

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${await res.text()}`);
        }

        const data = await res.json();
        console.log("Réponse du serveur:", data);
        response = data.response;
        media = []; /* We reset our media array */
      } catch (err) {
        console.error("Erreur:", err);
        error =
          "Une erreur est survenue lors de la communication avec le serveur";
      } finally {
        loading = false;
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

    {#if response}
      <div class="response">
        <h3>Réponse:</h3>
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
