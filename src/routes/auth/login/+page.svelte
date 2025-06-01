<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { ActionData } from './$types';

	export let form: ActionData;

	$: resetSuccess = $page.url.searchParams.get('reset') === 'success';
	$: logoutSuccess = $page.url.searchParams.get('logout') === 'success';
</script>

<svelte:head>
	<title>Login - HateSub</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
			Sign in to your account
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Or
			<a href="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
				create a new account
			</a>
		</p>
	</div>

	<form method="POST" use:enhance class="space-y-6">
		{#if resetSuccess}
			<div class="rounded-md bg-green-50 p-4">
				<div class="text-sm text-green-700">
					Your password has been reset successfully. You can now sign in with your new password.
				</div>
			</div>
		{:else if logoutSuccess}
			<div class="rounded-md bg-green-50 p-4">
				<div class="text-sm text-green-700">
					You have been logged out successfully.
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
			<label for="password" class="block text-sm font-medium text-gray-700">
				Password
			</label>
			<div class="mt-1">
				<input
					id="password"
					name="password"
					type="password"
					autocomplete="current-password"
					required
					class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
				/>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<div class="text-sm">
				<a href="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
					Forgot your password?
				</a>
			</div>
		</div>

		<div>
			<button
				type="submit"
				class="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
			>
				Sign in
			</button>
		</div>
	</form>
</div>
