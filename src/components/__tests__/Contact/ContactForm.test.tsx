import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import ContactForm from '../../Contact/ContactForm';

vi.mock('../../Contact/TurnstileWidget', () => ({
  default: ({ onToken }: { onToken: (token: string) => void }) => {
    onToken('test-token');
    return null;
  },
}));

describe('ContactForm', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
  });

  it('renders the required fields', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('submits the form and shows a success message', async () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Hello!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/thanks for reaching out/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('shows an error message when the request fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(null, { status: 500 }),
    );
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Jane' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Message'), {
      target: { value: 'Hello!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
