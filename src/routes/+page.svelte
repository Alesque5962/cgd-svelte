<script lang="ts">
  import { goto } from "$app/navigation";
  import { API_URL } from "$lib/config";
  import { onMount } from "svelte";

  let backend_status: { status: string } | undefined = undefined;

  onMount(async () => {
    // Check backend status
    const response = await fetch(`${API_URL}/health`);
    backend_status = await response.json();
    console.log("Backend status:", backend_status);
  });
</script>

<main>
  <button on:click={() => goto("/chat")}>Ecrire ma question</button>
  <button on:click={() => goto("/transcript")}>Dicter ma question</button>
</main>

<style>
  main {
    padding: 8vh;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  button {
    padding: 2vh 2vw;
    margin-left: 2vw;
    margin-right: 2vw;
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
</style>
