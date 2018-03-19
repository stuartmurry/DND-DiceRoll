import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Character, Player, Dice } from "../bug-bear";
import { ActivatedRoute, Router } from "@angular/router";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";

@Component({
  selector: "app-character",
  templateUrl: "./character.component.html",
  styleUrls: ["./character.component.css"]
})
export class CharacterComponent implements OnInit {

  collection : AngularFirestoreCollection<Player>;
  playerDoc: AngularFirestoreDocument<Player>;
  player: Observable<Player>;
  playerid : string;
  characterid : number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore
  ) {}

  deleteDi(d : Dice, p : Player, c: Character) {
    // Remove by reverse filter
    c.Di = c.Di.filter(x => x.DiceID != d.DiceID);
  }

  save(p) {
    console.log(p)
    this.playerDoc.update(p).then(() => {
      this.router.navigate(['/characters/' + this.playerid ]);
    }, err => {});
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.playerid  = params["playerid"];
      this.characterid = params["characterid"];
      this.collection = this.afs.collection('players');
      this.playerDoc = this.collection.doc(this.playerid );
      this.player = this.playerDoc.valueChanges();
    });
  }
}
