"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaFacebookF, FaHeart, FaRegHeart, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { FiLink, FiShare2 } from "react-icons/fi";
import { addComment, deleteComment, toggleLike } from "@/lib/actions/blog";
import { formatDate } from "@/lib/site";
import { buttonClass, Notice } from "./ui";

export function LikeButton({ postId, liked, count }: { postId: string; liked: boolean; count: number }) {
  return (
    <form action={toggleLike}>
      <input type="hidden" name="postId" value={postId} />
      <button className={buttonClass.line} type="submit">
        {liked ? <FaHeart className="text-ember" /> : <FaRegHeart />}
        {liked ? "Liked" : "Like"}
        <span className="text-muted">{count}</span>
      </button>
    </form>
  );
}

export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = encodeURIComponent(title);
  const shareUrl = encodeURIComponent(url);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await copy();
  }

  const linkClass = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-card";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" className={buttonClass.line} onClick={nativeShare}>
        <FiShare2 /> Share
      </button>
      <button type="button" className={linkClass} onClick={copy} aria-label={copied ? "Link copied" : "Copy link"}>
        <FiLink />
      </button>
      <a className={linkClass} href={`https://wa.me/?text=${text}%20${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp">
        <FaWhatsapp />
      </a>
      <a className={linkClass} href={`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on X">
        <FaXTwitter />
      </a>
      <a className={linkClass} href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook">
        <FaFacebookF />
      </a>
      {copied ? <span className="text-xs text-muted">Link copied</span> : null}
    </div>
  );
}

export function CommentForm({ postId }: { postId: string }) {
  const [state, action, pending] = useActionState(addComment, { error: "", ok: false });
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state.ok]);

  return (
    <form ref={form} action={action} className="mt-6 grid gap-3">
      <input type="hidden" name="postId" value={postId} />
      {state.error ? <Notice>{state.error}</Notice> : null}
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Add a comment</span>
        <textarea className="field min-h-28" name="body" required minLength={2} maxLength={2000} rows={4} placeholder="What did this article change for you?" />
      </label>
      <button className={`${buttonClass.solid} w-fit`} disabled={pending}>
        {pending ? "Posting…" : "Post comment"}
      </button>
    </form>
  );
}

export function CommentList({
  comments,
  currentUserId,
  canModerate,
}: {
  comments: { id: string; body: string; createdAt: string; userId: string; userName: string }[];
  currentUserId: string | null;
  canModerate: boolean;
}) {
  if (!comments.length) {
    return <p className="mt-4 text-sm text-muted">No comments yet. Be the first to write one.</p>;
  }

  return (
    <ul className="mt-6 divide-y divide-line border-y border-line">
      {comments.map((comment) => (
        <li key={comment.id} className="py-4">
          <p className="text-sm">
            <span className="font-medium">{comment.userName}</span>
            <span className="text-muted"> · {formatDate(comment.createdAt)}</span>
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">{comment.body}</p>
          {currentUserId && (currentUserId === comment.userId || canModerate) ? (
            <form action={deleteComment} className="mt-2">
              <input type="hidden" name="id" value={comment.id} />
              <button className="text-xs text-muted underline">Remove</button>
            </form>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function SignInPrompt({ next }: { next: string }) {
  return (
    <p className="mt-4 text-sm text-muted">
      <Link className="underline" href={`/login?next=${encodeURIComponent(next)}`}>
        Sign in
      </Link>{" "}
      to like this article or leave a comment. Sharing stays open without an account.
    </p>
  );
}
