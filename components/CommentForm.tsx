"use client";

import { useActionState, useState } from "react";

import {
  createComment,
  type CommentFormState,
} from "@/app/actions/comments";

const initialState: CommentFormState = { errors: {} };

export function CommentForm({ recipeId }: { recipeId: string }) {
  const [state, formAction, pending] = useActionState(createComment, initialState);
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");

  return (
    <form action={formAction} className="comment-form">
      <input name="recipeId" type="hidden" value={recipeId} />
      <div className="form-field">
        <label htmlFor="comment-author">Your name</label>
        <input
          aria-describedby={state.errors.authorName ? "comment-author-error" : undefined}
          aria-invalid={Boolean(state.errors.authorName)}
          autoComplete="name"
          id="comment-author"
          maxLength={80}
          name="authorName"
          onChange={(event) => setAuthorName(event.target.value)}
          required
          value={authorName}
        />
        {state.errors.authorName && (
          <p className="field-error" id="comment-author-error" role="alert">
            {state.errors.authorName}
          </p>
        )}
      </div>
      <div className="form-field">
        <label htmlFor="comment-body">Comment</label>
        <textarea
          aria-describedby={state.errors.body ? "comment-body-error" : undefined}
          aria-invalid={Boolean(state.errors.body)}
          id="comment-body"
          maxLength={1000}
          name="body"
          onChange={(event) => setBody(event.target.value)}
          required
          rows={4}
          value={body}
        />
        {state.errors.body && (
          <p className="field-error" id="comment-body-error" role="alert">
            {state.errors.body}
          </p>
        )}
      </div>
      {state.errors.form && <p className="field-error" role="alert">{state.errors.form}</p>}
      {state.success && <p className="comment-success" role="status">Comment added.</p>}
      <button className="submit-button" disabled={pending} type="submit">
        {pending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}
