import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { Player } from '../app';
import { Observable } from 'rxjs/Observable';
import { PlayerComponent } from '../player/player.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  playerDoc : AngularFirestoreDocument<Player>;
  player : Observable<Player>;
  constructor(private afs : AngularFirestore, private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let playerid : string = params["playerid"];
      this.playerDoc = this.afs.doc('players/' + playerid);
      this.player = this.playerDoc.valueChanges();
    });
  }

  submit(p : Player){
    // console.log(p);
    this.playerDoc.update(p);
  }

}
