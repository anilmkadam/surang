const WebSocket = require('ws');
const Surang = require('./surang');

describe('Surang', () => {
  let wsMock;
  let surangClient;

  beforeEach(async () => {
    wsMock = WebSocket.mock;
    surangClient = new Surang({
      authKey: 'TEST_AUTH_KEY',
      port: 8000,
      server: 'surang.example.com',
    });
  });

  it('should emit "connect" event on successful connection', (done) => {
    surangClient.on('connect', (url) => {
      expect(url).toBe('https://surang.example.com');
      done();
    });

    surangClient.connect();
    wsMock.emitOpen();
  });

  it('should emit "disconnect" event on connection close', (done) => {
    surangClient.on('disconnect', (reason) => {
      expect(reason).toBe('TEST_REASON_FOR_DISCONNECTION');
      done();
    });

    surangClient.connect();
    wsMock.emitClose('TEST_REASON_FOR_DISCONNECTION');
  });

  it('should emit "error" event on error scenarios', (done) => {
    surangClient.on('error', (reason) => {
      expect(reason).toBe('TEST_ERROR_IN_CONNECTION');
      done();
    });

    surangClient.connect();
    wsMock.emitError('TEST_ERROR_IN_CONNECTION');
  });

  it('should emit "incoming" event on receiving request', (done) => {
    surangClient.on('incoming', (request) => {
      expect(request).toEqual({
        method: 'GET',
        url: '/test/request/goes?where=here',
      });
      done();
    });

    surangClient.connect();
    wsMock.emitMessage(JSON.stringify({
      method: 'GET',
      url: '/test/request/goes?where=here',
    }));
  });
});