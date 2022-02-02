import axios from 'axios';

interface StringMap {
  [key: string]: string;
}

export default async function sheet<T>(sheetId = ''): Promise<T[] | []> {
  if (!sheetId) throw new Error('Need a Google sheet id to load');
  else
    try {
      return (
        (await (
          await axios.get(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?includeGridData=true&key={$apiKey}`
          )
        ).data?.feed?.entry) || []
      ).map((row: StringMap[]) =>
        Object.keys(row)
          .filter((key: string) => /^gsx\$/.test(key))
          .reduce((obj: StringMap, key: any) => {
            obj[key.slice(4)] = row[key].$t;
            return obj;
          }, {})
      );
    } catch (error) {
      throw error;
    }
}
