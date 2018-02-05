import { Component, OnInit } from "@angular/core";
import * as _ from "lodash";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit {

  constructor() {}
  currentUser: User;

  ngOnInit() {
    // To Do: Wire up to a real web service soon.
    let demoGame = new Game();

    let demoUser = new User();
    demoUser.DisplayName = "D&D Champ";
    demoGame.Users.push(demoUser);

    let d4: Dice = new Dice();
    d4.Value = "4";
    let d12: Dice = new Dice();
    d12.Value = "12";
    let d2: Dice = new Dice();
    d2.Value = "2";

    demoUser.Di = [d4, d12, d2];

    this.currentUser = demoUser;
  }

  clickSelectDice(d:Dice) {
    // Clear existing dice
    _.each(this.currentUser.Di, function(d) {
      d.IsDisabled = true;
    });
    
    // Set the current dice
    d.IsDisabled = false;

    this.currentUser.SelectedDice = d;
    this.currentUser.IsRollEnabled = true;
  }

  roll() {
    // Hook to web service
    let message = new Message();
    let diceValue = parseInt(this.currentUser.SelectedDice.Value);
    this.currentUser.CurrentRole = Math.floor((Math.random() * diceValue) + 1);
    message.Label = this.currentUser.DisplayName + ' just rolled a ' + this.currentUser.CurrentRole;
    this.currentUser.Messages.push(message); 
  }
}

class Message {
   public Label : string;
}

class Game {
  public GameId : Number;
  public GameName : string;
  public Users: User[] = [];
}

class User {
  public UserId : Number;
  public DisplayName: string;
  public FirstName: string;
  public Di: Dice[] = [];
  public SelectedDice: Dice;
  public IsRollEnabled : boolean;
  public Messages : Message[] = [];
  public CurrentRole : number;
}

class Dice {
  public DiceId : Number;
  public IsDisabled: boolean = true;
  public Value: string;
}
