import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should format log message as TSKV', () => {
      const result = logger.formatMessage('log', 'Test message', 'context');

      expect(result).toBe(
        'level=log\tmessage=Test message\toptionalParam1=context\n',
      );
    });

    it('should convert non-string values to strings', () => {
      const result = logger.formatMessage('log', 123, true, { id: 1 });

      expect(result).toBe(
        'level=log\tmessage=123\toptionalParam1=true\toptionalParam2=[object Object]\n',
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
        'level=log\tmessage=Test message\n',
      );
    });

    it('should write error message to console.error', () => {
      const consoleSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => undefined);

      logger.error('Error message');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=error\tmessage=Error message\n',
      );
    });

    it('should write warning message to console.warn', () => {
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);

      logger.warn('Warning message');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=warn\tmessage=Warning message\n',
      );
    });

    it('should write debug message to console.debug', () => {
      const consoleSpy = jest
        .spyOn(console, 'debug')
        .mockImplementation(() => undefined);

      logger.debug('Debug message');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=debug\tmessage=Debug message\n',
      );
    });

    it('should write verbose message to console.log', () => {
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => undefined);

      logger.verbose('Verbose message');

      expect(consoleSpy).toHaveBeenCalledWith(
        'level=verbose\tmessage=Verbose message\n',
      );
    });
  });
});
