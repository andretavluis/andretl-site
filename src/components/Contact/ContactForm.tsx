'use client';

import { useState } from 'react';

import TurnstileWidget from './TurnstileWidget';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

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

  if (status === 'success') {
    return (
      <p className="contact-success">
        Thanks for reaching out! I&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="contact-name">Name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-email">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
        className="contact-honeypot"
      />

      <TurnstileWidget onToken={setTurnstileToken} />

      {status === 'error' && (
        <p className="contact-error">
          Something went wrong. Please try again, or email me directly at{' '}
          aluis6847@gmail.com.
        </p>
      )}

      <button
        type="submit"
        disabled={!turnstileToken || status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>
    </form>
  );
}
