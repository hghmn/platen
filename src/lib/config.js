import rc from 'rc'

export function resolveConfig() {
	const conf = rc('plate', {
		baseDir: 'src',
		outDir: 'dist',
		include: ['src'],
		exclude: [],
	});

	return conf
}