<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	$: verifiedParam = $page.url.searchParams.get('verified');
</script>

<svelte:head>
	<title>Dashboard - HateSub</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Header -->
	<header class="bg-white shadow">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 justify-between items-center">
				<div class="flex items-center">
					<h1 class="text-xl font-semibold text-gray-900">HateSub Dashboard</h1>
				</div>
				<div class="flex items-center space-x-4">
					<span class="text-sm text-gray-700">Welcome, {data.user.username}!</span>
					<form method="POST" action="/auth/logout">
						<button
							type="submit"
							class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							Logout
						</button>
					</form>
				</div>
			</div>
		</div>
	</header>

	<!-- Main content -->
	<main class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			{#if verifiedParam === 'true'}
				<div class="mb-6 rounded-md bg-green-50 p-4">
					<div class="text-sm text-green-700">
						🎉 Your email has been verified successfully! Welcome to HateSub.
					</div>
				</div>
			{/if}

			<!-- Welcome section -->
			<div class="bg-white overflow-hidden shadow rounded-lg mb-6">
				<div class="px-4 py-5 sm:p-6">
					<h2 class="text-lg font-medium text-gray-900 mb-4">Welcome to HateSub</h2>
					<p class="text-gray-600 mb-4">
						Your subscription management dashboard is ready to help you track and manage all your subscriptions in one place.
					</p>
					
					<div class="flex items-center space-x-2 text-sm text-gray-500">
						<svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
						<span>Email verified</span>
					</div>
				</div>
			</div>

			<!-- Stats grid -->
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Total Subscriptions</dt>
									<dd class="text-lg font-medium text-gray-900">0</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Monthly Spend</dt>
									<dd class="text-lg font-medium text-gray-900">$0.00</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>

				<div class="bg-white overflow-hidden shadow rounded-lg">
					<div class="p-5">
						<div class="flex items-center">
							<div class="flex-shrink-0">
								<div class="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
									<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</div>
							</div>
							<div class="ml-5 w-0 flex-1">
								<dl>
									<dt class="text-sm font-medium text-gray-500 truncate">Upcoming Renewals</dt>
									<dd class="text-lg font-medium text-gray-900">0</dd>
								</dl>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Getting started section -->
			<div class="bg-white overflow-hidden shadow rounded-lg">
				<div class="px-4 py-5 sm:p-6">
					<h3 class="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
					<div class="prose text-gray-600">
						<p class="mb-4">
							Welcome to your subscription management dashboard! Here's how to get started:
						</p>
						<ol class="list-decimal list-inside space-y-2">
							<li>Add your first subscription by clicking the "Add Subscription" button</li>
							<li>Set up renewal notifications to never miss a payment</li>
							<li>Track your spending across all services</li>
							<li>Optimize your subscriptions to save money</li>
						</ol>
						<div class="mt-6">
							<button
								type="button"
								class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Add Your First Subscription
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>
