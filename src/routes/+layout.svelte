<script lang="ts">
  import "../app.css";
  import SummaryButton from "$lib/Summary_button.svelte";

  let { children } = $props();
</script>

<div class="layout">
  <SummaryButton />
  <h1>C'est grave docteur ?</h1>
  {@render children()}
</div>

<style>
  .layout {
    min-height: 100vh;
    width: 100%;
    max-width: var(--max-width);
    margin: 0 auto;
    padding: clamp(1rem, 5vh, 2rem);
    text-align: center;
  }

  h1 {
    border: none;
    border-radius: 8px;
    text-align: center;
    font-size: clamp(1.5rem, 5vw, 3rem);
    background-color: var(--primary-color);
    margin: 5vh 15vw 0vh 15vw;
  }

  @media (max-width: 768px) {
    .layout {
      padding: var(--padding-mobile);
    }

    h1 {
      margin: 5vh 15vw 0vh 15vw;
    }
  }
</style>
