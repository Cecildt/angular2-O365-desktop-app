import { Injectable } from "angular2/core";
import { SvcConsts } from "../svcConsts/svcConsts";

@Injectable()
export class AuthHelper {
    /**
     * Configuration object for the instantiation of the ADAL authContext object
     */
    private config: any = {
        tenant: SvcConsts.TENTANT_ID,
        clientId: SvcConsts.CLIENT_ID,
        postLogoutRedirectUri: window.location.origin,
        endpoints: {
            officeGraph: SvcConsts.GRAPH_RESOURCE
        },
        cacheLocation: 'localStorage', // enable this for IE, as sessionStorage does not work for localhost.
    };

    private currentUser: any;

    /**
     * ADAL authContext object 
     */
    private authContext: any;

    get isUserAuthenticated(): boolean {
        return !!this.currentUser;
    }

    get currentUserName(): string {
        return this.isUserAuthenticated ? this.currentUser.profile.name : "";
    }

    constructor() {
        this.authContext = new AuthenticationContext(this.config);
        this.handleLogInCallBack();
    }

    private handleLogInCallBack = (): void => {
        var isCallback = this.authContext.isCallback(window.location.hash);
        this.authContext.handleWindowCallback();
        this.currentUser = this.authContext.getCachedUser();
        var logError = - this.authContext.getLoginError();

        if (!!logError) {
            alert(logError);
        } else if (isCallback && !logError) {
            window.location = this.authContext._getItem(this.authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
        }
    }

    public logIn() {
        this.authContext.login();
    }

    public logOut() {
        this.authContext.logOut();
    }
}