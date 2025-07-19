<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<svelte:head>
	<title>Forgot Password - HateSub</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
			Reset your password
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Enter your email address and we'll send you a link to reset your password.
		</p>
	</div>

	<form method="POST" use:enhance class="space-y-6">
		{#if form?.success}
			<div class="rounded-md bg-green-50 p-4">
				<div class="text-sm text-green-700">
					{form.message}
				</div>
			</div>
		{:else if form?.message}
			<div class="rounded-md bg-red-50 p-4">
				<div class="text-sm text-red-700">
					{form.message}
				</div>
			</div>
		{/if}

		<div>
			<label for="email" class="block text-sm font-medium text-gray-700">
				Email address
			</label>
			<div class="mt-1">
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.email || ''}
					class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="you@example.com"
				/>
			</div>
		</div>

		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
			>
				Send reset link
			</button>
		</div>

		<div class="text-center">
			<a href="/auth/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
				← Back to login
			</a>
		</div>
	</form>
</div>
