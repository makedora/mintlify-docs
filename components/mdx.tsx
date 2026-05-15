import type { MDXComponents } from 'mdx/types';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  Note,
  Warning,
  Tip,
  CardGroup,
  Card,
  Steps,
  Step,
  Tabs,
  Tab,
  ParamField,
  ResponseField,
  Expandable,
} from './mintlify-shims';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Note,
    Warning,
    Tip,
    CardGroup,
    Card,
    Steps,
    Step,
    Tabs,
    Tab,
    ParamField,
    ResponseField,
    Expandable,
    ...components,
  };
}
