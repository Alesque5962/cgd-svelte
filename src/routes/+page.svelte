<script>
  import Chat from "../lib/Chat.svelte";
  import { onMount } from "svelte";
  let media = [];
  let mediaRecorder = null;
  onMount(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => media.push(e.data);
    mediaRecorder.onstop = function () {
      const audio = document.querySelector("audio");
      const blob = new Blob(media, { type: "audio/ogg; codecs=opus" });
      media = []; /* We reset our media array */
      audio.src = window.URL.createObjectURL(blob);
    };
  });
  function startRecording() {
    mediaRecorder.start();
  }
  function stopRecording() {
    mediaRecorder.stop();
  }
</script>

<main>
  <h1>C'est grave docteur ?</h1>
  <Chat />

  <section>
    <audio controls></audio>
    <button on:click={startRecording}>Record</button>
    <button on:click={stopRecording}>Stop</button>
  </section>
</main>

<style>
  main {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
  }
</style>
