import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {

  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuario = new BehaviorSubject<User>(new User('', '', '', new Date()));

  constructor(private http: HttpClient) { }

  signupUser(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDo8DvHi8IRHDoSI54t_V599vgpXAmoxRs',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
        tap(resData => {
          const expiracaoData = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          const usuario = new User(
            resData.email,
            resData.localId,
            resData.idToken,
            expiracaoData
          );

          this.usuario.next(usuario);
          localStorage.setItem('userData', JSON.stringify(usuario));
        })
      );
  }

  loginUser(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDo8DvHi8IRHDoSI54t_V599vgpXAmoxRs',
      {
        email: email,
        password: password,
        returnSecureToken: true
      }).pipe(
        tap(resData => {
          const expiracaoData = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          const usuario = new User(
            resData.email,
            resData.localId,
            resData.idToken,
            expiracaoData
          );
          this.usuario.next(usuario);
          localStorage.setItem('userData', JSON.stringify(usuario));
        }),
      );
  }

  logout() {
    this.usuario.next(new User('', '', '', new Date()));
  }
}
