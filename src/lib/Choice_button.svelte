<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";

  export let startRecording: () => void | Promise<void> = () => {};
  export let stopRecording: () => void | Promise<void> = () => {};
</script>

{#if page.url.pathname === "/"}
  <div class="buttons-container">
    <button on:click={() => goto("/chat")}>Ecrire ma question</button>
    <button on:click={() => goto("/transcript")}>Dicter ma question</button>
  </div>
{:else if page.url.pathname === "/transcript"}
  <div class="buttons-container">
    <button on:click={startRecording}>Démarrer</button>
    <button on:click={stopRecording}>Arrêter</button>
  </div>
{/if}

<style>
  .buttons-container {
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

  @media (max-width: 768px) {
    .buttons-container {
      flex-direction: column;
      align-items: center;
    }

    button {
      width: 25%;
      margin: 0;
    }
  }
</style>
