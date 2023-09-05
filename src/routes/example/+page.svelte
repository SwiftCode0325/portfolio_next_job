<script>
  export let data

  const items = data.jobs.items

</script>

{#each items as job, index}
<h1>
{job.title}
</h1>
{/each}