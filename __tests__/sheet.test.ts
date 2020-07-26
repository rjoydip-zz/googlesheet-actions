import nock from 'nock';
import sheet from '../src/sheet';

import {join, extname} from 'path';
import {readFileSync} from 'fs';

const fixtures = join(__dirname, '..', 'fixtures');
const dataFixture = getFileContent(join(fixtures), 'data.json');

let db: any;
const key = 'foo';


describe('[ googlesheet > no > entry ]', () => {
  _beforeAll({
    key: key,
    status: 200,
    file: 'response_no_entry.json'
  });
  
  it('is no entry', async () => {
    expect(db).toEqual([]);
  });
});

describe('[ googlesheet > success ]', () => {
  _beforeAll({
    key: key,
    status: 200,
    file: 'response.json'
  });

  it('is array', async () => {
    expect(Array.isArray(db)).toBe(true);
  });

  it('is length matched', async () => {
    expect(db.length).toBe(6);
  });

  it('is length equal', async () => {
    expect(dataFixture.length === db.length).toBe(true);
  });

  it('is data valid', async () => {
    expect(db).toEqual(dataFixture);
  });

  it('is data properity matched', async () => {
    expect(db[0]).toStrictEqual({
      id: '1',
      firstname: 'John',
      lastname: 'Smith',
      age: '34',
      city: 'San Francisco',
      country: 'USA',
      timestamp: '12/10/2010'
    });
  });

  cleanup();
});

describe('[ googlesheet > empty ]', () => {
  _beforeAll({
    key: key,
    status: 200,
    file: 'empty_response.json'
  });

  it('is array empty', async () => {
    expect(db).toEqual([]);
  });

  it('is array length equal to zero', async () => {
    expect(db.length).toEqual(0);
  });

  cleanup();
});

describe('[ googlesheet > error ]', () => {
  it('is empty sheey id', async () => {
    await expect(sheet()).rejects.toThrow(
      new Error('Need a Google sheet id to load')
    );
  });

  describe('[ googlesheet > error > 400 ]', () => {
    _beforeAll({
      key: key,
      status: 400,
      dbSetup: false
    });

    it('is wrong sheet id', async () => {
      await expect(sheet(key)).rejects.toThrow(
        'Request failed with status code 400'
      );
    });

    cleanup();
  });

  describe('[ googlesheet > error > 404 ]', () => {
    _beforeAll({
      key: key,
      status: 404,
      dbSetup: false
    });

    it('is wrong sheet id', async () => {
      await expect(sheet(key)).rejects.toThrow(
        'Request failed with status code 404'
      );
    });

    cleanup();
  });
});

function getNockScope(key: string) {
  return nock('https://spreadsheets.google.com')
    .get(`/feeds/list/${key}/default/public/values`)
    .query({
      alt: 'json'
    });
}

function _beforeAll({
  key,
  status = 200,
  file = '',
  enableFixture = false,
  dbSetup = true
}: {
  key: string;
  status?: number;
  file?: string;
  enableFixture?: boolean;
  dbSetup?: boolean;
}) {
  const _enableFixture =
    enableFixture || !new RegExp(/(^[3|4|5].[0-9])$/).test(`${status}`);
  beforeAll(async () => {
    if (_enableFixture && file)
      getNockScope(key).replyWithFile(status, join(fixtures, file), {
        'Content-Type': 'application/json'
      });
    else getNockScope(key).reply(status);
    nock.disableNetConnect();
    if (dbSetup) db = await sheet(key);
  });
}

function cleanup() {
  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
}

function getFileContent(path: string, file: string, encoding = 'utf-8') {
  const content = readFileSync(join(path, file), {encoding});
  return extname(file) === '.json' ? JSON.parse(content) : content;
}
