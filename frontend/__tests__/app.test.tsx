import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '@/app/page';
import { shortenUrl } from "../src/lib/api";

// Jest will automatically replace the exported functions with mock functions.
jest.mock('../src/lib/api');
// This gives you type safety and autocompletion for mock methods.
const mockShortenUrl = shortenUrl as jest.Mock;

describe('URL Shortener App', () => {

    beforeEach(() => {
        mockShortenUrl.mockClear();
    });


    test('renders main elements', () => {
        render(<Home />);

        const nanoLinkElements = screen.getAllByText('NanoLink');
        expect(nanoLinkElements[0]).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Paste your long URL here...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /shorten/i })).toBeInTheDocument();
    });

    test('button is disabled when input is empty', () => {
        render(<Home />);

        const button = screen.getByRole('button', { name: /shorten/i });
        expect(button).toBeDisabled();
    });

    test('button is enabled when URL is entered', async () => {
        const user = userEvent.setup();
        render(<Home />);

        const input = screen.getByPlaceholderText('Paste your long URL here...');
        const button = screen.getByRole('button', { name: /shorten/i });

        await user.type(input, 'https://youtube.com');
        expect(button).toBeEnabled();
    });

    test('shortens URL successfully', async () => {
        const user = userEvent.setup();
        mockShortenUrl.mockResolvedValue({ short_url: 'https://nano_link.io/abc123' });

        render(<Home />);

        const input = screen.getByPlaceholderText('Paste your long URL here...');
        const button = screen.getByRole('button', { name: /shorten/i });

        await user.type(input, 'https://example.com/long-url');
        await user.click(button);

        // // Check loading state
        // await waitFor(() => {
        //     expect(screen.getByText('Shortening...')).toBeInTheDocument();
        // });

        // Check result
        await waitFor(() => {
            expect(screen.getByText('Your shortened URL:')).toBeInTheDocument();
            expect(screen.getByText('https://nano_link.io/abc123')).toBeInTheDocument();
        });

        expect(mockShortenUrl).toHaveBeenCalledWith('https://example.com/long-url');
    });

    test('handles API error', async () => {
        const user = userEvent.setup();
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        mockShortenUrl.mockRejectedValue(new Error('API Error'));

        render(<Home />);

        const input = screen.getByPlaceholderText('Paste your long URL here...');
        const button = screen.getByRole('button', { name: /shorten/i });

        await user.type(input, 'https://example.com');
        await user.click(button);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Error shortening URL');
        });

        alertSpy.mockRestore();
    });

    test('copies shortened URL to clipboard', async () => {
        const user = userEvent.setup();
        mockShortenUrl.mockResolvedValue({ short_url: 'https://nano_link.io/abc123' });

        render(<Home />);

        // First shorten a URL
        const input = screen.getByPlaceholderText('Paste your long URL here...');
        await user.type(input, 'https://example.com');
        await user.click(screen.getByRole('button', { name: /shorten/i }));

        await waitFor(() => {
            expect(screen.getByText('https://nano_link.io/abc123')).toBeInTheDocument();
        });

        // Then copy it
        const copyButton = screen.getByRole('button', { name: /copy/i });
        await user.click(copyButton);

        expect(screen.getByText('Copied!')).toBeInTheDocument();
    });

    test('submits form with Enter key', async () => {
        const user = userEvent.setup();
        mockShortenUrl.mockResolvedValue({ short_url: 'https://nano_link.io/enter' });

        render(<Home />);

        const input = screen.getByPlaceholderText('Paste your long URL here...');
        await user.type(input, 'https://example.com');
        await user.keyboard('{Enter}');

        await waitFor(() => {
            expect(mockShortenUrl).toHaveBeenCalledWith('https://example.com');
        });
    });
});


// API Tests
describe('API Functions', () => {

    // Variable to hold the actual, non-mocked API functions
    let actualApi: { shortenUrl: (url: string) => Promise<{ short_url: string }> };

    // Store the original fetch function
    const originalFetch = global.fetch;

    // Before running tests in this block, import the REAL module
    beforeAll(async () => {
        actualApi = await jest.requireActual('../src/lib/api');
    });

    beforeEach(() => {
        global.fetch = jest.fn();
        process.env.NEXT_PUBLIC_API_URL = 'https://api.test.com';
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    test('makes correct API call', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => ({ short_url: 'https://nano_link.io/test' }),
        } as Response);

        // Call the REAL shortenUrl function
        const result = await actualApi.shortenUrl('https://example.com');

        expect(mockFetch).toHaveBeenCalledWith(
            'https://api.test.com/shorten',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: 'https://example.com' }),
            }
        );

        expect(result).toEqual({ short_url: 'https://nano_link.io/test' });
    });

    test('throws error when API fails', async () => {
        const mockFetch = global.fetch as jest.Mock;
        mockFetch.mockResolvedValue({
            ok: false,
            status: 400,
        } as Response);

        // Test that the REAL function rejects the promise
        await expect(actualApi.shortenUrl('https://example.com')).rejects.toThrow('Failed to shorten URL');
    });
})