<script lang="ts">
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
</script>

{#if page.url.pathname !== "/"}
  <button onclick={() => goto("/")}>Menu</button>
{:else}
  <button style="visibility: hidden;" onclick={() => goto("/")}>Menu</button>
{/if}

<style>
  button {
    padding: clamp(0.25rem, 1vh, 0.75rem) clamp(0.5rem, 1.5vw, 1rem);
    font-size: clamp(1rem, 2vw, 1.25rem);
    min-width: 5rem;
    margin-top: 5vh;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
</style>
