"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductDetailsToolInvocation } from "@/lib/agent";

interface AgentProductCardProps {
  invocation: ProductDetailsToolInvocation;
}

function StockBadge({
  inStock,
  lowStock,
  stock,
}: {
  inStock: boolean;
  lowStock: boolean;
  stock: number;
}) {
  if (!inStock) {
    return (
      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        Out of stock
      </span>
    );
  }

  if (lowStock) {
    return (
      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
      In stock
    </span>
  );
}

export function AgentProductCard({ invocation }: AgentProductCardProps) {
  if (
    invocation.state === "input-streaming" ||
    invocation.state === "input-available"
  ) {
    const id = invocation.input?.id;
    return (
      <div className="rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        Looking up{id ? ` "${id}"` : ""}…
      </div>
    );
  }

  if (invocation.state !== "output-available") return null;

  const output = invocation.output;

  if (!output) return null;

  if ("error" in output) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        {output.error}
      </div>
    );
  }

  const image = output.images[0];

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {image && (
        <div className="relative aspect-4/3 bg-secondary">
          <Image
            src={image}
            alt={output.name}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            className="object-cover"
          />
          {output.images.length > 1 && (
            <span className="absolute bottom-2 right-2 rounded-md bg-background/80 px-2 py-0.5 text-xs text-muted-foreground backdrop-blur-sm">
              +{output.images.length - 1} more
            </span>
          )}
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold leading-tight">
                {output.name}
              </h3>
              {output.featured && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  Featured
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {formatPrice(output.price, output.currency)}
              <span className="mx-1.5">·</span>
              <span className="capitalize">{output.category}</span>
            </p>
          </div>
          <StockBadge
            inStock={output.inStock}
            lowStock={output.lowStock}
            stock={output.stock}
          />
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {output.description}
        </p>
        {output.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {output.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link
          href={`/products/${output.slug}`}
          className="inline-flex text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          View product →
        </Link>
      </div>
    </div>
  );
}
