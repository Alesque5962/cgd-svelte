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
    width: 3vw;
    padding: 1vh 0.5vw;
    margin-top: 5vh;
    margin-left: 30vw;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
</style>
