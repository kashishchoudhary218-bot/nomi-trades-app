import remotion from '@remotion/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{ignores: ['node_modules', 'out', 'src/assets/available.generated.ts']},
	...tseslint.configs.recommended,
	{
		files: ['src/**/*.{ts,tsx}'],
		...remotion.flatPlugin,
		rules: {
			...remotion.flatPlugin.rules,
			// Slow-CSS warnings (blur, shadows) are intentional for the look.
			'@remotion/slow-css-property': 'off',
		},
	},
	{
		files: ['src/**/*.{ts,tsx}'],
		plugins: {'react-hooks': reactHooks},
		rules: reactHooks.configs.recommended.rules,
	},
);
