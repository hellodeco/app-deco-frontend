export type GenericObject = { [key: string]: any };

export type User =
   | {
        id?: number | undefined;
        full_name?: string | undefined;
        given_name?: string | undefined;
        family_name?: string | undefined;
        email?: string | undefined;
        photo_url?: string | undefined;
        shareable_url_hash?: string | undefined;
     }
   | undefined;

export type UserMetaData = {
   id: number;
   shareable_url_hash: string;
};
