<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let showPasswordRequirements = false;
</script>

<svelte:head>
	<title>Register - HateSub</title>
</svelte:head>

<div class="space-y-6">
	<div>
		<h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">
			Create your account
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			Or
			<a href="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
				sign in to your existing account
			</a>
		</p>
	</div>

	<form method="POST" use:enhance class="space-y-6">
		{#if form?.message}
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
			<label for="username" class="block text-sm font-medium text-gray-700">
				Username
			</label>
			<div class="mt-1">
				<input
					id="username"
					name="username"
					type="text"
					autocomplete="username"
					required
					value={form?.username || ''}
					class="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
					placeholder="username"
				/>
			</div>
			<p class="mt-1 text-xs text-gray-500">
				3-31 characters, lowercase letters, numbers, hyphens, and underscores only
			</p>
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
				Confirm password
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
				Create account
			</button>
		</div>

		<div class="text-xs text-gray-500 text-center">
			By creating an account, you agree to our Terms of Service and Privacy Policy.
		</div>
	</form>
</div>
