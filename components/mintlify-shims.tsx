import React from 'react';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card as FumaCard, Cards } from 'fumadocs-ui/components/card';
import { Step as FumaStep, Steps } from 'fumadocs-ui/components/steps';
import { Tab as FumaTab, Tabs as FumaTabs } from 'fumadocs-ui/components/tabs';

export function Note({ children }: { children: React.ReactNode }) {
  return <Callout type="info">{children}</Callout>;
}

export function Warning({ children }: { children: React.ReactNode }) {
  return <Callout type="warn">{children}</Callout>;
}

export function Tip({ children }: { children: React.ReactNode }) {
  return <Callout type="info" title="Tip">{children}</Callout>;
}

export function CardGroup({
  children,
}: {
  children: React.ReactNode;
  cols?: number;
}) {
  return <Cards>{children}</Cards>;
}

export function Card({
  title,
  href,
  children,
}: {
  title: string;
  icon?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  return (
    <FumaCard title={title} href={href ?? ''}>
      {children}
    </FumaCard>
  );
}

export { Steps };

export function Step({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <FumaStep>
      <h3>{title}</h3>
      {children}
    </FumaStep>
  );
}

export function Tabs({ children }: { children: React.ReactNode }) {
  const items: string[] = [];
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.props as Record<string, unknown>).title
    ) {
      items.push((child.props as Record<string, unknown>).title as string);
    }
  });
  return (
    <FumaTabs items={items}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.props as Record<string, unknown>).title
        ) {
          const props = child.props as Record<string, unknown>;
          return (
            <FumaTab value={props.title as string}>
              {props.children as React.ReactNode}
            </FumaTab>
          );
        }
        return child;
      })}
    </FumaTabs>
  );
}

export function Tab({
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export function ParamField({
  children,
  body,
  query,
  path,
  header,
  type,
  required,
  default: defaultVal,
}: {
  children: React.ReactNode;
  body?: string;
  query?: string;
  path?: string;
  header?: string;
  type?: string;
  required?: boolean;
  default?: string;
}) {
  const name = body || query || path || header || '';
  const location = body
    ? 'body'
    : query
      ? 'query'
      : path
        ? 'path'
        : header
          ? 'header'
          : '';
  return (
    <div className="border-b border-fd-border py-3">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="font-semibold">{name}</span>
        {type && <span className="text-fd-muted-foreground">{type}</span>}
        {required && <span className="text-red-500 text-xs">required</span>}
        {defaultVal && (
          <span className="text-fd-muted-foreground text-xs">
            default: {defaultVal}
          </span>
        )}
        {location && (
          <span className="text-fd-muted-foreground text-xs">
            ({location})
          </span>
        )}
      </div>
      <div className="text-sm text-fd-muted-foreground mt-1">{children}</div>
    </div>
  );
}

export function ResponseField({
  children,
  name,
  type,
}: {
  children: React.ReactNode;
  name: string;
  type: string;
}) {
  return (
    <div className="border-b border-fd-border py-3">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="font-semibold">{name}</span>
        <span className="text-fd-muted-foreground">{type}</span>
      </div>
      <div className="text-sm text-fd-muted-foreground mt-1">{children}</div>
    </div>
  );
}

export function Expandable({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <details className="ml-4 mt-2">
      <summary className="cursor-pointer text-sm font-medium">{title}</summary>
      <div className="mt-2">{children}</div>
    </details>
  );
}
