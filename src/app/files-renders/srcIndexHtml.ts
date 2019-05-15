import { ISettings } from '../settings';

export default function srcIndexHtmlRendersrcIndexHtmlRender({
	useReact
}: ISettings): string {
	return `<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	${ useReact ? "<div id='react-app'></div>" : 'App' }
</body>
</html>
`;
}
