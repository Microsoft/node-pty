/**
 * Copyright (c) 2017, Daniel Imms (MIT License).
 * Copyright (c) 2018, Microsoft Corporation (MIT License).
 */

import * as assert from 'assert';
import { WindowsTerminal } from './windowsTerminal';
import { UnixTerminal } from './unixTerminal';
import { spawn } from '.';

let terminalCtor: WindowsTerminal | UnixTerminal;
if (process.platform === 'win32') {
  terminalCtor = require('./windowsTerminal');
} else {
  terminalCtor = require('./unixTerminal');
}

describe('Terminal', () => {
  describe('constructor', () => {
    it('should do basic type checks', () => {
      assert.throws(
        () => new (<any>terminalCtor)('a', 'b', { 'name': {} }),
        'name must be a string (not a object)'
      );
    });
  });

  describe('getSocket', () => {
    it('should return a Socket instance', (done) => {
      const shell = process.platform === 'win32' ? 'powershell.exe' : 'bash';
      const client = spawn(shell, [], {});
      assert.equal( client.getSocket().destroyed, false, 'socket shouldn\'t be destroyed yet' );
      client.destroy();
      setTimeout(() => { // need to wait a little so the socket get's destroyed in windows
        assert.equal(client.getSocket().destroyed, true, 'socket should be destroyed');
        done();
      }, 100);
    });
  });

});
