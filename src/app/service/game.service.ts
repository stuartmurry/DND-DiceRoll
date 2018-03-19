import "rxjs/add/observable/of";
import "rxjs/add/operator/map";

import { Observable } from "rxjs/Observable";

import { Dice, Message, Game, Player, Character, RoomCode } from "../bug-bear";
import { Globals } from "../globals";
import { Injectable } from "@angular/core";

import * as _ from "lodash";
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

  // getPlayers(): Player[] {
  //   let stuart = {
  //     HasSelectedDi: false,
  //     PlayerId: 1,
  //     FirstName: "Stuart Murry",
  //     DisplayName: "Stuart Murry",
  //     Characters: this.getCharacters(),
  //     SelectedCharacter: this.getCharacters()[0],
  //     IsRollEnabled: false
  //   };

  //   let ericO = {
  //     HasSelectedDi: false,
  //     PlayerId: 2,
  //     FirstName: "Eric Ostler",
  //     DisplayName: "Eric Ostler",
  //     Characters: this.getCharacters(),
  //     SelectedCharacter: this.getCharacters()[0],
  //     IsRollEnabled: false
  //   };

  //   let ericM = {
  //     HasSelectedDi: false,
  //     PlayerId: 3,
  //     FirstName: "Eric Minson",
  //     DisplayName: "Eric Minson",
  //     Characters: this.getCharacters(),
  //     SelectedCharacter: this.getCharacters()[0],
  //     IsRollEnabled: false
  //   };

  //   let zach = {
  //     HasSelectedDi: false,
  //     PlayerId: 4,
  //     FirstName: "Zach",
  //     DisplayName: "Zach",
  //     Characters: this.getCharacters(),
  //     SelectedCharacter: this.getCharacters()[0],
  //     IsRollEnabled: false
  //   };

  //   let kailey = {
  //     HasSelectedDi: false,
  //     PlayerId: 5,
  //     FirstName: "Kailey",
  //     DisplayName: "Kailey",
  //     Characters: this.getCharacters(),
  //     SelectedCharacter: this.getCharacters()[0],
  //     IsRollEnabled: false
  //   };

  //   return [stuart, ericO, ericM, zach, kailey];
  // }

  // getPlayer(id: number | string): Player {
  //   let p = this.getPlayers().find(function(p) {
  //     return p.PlayerId === +id;
  //   });

  //   return p;
  // }

  // getGame(id: number | string) {
  //   return this.getGames().find(function(g) {
  //     return g.GameId === +id;
  //   });
  // }

  // getGamesByPlayerId(id: number | string) {
  //   let gg: Game[] = [];
  //   _.forEach(this.getGames(), function(g) {
  //     let p: Player = g.Players.find(function(p) {
  //       return p.PlayerId === +id;
  //     });
  //     if (p != null) {
  //       gg.push(g);
  //     }
  //   });
  //   return gg;
  // }

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

  // public getCharacters(): Character[] {
    
  //   return [this.createCharacterTemplate()];
  // }

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
