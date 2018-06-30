import { PubNubAngular } from "pubnub-angular2";
import { Component, OnInit, Input } from "@angular/core";
import {
  Dice,
  Message,
  Game,
  Player,
  PubNubItem,
  PubNubMessage,
  Character
} from "../app";
import { GameService } from "../service/game.service";
import { ActivatedRoute, Router, ParamMap } from "@angular/router";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mergeMap";
import { zip } from "rxjs/observable/zip";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from "angularfire2/firestore";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit {
  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private router: Router,
    private pubnub: PubNubAngular,
    private afs : AngularFirestore
  ) {
    this.pubnub.init({
      publishKey: "pub-c-93c49e93-c81e-45f7-bd7c-c4ba578a8a36",
      subscribeKey: "sub-c-2c32517c-12e6-11e8-bb84-266dd58d78d1"
    });
  }

  playerCollection : AngularFirestoreCollection<Player>;
  player: Observable<Player>;
  selectedCharacter : Character;
  // character : Observable<Character>;

  playerid : string;
  gameid:string;
  gameCollection : AngularFirestoreCollection<Game>;
  game : Observable<Game>;
  gameDoc : AngularFirestoreDocument<Game>;
  currentGame : Game;
  messages : Message[];
  IsRollEnabled : boolean;
  diceQueue : Dice[];

  currentPlayer : Player;

  connectPubNub(game : Game) {
    console.log('Connecting PubNub');
    var channel = game.Channel;
    
    this.pubnub.subscribe({
      channels: [channel]
    });

    var __this = this;
    this.pubnub.history(
      {
        channel: channel,
        reverse: true // Setting to true will traverse the time line in reverse starting with the oldest message first.
        // count: 100, // how many items to fetch
        // stringifiedTimeToken: true, // false is the default
        // start: "123123123123", // start time token to fetch
        // end: "123123123133" // end timetoken to fetch
      },
      function(status, response) {
        // handle status, response
        if (status.statusCode == 200) {
          console.log("History");
          response.messages.forEach((msg : PubNubItem) => {
            __this.messages.push(msg.entry);
          });
        }
      }
    );

    this.pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === "PNConnectedCategory") {
          console.log("PNConnectedCategory");
        } else if (statusEvent.category === "PNUnknownCategory") {
          var newState = {
            new: "error"
          };
          this.pubnub.setState(
            {
              state: newState
            },
            function(status) {
              console.log(status);
              // console.log(statusEvent.errorData.message);
            }
          );
        }
      },
      message: function(message: PubNubMessage) {
        console.log("Incoming Message:");
        console.log(message);
        __this.messages.push(message.message);
      }
    });
  }

  ngOnInit() {

    console.log("Initializing Player Screen");

    this.route.params.subscribe(params => {

      this.messages = [];
      this.diceQueue = [];

      this.playerid = params["playerid"];
      this.playerCollection = this.afs.collection('players');
      this.player = this.playerCollection.doc<Player>(this.playerid).valueChanges();
      this.player.subscribe(p => this.currentPlayer = p);

      this.gameid = params["gameid"];
      this.gameCollection = this.afs.collection('games');
      this.gameDoc = this.gameCollection.doc<Game>(this.gameid);
      this.game = this.gameDoc.valueChanges();
      this.game.subscribe(g => {
        this.currentGame = g;
        this.selectedCharacter = g.Characters[this.playerid];
        this.connectPubNub(g);
      });

    });

    
    
    // var game$ = Observable.of(this.gameService.getCurrentGame());
    // game$.subscribe(x => x ? x : this.router.navigate(["/games"])); // Route to games if no game exists.
    // var player$ = this.route.paramMap.switchMap((params: ParamMap) => {
    //   // (+) before `params.get()` turns the string into a number
    //   let id = +params.get("id");
    //   return Observable.of(this.gameService.getPlayer(id));
    // });

    // // Wait for game and player service to finish then setup messaging. Messenger requires values from them.
    // zip(game$, player$, (game: Game, player: Player) => ({
    //   game,
    //   player
    // })).subscribe(pair => { 
    //   this.player = pair.player;
    //   this.game = pair.game;
    //   this.connectPubNub(pair.player, pair.game);
    // });
  }

  clickSelectDice(d: Dice) {
    console.log("Clicking on Dice");

    // Clear existing dice
    _.each(this.selectedCharacter.Di, function(d) {
      d.IsDisabled = true;
    });

    // Set the current dice
    d.IsDisabled = false;
    this.IsRollEnabled = true;

    // Add dice to the queue
    this.diceQueue.push(d);
  }

  clearDiceSelection() {
    this.diceQueue = []; // Clear selected Di
    this.IsRollEnabled = false;
  }

  click_no_op() {
    // do nothing.  Used to make sure clearDiceSelection() in not called in certain areas.
  }

  roll(c : Character) {
    console.log('Player');
    console.log(c);

    // Hook to web service
    
    let totalRoleValue = 0;
    let diceMath: string[] = [];
    _.each(this.diceQueue, function(d) {
      var rolledValue = Math.floor(Math.random() * +d.Val + 1);
      diceMath.push("D" + d.Val + "(" + rolledValue + ")");
      d.RolledValue = rolledValue;
      totalRoleValue = totalRoleValue + rolledValue;
    });

    var message : Message = {
      RolledValue : totalRoleValue,
      RolledDi :  this.diceQueue,
      Label :
        c.name +
        " [" +
        diceMath.join("+") +
        "] just rolled a " +
        totalRoleValue
    };

    

    // this.game.Messages.push(message);

    this.pubnub.publish(
      {
        message: message,
        channel: this.currentGame.Channel
      },
      function(status, response) {
        if (status.error) {
          console.log(status);
        } else {
          console.log("message Published w/ timetoken", response.timetoken);
        }
      }
    );

    this.clearDiceSelection();
  }
}
