/**
 * FILE OVERVIEW:
 *   Purpose: Colorful logging utility for the application
 *   Key Concepts: Console Logging, Color Formatting, Log Levels
 *   Module Type: Utility
 *   @ai_context: Centralized logging with consistent formatting and colors
 */

import chalk from 'chalk';

export interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  success: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const formatMessage = (
  level: string,
  message: string,
  args: unknown[]
): string => {
  const timestamp = chalk.gray(`[${getTimestamp()}]`);
  const levelFormatted = level;
  const messageFormatted =
    args.length > 0
      ? `${message} ${args
          .map(arg =>
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          )
          .join(' ')}`
      : message;

  return `${timestamp} ${levelFormatted} ${messageFormatted}`;
};

export const logger: Logger = {
  info: (message: string, ...args: unknown[]) => {
    const level = chalk.blue('ℹ INFO');
    console.log(formatMessage(level, message, args));
  },

  success: (message: string, ...args: unknown[]) => {
    const level = chalk.green('✅ SUCCESS');
    console.log(formatMessage(level, message, args));
  },

  warn: (message: string, ...args: unknown[]) => {
    const level = chalk.yellow('⚠ WARN');
    console.warn(formatMessage(level, message, args));
  },

  error: (message: string, ...args: unknown[]) => {
    const level = chalk.red('❌ ERROR');
    console.error(formatMessage(level, message, args));
  },

  debug: (message: string, ...args: unknown[]) => {
    if (process.env['NODE_ENV'] === 'development') {
      const level = chalk.magenta('🐛 DEBUG');
      console.log(formatMessage(level, message, args));
    }
  },
};
