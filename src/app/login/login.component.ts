import { Observable } from "rxjs/Observable";
import { Component, OnInit } from "@angular/core";
import { NgModel } from "@angular/forms";
import { AuthService } from "../service/auth.service";
import { GameService } from "../service/game.service";

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "angularfire2/firestore";

import { Dice, Message, Game, Player } from "../app";
import { AngularFireAuth } from "angularfire2/auth";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  constructor(
    private afs: AngularFirestore,
    private gameService: GameService,
    private afa: AngularFireAuth,
    private route: Router,
    private authService : AuthService,
  ) {}

  playersCollection: AngularFirestoreCollection<Player>;
  playerDoc : AngularFirestoreDocument<Player>;
  player: Observable<Player>;
  gameDoc : AngularFirestoreDocument<Game>;
  game : Observable<Game>;

  email: string;
  password: string;
  errormessage: string;
  infomessage: string;
  showError: boolean;
  showInfo: boolean;

  ngOnInit() {}

  clear() {
    this.showError = false;
    this.showInfo = false;
  }

  register() {
    this.clear();
    if (!this.email || this.email.trim() == "") {
      this.showError = true;
      this.errormessage = "Please enter an email address";
    } else if (!this.password || this.password.trim() == "") {
      this.showError = true;
      this.errormessage = "Please enter a password";
    } else {
      this.afa.auth
        .createUserWithEmailAndPassword(
          this.email,
          this.password
        )
        .then(
          data => {
            if (this.email) {
              this.showInfo = true;
              this.infomessage =
                "Registration Successful.  Please check and validate your email address.";
            } else {
              this.showError = true;
              this.errormessage =
                "Error sending password reset email.  Please try again.";
            }
            // Send verification email after registration.
            let user = this.afa.auth.currentUser;
            user.sendEmailVerification();
          },
          error => {
            console.log("error");
            console.log(error);
            this.showError = true;
            this.errormessage = "Registration Error: " + error.message;
          }
        );
    }
  }

  forgotPassword() {
    this.clear();
    if (!this.email || this.email.trim() == "") {
      this.showError = true;
      this.errormessage = "Please enter your email address";
    }
    this.afa.auth.sendPasswordResetEmail(this.email).then(
      (resp) => {
        if (this.email) {
          this.showInfo = true;
          this.infomessage = "Password Reset sent to your email";
        } else {
          this.showError = true;
          this.errormessage =
            "Error sending password reset email.  Please try again.";
        }
      },
      error => {

      }
    )
  }

  login() {
    this.clear(); 
    this.afa.auth.signInWithEmailAndPassword(this.email, this.password).then(
      data => {
        // Send email to user is email is not verified.
        let user = this.afa.auth.currentUser;
        if (!data.emailVerified) {
          user.sendEmailVerification();
          this.showError = true;
          this.errormessage = "Please validate your email address. ";
          return;
        } 
        
        let email = user.email;
        let playerId: string = user.email.replace(".", "-");
        this.playerDoc = this.afs.doc('players/' + playerId);
        this.player = this.playerDoc.valueChanges();
        this.player.subscribe(g => !g ? this.playerDoc.set(this.gameService.createPlayer(playerId,email)) : console.log('player already exits'));
        this.route.navigate(['/games/' + playerId]);
      },
      error => {
        this.showError = true;
        this.errormessage = "Login Failed";
        console.log("Error Message from server");
        console.log(error.message);
      }
    );
  }
}
