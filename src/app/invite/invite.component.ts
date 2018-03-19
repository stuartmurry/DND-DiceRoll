import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap} from '@angular/router';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";
import { Game, Player } from "../bug-bear";

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit {

  constructor(
    private route : ActivatedRoute,
    private afs: AngularFirestore) { }

  gamesCollection: AngularFirestoreCollection<Game>;
  playersCollection: AngularFirestoreCollection<Player>;
  game : Observable<any>;
  keys : object[] = [];

  invitee : string;

  showError:boolean;
  errormessage:string;

  clear() {
    this.showError = false;
    this.errormessage = "";
  }

  invite() {
    // this.afs.doc<Player>('/players/' + this.invitee).
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
        let gameid : string = params['gameid'];
        this.game = this.afs.doc('/games/' + gameid).valueChanges();
        this.game.subscribe(g => this.keys = g.PlayerDetails);
    });
  }
  
}
