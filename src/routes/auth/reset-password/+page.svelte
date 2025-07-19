<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	let showPasswordRequirements = false;
</script>

<svelte:head>
	<title>Reset Password - HateSub</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
			Reset your password
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Enter your new password below.
		</p>
	</div>

	{#if data.error}
		<div class="rounded-md bg-red-50 p-4">
			<div class="text-sm text-red-700">
				{data.error}
			</div>
		</div>
	{/if}

	<form method="POST" use:enhance class="space-y-6">
		{#if form?.message}
			<div class="rounded-md bg-red-50 p-4">
				<div class="text-sm text-red-700">
					{form.message}
				</div>
			</div>
		{/if}

		<input type="hidden" name="token" value={data.token || ''} />

		<div>
			<label for="password" class="block text-sm font-medium text-gray-700">
				New password
			</label>
			<div class="mt-1">
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="new-password"
					required
					on:focus={() => showPasswordRequirements = true}
					class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				/>
			</div>
			{#if showPasswordRequirements}
				<p class="mt-1 text-xs text-gray-500">
					At least 8 characters with uppercase, lowercase, and number
				</p>
			{/if}
		</div>

		<div>
			<label for="confirmPassword" class="block text-sm font-medium text-gray-700">
				Confirm new password
			</label>
			<div class="mt-1">
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					autocomplete="new-password"
					required
					class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				/>
			</div>
		</div>

		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
			>
				Reset password
			</button>
		</div>

		<div class="text-center">
			<a href="/auth/login" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
				← Back to login
			</a>
		</div>
	</form>
</div>
