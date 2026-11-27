'use client';

import { useState } from 'react';

import TurnstileWidget from './TurnstileWidget';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

const inputClasses =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-[var(--color-fg-bold)] outline-none transition-colors focus:border-[var(--color-accent)]';
const labelClasses =
  'mb-2 block text-sm font-semibold text-[var(--color-fg-bold)]';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [status, setStatus] = useState<SubmissionState>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!turnstileToken) return;

    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, website, turnstileToken }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 shadow-lg sm:p-10">
      {status === 'success' ? (
        <p className="text-center text-lg text-[var(--color-fg-bold)]">
          Thanks for reaching out! I&apos;ll get back to you soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="contact-name" className={labelClasses}>
              * Name
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className={labelClasses}>
              * Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="contact-message" className={labelClasses}>
              * Message
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClasses} resize-y rounded-2xl`}
            />
          </div>

          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="sr-only"
          />

          <TurnstileWidget onToken={setTurnstileToken} />

          {status === 'error' && (
            <p className="text-sm text-[var(--color-fg-bold)]">
              Something went wrong. Please try again, or email me directly at
              aluis6847@gmail.com.
            </p>
          )}

          <button
            type="submit"
            disabled={!turnstileToken || status === 'submitting'}
            className="self-start rounded-full bg-[var(--color-accent)] px-8 py-3.5 font-semibold text-[var(--color-bg)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  );
}
