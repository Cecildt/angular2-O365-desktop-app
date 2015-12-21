interface AdalAuthenticationContext {
    CONSTANTS: any;
    new (config: any): AdalAuthenticationContext;
    isCallback(str: string): boolean;
    handleWindowCallback(): void;
    getCachedUser(): any;
    getLoginError(): number;
    login(): void;
    logOut(): void;

    _getItem(loginReq: any): Location;
}

declare var AuthenticationContext: AdalAuthenticationContext;