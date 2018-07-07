import { ISettings } from '../settings';

export default function readmemd({
}: ISettings): string {

  return `## Setup
\`\`\`bash
npm install
\`\`\`

## Run development webserver
\`\`\`bash
npm start
\`\`\`

## Build production version
\`\`\`bash
npm run build
\`\`\`
`;
}
