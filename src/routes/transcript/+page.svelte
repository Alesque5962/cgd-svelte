<script lang="ts">
  import { onMount } from "svelte";
  import { API_URL } from "$lib/config";
  import { chatMistral } from "$lib/cgd";
  import ChoiceButton from "$lib/Choice_button.svelte";

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
    <ChoiceButton {startRecording} {stopRecording} />
  </section>

  {#if error}
    <div class="error">
      <p>{error}</p>
    </div>
  {/if}

  {#if prompt}
    <div class="response">
      <h3 id="h3-prompt">Votre question formulée par le serveur Voxtral:</h3>
      <p id="voxral-prompt">{prompt}</p>
    </div>
  {/if}

  {#if response}
    <div class="response">
      <h3 id="h3-response">Réponse du Chat Mistral :</h3>
      <p id="mistral-response">{response}</p>
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

    audio {
      margin-bottom: -0.4rem;
    }
  }
</style>
