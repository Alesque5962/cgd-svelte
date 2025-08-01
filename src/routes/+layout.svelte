<script lang="ts">
  import { page } from "$app/state";
  import SummaryButton from "$lib/Summary_button.svelte";

  let { children } = $props();
</script>

<!-- {#if page.url.pathname !== "/"}
  <SummaryButton />
{:else}
  <div style="margin-top: 5vh;"></div>
{/if} -->
<SummaryButton />
<h1>C'est grave docteur ?</h1>

{@render children()}

<style>
  h1 {
    border: 0.3rem solid #333;
    text-align: center !important;
    color: #333;
    background-color: rgba(82, 78, 78, 0.068);
    padding: 1vh 2vw;
    margin-left: 38vw;
    margin-right: 38vw;
  }
</style>
