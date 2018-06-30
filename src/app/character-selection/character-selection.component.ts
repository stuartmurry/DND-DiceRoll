import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router/";
import {
  AngularFirestoreCollection,
  AngularFirestore,
  AngularFirestoreDocument
} from "angularfire2/firestore";
import { Observable } from "rxjs/Observable";
import { Player, Game, Character } from "../app";
import { Router } from "@angular/router";

@Component({
  selector: "app-character-selection",
  templateUrl: "./character-selection.component.html",
  styleUrls: ["./character-selection.component.css"]
})
export class CharacterSelectionComponent implements OnInit {

  characterCollection: AngularFirestoreCollection<Player>;
  characters : Observable<Character[]>;
  playerDoc : AngularFirestoreDocument<Player>;
  player : Observable<Player>; 
  playerid : string;

  gameid: string;
  gameCollection: AngularFirestoreCollection<Game>;
  gameDoc : AngularFirestoreDocument<Game>;
  game: Observable<Game>;

  p : Player;
  g : Game;
  c : Character;

  constructor(private route: ActivatedRoute, private afs: AngularFirestore,private router: Router) {}

  selectCharacter() {
    console.log('Selected Characters');

    this.g.Characters = this.g.Characters ? this.g.Characters : {};
    this.g.Characters[this.p.PlayerID] = this.c;

    console.log(this.g);

    this.gameDoc.update(this.g).then(() => {
      this.router.navigate(['/games/' + this.playerid]);
    })

  }

  setPlayerGame(c : Character, p : Player, g : Game) {
    this.c = c;
    this.p = p;
    this.g = g;
    
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.playerid = params["playerid"];
      this.gameid = params["gameid"];
      this.gameCollection = this.afs.collection('games');
      this.gameDoc = this.gameCollection.doc<Game>(this.gameid);
      this.game = this.gameDoc.valueChanges();
      this.characterCollection = this.afs.collection('players');
      
      this.playerDoc = this.characterCollection.doc(this.playerid);
      this.player = this.playerDoc.valueChanges();
      this.characters = this.playerDoc.valueChanges().map(x => x.Characters);
    });
  }
}
