import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, tap } from "rxjs/operators";

import { environment } from "src/environments/environment";
import { AuthUser, AuthUserData } from "../_models/auth-user.model";


export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
}

@Injectable({ providedIn: "root" })
export class AuthService {
    // user = new Subject<User>();
    authUser = new BehaviorSubject<AuthUser>(null);
    private tokenExpirationTimer: any;

    url = environment.apiURL;

    constructor(
        private http: HttpClient,
        private router: Router,
        // private userService: UserService
    ) {
        this.autoLogin();
    }

    //the original login
    login_(user: string, password: string) {
        return this.http.post<any>(
            this.url + '/users/authenticate',
            {
                username: user,
                password: password
            }
        );
    }

    //alternative login using Firebase because of the CORS issue
    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.apiKey,
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(res => {
                this.handleAuthentication(res.email, res.localId, res.idToken, +res.expiresIn);
            })
        );

    }

    logout() {
        this.authUser.next(null);
        this.router.navigate(['/login']);
        localStorage.removeItem('authUserData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expitationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expitationDuration);
    }

    autoLogin() {
        const userData: AuthUserData = JSON.parse(localStorage.getItem('authUserData'));

        if (!userData) {
            return;
        }

        const loadedUser = new AuthUser(
            userData.firstName,
            userData.lastName,
            userData._token,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
            this.authUser.next(loadedUser);
        }
    }

    private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const authUser = new AuthUser(
            'Test-First',
            'Test-Last',
            token,
            expirationDate
        );

        this.autoLogout(expiresIn * 1000);
        localStorage.setItem('authUserData', JSON.stringify(authUser));
        this.authUser.next(authUser);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An error occurred!';

        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }

        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exists';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct';
                break;
        }

        return throwError(errorMessage);
    }
}