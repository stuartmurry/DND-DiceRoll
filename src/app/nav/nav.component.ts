import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "../service/auth.service";
import { Router } from "@angular/router";
import { Player } from "../app";
import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private afa: AngularFireAuth
  ) {}

  player: Player;

  PlayerId: string;

  ngOnInit() {
    // this.authService.player.subscribe((p) => {
    //   this.PlayerId = p.PlayerID;
    // });
  }

  @Input() name: string = "<Not Set>";

  logout() {
    console.log("signing outs");
    // this.authService.logout();
    this.afa.auth.signOut();
  }

  games() {
    console.log("games");
    this.router.navigate(["/games/" + this.getPlayerId()]);
  }

  characters() {
    console.log("characters");
    this.router.navigate(["/characters/" + this.getPlayerId()]);
  }

  profile() {
    console.log("profile");
    this.router.navigate(["/profile/" + this.getPlayerId()]);
  }

  getPlayerId() {
    let user = this.afa.auth.currentUser;
    let playerId: string = user.email.replace(".", "-");
    // this.route.navigate(["/games/" + playerId]);
    return playerId;
  }
}
