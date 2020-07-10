import axios from 'axios';

interface StringMap {
  [key: string]: string;
}

export default async function sheet(sheetId: string = ''): Promise<object[]> {
  if (!sheetId) throw new Error('Need a Google sheet id to load');
  else
    try {
      return (
        await axios.get(
          `https://spreadsheets.google.com/feeds/list/${sheetId}/default/public/values?alt=json`
        )
      ).data.feed.entry.map((row: StringMap[]) =>
        Object.keys(row)
          .filter((key: string) => /^gsx\$/.test(key))
          .reduce((obj: StringMap, key: any) => {
            obj[key.slice(4)] = row[key].$t;
            return obj;
          }, {})
      );
    } catch (error) {
      throw new Error(error);
    }
}
