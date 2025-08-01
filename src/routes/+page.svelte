<script>
  import Transcript from "$lib/Transcript.svelte";
  import Chat from "../lib/Chat.svelte";
</script>

<main>
  <h1>C'est grave docteur ?</h1>
  <!-- <Chat /> -->
  <Transcript />
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
