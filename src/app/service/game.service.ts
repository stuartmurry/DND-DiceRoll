import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

import { Observable } from "rxjs/Observable";

import { Dice, Message, Game, Player, Character, RoomCode } from "../app";
import { Globals } from "../globals";
import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";

@Injectable()
export class GameService {

  roomCodeDocument : AngularFirestoreDocument<RoomCode>;
  roomCodeObject : Observable<RoomCode>;
  currentGame: Game;
  roomCode: number;

  constructor(private afs : AngularFirestore) {
    this.roomCodeDocument = this.afs.collection('room-codes').doc<RoomCode>('0');
    this.roomCodeObject = this.roomCodeDocument.valueChanges();
    this.roomCodeObject.subscribe(r => {
      if (!r) {
        // create a new room code
        console.log('Creating new room code');
        this.roomCode = 1;
        this.roomCodeDocument.set( { count : 1 });
      } else {
        this.roomCode = r.count = r.count + 1;
      }
      
    })
  }


  incrementRoomCode() {
    return this.roomCodeDocument.update({count : this.roomCode});
  }

  createPlayer(id: string, email : string): Player {
    let player = {
      HasSelectedDi: false,
      PlayerID: id,
      Name: "Stu",
      Email : email,
      // Characters: this.getCharacters(),
      // SelectedCharacter: this.getCharacters()[0],
      IsRollEnabled: false
    };
    return player;
  }

  getDi(): Dice[] {
    let di: Dice[] = [];
    let d4: Dice = {
      RolledValue: 0,
      IsDisabled: false,
      DiceID: 1,
      Val: "4",
      Source: "assets/images/d4.png"
    };
    di.push(d4);

    let d6: Dice = {
      RolledValue: 0,
      IsDisabled: false,
      DiceID: 2,
      Val: "6",
      Source: "assets/images/d6.png"
    };
    di.push(d6);

    let d8: Dice = {
      RolledValue: 0,
      IsDisabled: false,
      DiceID: 3,
      Val: "8",
      Source: "assets/images/d8.png"
    };
    di.push(d8);

    let d12: Dice = {
      RolledValue: 0,
      IsDisabled: false,
      DiceID: 4,
      Val: "12",
      Source: "assets/images/d12.png"
    };
    di.push(d12);

    return di;
  }

  setCurrentGame(g: Game) {
    this.currentGame = g;
  }

  public getCurrentGame(): Game {
    return this.currentGame;
  }

  public createCharacterTemplate(i : number, n : string) : Character {
    let c: Character = {
      CharacterID : i,
      HasSelectedDi : false,
      Di: this.getDi(),
      thumbnail: "assets/images/half-elf-bard.png",
      name : n,
    };

    return c;
  }
}
