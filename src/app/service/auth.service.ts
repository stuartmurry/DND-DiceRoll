import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import "rxjs/Rx";
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, Router } from "@angular/router";
import { Player, Game } from "../bug-bear";
import { Globals } from "../globals";
import * as firebase from "firebase/app";
import { GameService } from "./game.service";

@Injectable()
export class AuthService {

  player : Observable<Player>;
  playerSnapShot : Player;

  constructor(
    private afa: AngularFireAuth,
  ) {
    //https://stackoverflow.com/questions/35110690/ngoninit-not-being-called-when-injectable-class-is-instantiated
  }

  logout() {
    this.afa.auth.signOut();
  }


}
