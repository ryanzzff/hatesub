import { describe, test, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	test('should show redirecting message', () => {
		render(Page);
		expect(screen.getByText('Redirecting...')).toBeInTheDocument();
	});
});
