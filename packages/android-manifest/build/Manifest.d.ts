import { Attribute, Document, Element } from 'libxmljs';
export declare function manipulateAttributeInTag(doc: Document, attribute: string, tag: string, manipulate: (attribute: Attribute) => any): Array<any>;
export declare function createPermission(doc: Document, name: string): Element;
export declare function removePermissions(doc: Document, permissionNames?: string[]): void;
export declare function addPermission(doc: Document, permission: Element): import("libxmljs").Node | undefined;
export declare function ensurePermissions(doc: Document, permissionNames: string[]): {
    [permission: string]: boolean;
};
export declare function ensurePermission(doc: Document, permissionName: string): boolean;
export declare function getRoot(doc: Document): Element;
export declare function findAttributeInTag(doc: Document, attribute: string, tag: string): Attribute[];
export declare function ensurePermissionNameFormat(permissionName: string): string;
export declare function getPermissionAttributes(doc: Document): Attribute[];
export declare function getPermissions(doc: Document): string[];
export declare function logManifest(doc: Document): void;
export declare function format(manifest: any, { indentLevel, newline }?: {
    indentLevel?: number | undefined;
    newline?: string | undefined;
}): string;
export declare function writeAndroidManifestAsync(manifestPath: string, manifest: any): Promise<void>;
export declare function getProjectAndroidManifestPathAsync(projectDir: string): Promise<string | null>;
export declare function readAsync(manifestPath: string): Promise<Document>;
export declare function persistAndroidPermissionsAsync(projectDir: string, permissions: string[]): Promise<boolean>;
export declare const UnimodulePermissions: {
    [key: string]: string;
};
