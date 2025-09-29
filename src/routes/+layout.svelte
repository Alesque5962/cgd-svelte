<script lang="ts">
  import "../app.css";
  import SummaryButton from "$lib/Summary_button.svelte";
</script>

<div class="layout">
  <SummaryButton />
  <h1>C'est grave docteur ?</h1>
  <slot />
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
    border: 0.3rem solid #333;
    border-radius: 4px;
    text-align: center;
    font-size: clamp(1.5rem, 5vw, 3rem);
    background-color: rgba(82, 78, 78, 0.068);
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
