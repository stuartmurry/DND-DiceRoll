import { OnInit, Component } from '@angular/core';
import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  public domains: Domain[] = [];
  public domain: Domain;

  ngOnInit(): void {


    let d = new Domain();
    d.ID = 1;
    d.IsClicked = true;
    d.Name = "Domain #1";
    d.DidgetCount = 10;
    d.OpenDidgetCount = 5;
    d.OpenDBTableCount = 2;

    this.domains.push(d);

    let d2 = new Domain();
    d2.ID = 2;
    d2.IsClicked = false;
    d2.Name = "Domain #2";
    d2.DidgetCount = 8;
    d2.OpenDidgetCount = 6;
    d2.OpenDBTableCount = 5;

    this.domains.push(d2);
    this.domain = this.domains[0];

    this.SetChartAxis();
  }


  SetChartAxis() {
    console.log('Setting Chart Axis');
    // Map all domain names and place them into an array for chart.js.
    //this.barChartLabels = this.domains.map(function(ddd){ return ddd.Name; });
    var d = this.domain;
    this.barChartLabels = [d.Name];

    this.barChartData = [
      { data: [d.DidgetCount], label: 'Didgets' },
      { data: [d.OpenDidgetCount], label: 'Open Didgets' },
      { data: [d.OpenDBTableCount], label: 'OpenDB Tables' }
    ];
  }

  ClickDomain(d: Domain) {
    this.ResetDomains();
    d.IsClicked = true;
    this.domain = d;
    this.SetChartAxis();
  }

  ResetDomains() {
    _.each(this.domains, function (dd) {
      dd.IsClicked = false;
    });
  }

  // Chart Data
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels: string[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

}

class Domain {
  public OpenDBTableCount: number;
  public OpenDidgetCount: any;
  public DidgetCount: number;
  public ID: number;
  public Name: string;
  public IsClicked: boolean = false;
  public Containers: Container[] = [];
  public TableDefinitions : TableDefinition[] = [];

}

class Container {


}

class TableDefinition {
  public Name : string;

}
