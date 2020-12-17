export declare type SharpGlobalOptions = {
    compressionLevel?: '';
    format?: ImageFormat;
    input: string;
    limitInputPixels?: number;
    output: string;
    progressive?: boolean;
    quality?: number;
    withMetadata?: boolean;
    [key: string]: string | number | boolean | undefined | null;
};
export declare type SharpCommandOptions = RemoveAlphaOptions | ResizeOptions | FlattenOptions;
declare type FlattenOptions = {
    operation: 'flatten';
    background: string;
};
export declare type ResizeMode = 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
export declare type ImageFormat = 'input' | 'jpeg' | 'jpg' | 'png' | 'raw' | 'tiff' | 'webp';
declare type RemoveAlphaOptions = {
    operation: 'removeAlpha';
};
declare type ResizeOptions = {
    operation: 'resize';
    background?: string;
    fastShrinkOnLoad?: boolean;
    fit?: ResizeMode;
    height?: number;
    kernel?: 'nearest' | 'cubic' | 'mitchell' | 'lanczos2' | 'lanczos3';
    position?: 'center' | 'centre' | 'north' | 'east' | 'south' | 'west' | 'northeast' | 'southeast' | 'southwest' | 'northwest' | 'top' | 'right' | 'bottom' | 'left' | 'right top' | 'right bottom' | 'left bottom' | 'left top' | 'entropy' | 'attention';
    width: number;
    withoutEnlargement?: boolean;
};
export declare function sharpAsync(options: SharpGlobalOptions, commands?: SharpCommandOptions[]): Promise<string[]>;
export {};
