<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    // Redirect to login page after logout
    goto('/auth/login');
  });
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
  <div class="max-w-md w-full space-y-8">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-900">Signing out...</h2>
      <p class="text-gray-600">You are being redirected to the login page.</p>
    </div>
  </div>
</div>