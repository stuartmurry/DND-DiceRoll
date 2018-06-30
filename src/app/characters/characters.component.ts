import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Character, Player } from '../app';
import { Observable } from 'rxjs/Observable';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {

  characterCollection: AngularFirestoreCollection<Player>;
  characters : Observable<Character[]>;


  newCharacter : string;

  constructor(private afs : AngularFirestore,
  private route : ActivatedRoute,
  private router: Router,
  private gameService : GameService) { }

  @Input()
  PlayerId : string;
  playerDoc : AngularFirestoreDocument<Player>;
  player : Observable<Player>;

  editCharacter(c : Character, p : Player) {
    if (c) {
      this.router.navigate(['/character/' + this.PlayerId + '/' + c.CharacterID]);
    } else {
      p.Characters = p.Characters || [];

      let i : number = this.getNextCharacterIndex(p.Characters);
      let newCharacter = this.gameService.createCharacterTemplate(i, this.newCharacter);
      p.Characters.push(newCharacter); // Move to database as soon as you template it out.
      
      this.playerDoc.update(p).then(() => {
        this.router.navigate(['/character/' + this.PlayerId + '/' + i]);
      });
    }
  }

  delete(c : Character, p : Player) {
    p.Characters = p.Characters.filter(s => s.CharacterID != c.CharacterID); // REmove with character id
    this.playerDoc.update(p);
  }

  public getNextCharacterIndex (arr : Character[]) {
    return arr.length == 0 ? 0 : arr.map(c => c.CharacterID).sort((a,b) => b - a)[0] + 1;
  }
  

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.PlayerId = params["playerid"];
      this.characterCollection = this.afs.collection('players');
      this.playerDoc = this.characterCollection.doc(this.PlayerId);
      this.player = this.playerDoc.valueChanges();
      this.characters = this.playerDoc.valueChanges().map(x => x.Characters);
    });
  }

}
