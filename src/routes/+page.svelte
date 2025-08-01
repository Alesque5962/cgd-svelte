<script>
  import { goto } from "$app/navigation";
  /* import Transcript from "$lib/Transcript.svelte";
  import Chat from "./Chat.svelte"; */
</script>

<main>
  <h1>C'est grave docteur ?</h1>
  <!-- <Chat /> -->
  <!-- <Transcript /> -->
  <button on:click={() => goto("/chat")}>Ecrire ma question</button>
  <button on:click={() => goto("/transcript")}>Dicter ma question</button>
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
