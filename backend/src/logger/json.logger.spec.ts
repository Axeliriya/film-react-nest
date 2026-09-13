import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should format log message as JSON', () => {
      const result = logger.formatMessage('log', 'Test message', 'context');

      expect(result).toBe(
        JSON.stringify({
          level: 'log',
          message: 'Test message',
          optionalParams: ['context'],
        }),
      );
    });
  });

  describe('log methods', () => {
    it('should write log message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.log('Test message');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'log',
          message: 'Test message',
          optionalParams: [],
        }),
      );
    });

    it('should write error message to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Error message');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Error message',
          optionalParams: [],
        }),
      );
    });

    it('should write warning message to console.warn', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Warning message');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'Warning message',
          optionalParams: [],
        }),
      );
    });

    it('should write debug message to console.debug', () => {
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      logger.debug('Debug message');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'debug',
          message: 'Debug message',
          optionalParams: [],
        }),
      );
    });

    it('should write verbose message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.verbose('Verbose message');

      expect(consoleSpy).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'verbose',
          message: 'Verbose message',
          optionalParams: [],
        }),
      );
    });
  });
});
