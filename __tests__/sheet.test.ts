import sheet from '../src/sheet';

describe('sheet', () => {
  it('returns', async () => {
    const db = await sheet('1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k');
    expect(Array.isArray(db)).toBe(true);
    expect(db.length).toBe(6);
    expect(db[0]).toEqual({
      id: '1',
      firstname: 'John',
      lastname: 'Smith',
      age: '34',
      city: 'San Francisco',
      country: 'USA',
      timestamp: '12/10/2010'
    });
  });

  it('requires a sheet id', async () => {
    await expect(sheet()).rejects.toThrow(
      new Error('Need a Google sheet id to load')
    );
  });

  it('throws with a wrong sheet id', async () => {
    await expect(sheet('abc')).rejects.toThrow(
      new Error('Error: Request failed with status code 400')
    );
  });
});
