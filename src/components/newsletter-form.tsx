"use client";

import { useState } from "react";

// TODO: connect to a mailing-list provider; for now this only validates locally.
export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p role="status" className="text-sm text-muted">
        Newsletter sign-up is coming soon. Thank you for your interest.
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <label className="flex flex-1 flex-col gap-2">
        <span className="text-label text-muted">Email address</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="name@example.com"
          className="h-12 border-b border-line-strong bg-transparent text-sm placeholder:text-subtle focus-visible:outline-offset-0"
        />
      </label>
      <button type="submit" className="btn btn-secondary">
        Subscribe
      </button>
    </form>
  );
}
