<script lang="ts">
  import { goto } from "$app/navigation";
  import { API_URL } from "$lib/config";
  import { onMount } from "svelte";

  let backend_status: { status: string } | undefined = undefined;

  onMount(async () => {
    const response = await fetch(`${API_URL}/health`);
    backend_status = await response.json();
  });
</script>

<main>
  <div class="buttons-container">
    <button on:click={() => goto("/chat")}>Ecrire ma question</button>
    <button on:click={() => goto("/transcript")}>Dicter ma question</button>
  </div>
</main>

<style>
  main {
    padding: clamp(1rem, 5vh, 4rem);
    max-width: var(--max-width);
    margin: 0 auto;
    width: 100%;
  }

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
    min-width: 200px;
  }

  button:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }

  button:disabled {
    background-color: var(--disabled-color);
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    main {
      padding: var(--padding-mobile);
    }

    .buttons-container {
      flex-direction: column;
      align-items: stretch;
    }

    button {
      width: 100%;
      margin: 0;
    }
  }
</style>
