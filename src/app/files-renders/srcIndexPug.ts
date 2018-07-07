import { ISettings } from '../settings';

export default function srcIndexHtmlRender(settings: ISettings): string {
	return `doctype html
html
  head
    title
  body
`;
}
