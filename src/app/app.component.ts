import { PubNubAngular } from "pubnub-angular2";
import { OnInit, Component } from "@angular/core";
import * as _ from "lodash";
import { AuthService } from "./service/auth.service";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "angularfire2/firestore";
import { Player } from "./bug-bear";
import { GameService } from "./service/game.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private route: Router,
    private gameService: GameService,
    private afa: AngularFireAuth,
  ) {}

  ngOnInit(): void {
    // for some reason, the login doesn't work properly here.
    this.afa.authState.subscribe(user => {
      console.log("Authentication State Changed...");
      console.log(user);

      if (!user) {
        this.route.navigate(["/login"]);
      } else {
        let playerId: string = user.email.replace(".", "-");
        this.route.navigate(['/games/' + playerId]);
      };

    });
  }
}
