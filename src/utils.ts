
export function convertToMySQLDateTime(params: {datetime: Date}): string {
    let { datetime } = params;
    datetime = new Date(datetime);
    return datetime.toISOString().slice(0, 23).replace('T', ' ');
}