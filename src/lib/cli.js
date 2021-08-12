import { build } from './build'

export async function run(command, args, options) {
	console.log('run', command, args, options)

	if (command === 'build') {
		await build(options)
	}
}

