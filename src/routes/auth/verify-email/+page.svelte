<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
</script>

<svelte:head>
	<title>Verify Email - HateSub</title>
</svelte:head>

<div class="space-y-6">
	<div class="text-center">
		<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
			<svg class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
			</svg>
		</div>
		<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
			Verify your email
		</h2>
		<p class="mt-2 text-center text-sm text-gray-600">
			We've sent a verification link to <strong>{data.user?.email}</strong>
		</p>
	</div>

	{#if data.error}
		<div class="rounded-md bg-red-50 p-4">
			<div class="text-sm text-red-700">
				{data.error}
			</div>
		</div>
	{/if}

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

	<div class="text-center space-y-4">
		<p class="text-sm text-gray-600">
			Please check your email and click the verification link to continue.
		</p>

		<div class="space-y-4">
			<p class="text-sm text-gray-500">
				Didn't receive the email? Check your spam folder or request a new one.
			</p>

			<form method="POST" action="?/resend" use:enhance>
				<button
					type="submit"
					class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 py-2 px-4 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Resend verification email
				</button>
			</form>
		</div>

		<div class="pt-4">
			<a
				href="/dashboard"
				class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
			>
				Continue to dashboard →
			</a>
		</div>
	</div>
</div>
