import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/map";

import { Component, OnInit, Input } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Dice, Message, Game, Player, RoomCode } from "../bug-bear";
import { GameService } from "../service/game.service";
import { AuthService } from "../service/auth.service";
import { Globals } from "../globals";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { ChangeDetectorStatus } from "@angular/core/src/change_detection/constants";

import * as _ from "lodash";
import { FirebaseApp } from "angularfire2";
import { AngularFireAuth } from "angularfire2/auth";
import { take } from "rxjs/operators/take";
import { Subject } from "rxjs/Subject";

@Component({
  selector: "app-games",
  templateUrl: "./games.component.html",
  styleUrls: ["./games.component.css"]
})
export class GamesComponent implements OnInit {
  gameCollection: AngularFirestoreCollection<Game>;
  games: Observable<Game[]>;
  gameName: string;

  invitationCollection: AngularFirestoreCollection<Game>;
  invitations: Observable<Game[]>;
  myInvitations : Game[];

  playerCollection: AngularFirestoreCollection<Player>;
  player: Observable<Player>;
  playerName: string;
  playerEmail: string;
  playerid: string;

  joinGameQueryObservable: any;
  roomCode$: Subject<string>;
  roomCode: string;
  roomCodeMessage : string;

  HasInvitationRequests : boolean;

  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore,
    private auth: AuthService,
    private globals: Globals,
    private fb: FirebaseApp,
    private afa: AngularFireAuth
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.playerid = params["playerid"];

      this.playerCollection = this.afs.collection("players");
      this.player = this.playerCollection
        .doc<Player>(this.playerid)
        .valueChanges();

      this.gameCollection = this.afs.collection("games", ref =>
        ref.where("Players." + this.playerid, "==", true)
      );

      this.games = this.gameCollection.valueChanges();

      this.roomCode$ = new Subject<string>();
      this.joinGameQueryObservable = this.roomCode$.switchMap(roomCode => 
        this.afs
          .collection<Game>("games", ref =>
            ref.where("RoomCode", "==", +roomCode)
          )
          .valueChanges()
          .map(g => (g && g.length > 0 ? g[0] : null))
      );

      this.invitationCollection = this.afs.collection("games", ref =>
        ref.where("Invitations." + this.playerid, "==", true)
      );
      this.invitations = this.invitationCollection.valueChanges();
      
      this.invitations.subscribe(i => {
        this.myInvitations = i;
        this.HasInvitationRequests = i.length > 0;
      });

    });
  }

  searchByRoomCode() {
    this.roomCode$.next(this.roomCode);
  }

  accept(g: Game, p: Player) {
    console.log(g);
    console.log(p);

    delete g.Invitations[p.PlayerID];

    this.gameCollection.doc(g.GameID).update(g);
  }

  end(g: Game) {
    this.gameCollection
      .doc(g.GameID)
      .delete()
      .catch(err => alert("Unable to delete.  Please try again later. "));
  }

  join(g: Game, p: Player) {
    g.Invitations = g.Invitations || {};
    g.Invitations[p.PlayerID] = true;

    this.gameCollection.doc(g.GameID).update(g);

    this.roomCode = "";

  }

  cancelRequest(g: Game) {}

  isNotGM(g: Game) {
    return !this.isGM(g);
  }

  isGM(g: Game) {
    return g.CreatedBy == this.playerid;
  }

  createGame(p: Player) {
    this.gameService.incrementRoomCode().then(
      () => {
        console.log("Game Name");
        console.log(this.gameName);
        // Anyone who creates a game is a dungeon master
        let id: string = this.gameName.replace(/\s/g, "") + "-" + this.guid(); // remove spaces and append GUID for randomness prevent namespace collisions.
        let game: Game = {
          CreatedBy: this.playerid,
          RoomCode: this.gameService.roomCode,
          GameID: id,
          GameName: this.gameName,
          Players: {}, // Make search easier
          PlayerDetails: [
            {
              PlayerID: p.PlayerID,
              Email: p.Email,
              Name: p.Name
            }
          ],
          Channel: id
        };

        game.Players[this.playerid] = true;

        this.gameCollection
          .doc(id)
          .set(game)
          .then(
            dr => {
              // Success
              this.gameName = "";
            },
            err => {
              alert("Error Creating Game.  Please try again.");
            }
          );
      },
      err => {
        alert("Unable to create game");
      }
    );
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  startGame(g: Game, p: Player) {

    g.Characters = g.Characters ? g.Characters : {}; 

    console.log(g);

    g.Characters[p.PlayerID] ? this.router.navigate(["player/" + this.playerid + '/' + g.GameID]) :
      this.router.navigate(["character-selection/" + g.GameID + "/" + this.playerid]);

  }

}
