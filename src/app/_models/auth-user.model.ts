export interface AuthUserData {
    firstName: string,
    lastName: string,
    _token: string,
    _tokenExpirationDate: string
} 

export class AuthUser {
    constructor(
        public firstName: string, 
        public lastName: string,
        private _token: string,
        private _tokenExpirationDate: Date
        ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}