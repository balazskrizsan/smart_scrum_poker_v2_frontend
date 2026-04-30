export class EnumService
{
    public static enumAsArrayKV(enumClass): { [key: string]: string }
    {
        const items = {};

        for (const item in enumClass)
        {
            if (isNaN(Number(item)))
            {
                items[item] = (enumClass[item]).toString();
            }
        }

        return items;
    }

    public static getEnumKey(enumClass, value: number): string
    {
        return Object.keys(enumClass).find(key => enumClass[key] === value) || 'UNKNOWN';
    }
}
