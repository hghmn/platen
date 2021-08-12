const LOGGER_METHODS = ['info', 'log', 'warn', 'error']

export function getLogger(prefix) {
	const logger = {}

	for (const method of LOGGER_METHODS) {
		logger[method] = console.log.bind(console, method, prefix)
	}

	return logger
}
