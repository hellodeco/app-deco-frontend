export type GenericObject = { [key: string]: any };

export type User =
   | {
        userfrontID?: number | undefined;
        fullName?: string | undefined;
        signupEmail?: string | undefined;
        emailAddress?: string | undefined;
     }
   | undefined;

export type UserMetaData = {
   id: number;
   shareable_url_hash: string;
};
