import { environment } from '../environments/environment'

import { PubNubAngular } from "pubnub-angular2";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { FormsModule } from '@angular/forms';

import { AppComponent } from "./app.component";

// Zeekes
import { PlayerComponent } from "./player/player.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { GamesComponent } from "./games/games.component";
import { GameService } from "./service/game.service";
import { Globals } from "./globals";

// Cloud Firestore
import { AngularFireModule } from 'angularfire2';
import { AngularFirestore } from 'angularfire2/firestore'
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AuthService } from "./service/auth.service";
import { LoginComponent } from './login/login.component';
import { NavComponent } from './nav/nav.component';
import { PlayerSetupComponent } from './player-setup/player-setup.component';
import { InviteComponent } from './invite/invite.component';
import { CharacterComponent } from './character/character.component';
import { ProfileComponent } from './profile/profile.component';
import { CharactersComponent } from './characters/characters.component';
import { CharacterPipe } from './service/pipes/character.pipe';
import { CharacterSelectionComponent } from './character-selection/character-selection.component';


const appRoutes: Routes = [
  { path: "player/:playerid/:gameid", component: PlayerComponent },
  { path: "player-setup", component: PlayerSetupComponent },
  { path: "characters/:playerid", component: CharactersComponent },
  { path: "character/:playerid/:characterid", component: CharacterComponent },
  { path: "profile/:playerid", component: ProfileComponent },
  { path: "invite/:gameid", component: InviteComponent },
  { path: "character-selection/:gameid/:playerid", component: CharacterSelectionComponent },
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  { path: "games/:playerid", component: GamesComponent },
  { path: "login", component: LoginComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    PageNotFoundComponent,
    GamesComponent,
    LoginComponent,
    NavComponent,
    PlayerSetupComponent,
    InviteComponent,
    CharacterComponent,
    ProfileComponent,
    CharactersComponent,
    CharacterPipe,
    CharacterSelectionComponent,
    
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    ),
    ChartsModule,
    FormsModule,
  ],
  //https://github.com/angular/angularfire2/blob/master/docs/version-4-upgrade.md
  providers: [PubNubAngular, GameService, AngularFirestore, AuthService, Globals], 
  bootstrap: [AppComponent]
})
export class AppModule {}
