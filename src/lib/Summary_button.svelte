<script>
  import { goto } from "$app/navigation";
</script>

<!-- <button on:click={() => goto("/")}><img src="frontend/assets/img/return.jpg"></button> -->
<button on:click={() => goto("/")}>Menu</button>

<!-- <input
  on:click={() => goto("/")}
  type="image"
  id="image"
  alt="icone"
  src="/frontend/assets/img/return.jpg"
/> -->

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
