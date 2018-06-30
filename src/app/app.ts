import { Observable } from "rxjs/Observable";

export class BugBear {}

export interface RoomCode {
   count:number 
}

export interface PlayerDetails {
  PlayerID: string,
  Email: string,
  Name: string,
}

export interface Message {
  Label: string;
  RolledValue: number;
  RolledDi?: Dice[]; // This dice is cloned
}

export interface Game {
  Invitations? : object;
  CreatedBy: string;
  RoomCode : number;
  GameID?: string; // Auto Generated IDs handled by server
  GameName: string;
  Players: object;
  PlayerDetails : PlayerDetails[];
  Channel: string;
  Messages?: Message[];
  Characters? : object;
}

export interface Player {
  PlayerID: string;
  Name: string;
  Email: string;
  IsRollEnabled: boolean;
  Characters?: Character[];
  SelectedCharacter?: Character;
}

export interface Dice {
  DiceID: number;
  IsDisabled: boolean;
  Val: string;
  Source: string;
  RolledValue: number;
  Modifier? : string;
}

export interface Character {
  CharacterID : number;
  name: string;
  thumbnail: string;
  SelectedDi?: Dice[];
  HasSelectedDi: boolean;
  Di: Dice[];
}

export interface PubNubItem {
  timetoken: string;
  entry: Message;
}

export interface PubNubMessage {
  timetoken: string;
  channel: string;
  message: Message;
}

// Accordian
export interface NavMenu {
  name : string;
  url : string;
  GrowFactor : number;
  FontAwesome : string;
  FontAwesomeCategory : string; // fas, fal, far - solid, light, regular respectively
  IsExpanded : boolean;
  items : NavMenuItems[];
}

// Accordian
export interface NavMenuItems {
  name : string;
  menulink : string;
}
