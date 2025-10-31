<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
</script>

{#if page.url.pathname !== "/"}
  <button on:click={() => goto("/")}>Menu</button>
{:else}
  <button style="visibility: hidden;" on:click={() => goto("/")}>Menu</button>
{/if}

<style>
  button {
    padding: clamp(0.25rem, 1vh, 0.75rem) clamp(0.5rem, 1.5vw, 1rem);
    font-size: clamp(1rem, 2vw, 1.25rem);
    min-width: 5rem;
    margin-top: 5vh;
    background-color: var(--primary-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  button:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }
</style>
