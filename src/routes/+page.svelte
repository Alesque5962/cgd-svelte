<script lang="ts">
  import { API_URL } from "$lib/config";
  import { onMount } from "svelte";
  import ChoiceButton from "$lib/Choice_button.svelte";

  let backend_status: { status: string } | undefined = undefined;

  onMount(async () => {
    const response = await fetch(`${API_URL}/health`);
    backend_status = await response.json();
  });
</script>

<main>
  <ChoiceButton />
</main>

<style>
  main {
    padding: clamp(1rem, 5vh, 4rem);
    max-width: var(--max-width);
    margin: 15vh auto;
    width: 100%;
  }

  @media (max-width: 768px) {
    main {
      padding: var(--padding-mobile);
    }
  }
</style>
