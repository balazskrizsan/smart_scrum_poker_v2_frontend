export interface IStoryPointConfig
{
    id: number;
    name: string;
    sizesConfig: Array<ISizeConfig>;
    dimensionsConfig: Array<IDimensionConfig>;
    pointsMapping: Array<IPointsMapping>;
    createdAt: string;
    createdBy: string;
}

export interface ISizeConfig
{
    name: string;
}

export interface IDimensionConfig
{
    name: string;
    sizeValues: Array<ISizeValue>;
}

export interface ISizeValue
{
    name: string;
    value: number;
}

export interface IPointsMapping
{
    totalRange: [number, number];
    points: number;
}
