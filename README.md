# angular-nav-menu

Write a simple mobile nav menu using angular.io, typescript, bootstrap, font-awesome, and router.

Some key technologies used here are:

* Angular.io 5.2
* Angular-CLI
* Font Awesome 5
* Bootstrap 4
* Angular Routing - SPA Framework
* RxJS
* Event Handling
* TypeScript
* EcmaScript
* GitHub Pages
* HTML 5
* CSS

# setup environment

install node.js

# Dependencies

angular-cli

angular-cli-ghpages

github-pages enabled (Found in the settings menu) (Also, do this after initial ngh deployment)

# Caution

`ng github-pages:deploy` has been deprecated.  Use `ngh` instead.

# Instructions

`npm i -g angular-cli@latest`

`npm i -g angular-cli-ghpages@latest`

`git clone https://github.com/stuartmurry/zekes.git` 

`cd angular-nav-menu`

To run locally

`ng serve`

# To deploy to Github Pages

Create a new repository on Github.  Find the clone or download button.  You will see an https link. 

`git remote add origin https://github.com/<repository-name>/<project>.git`

Build Project. (p.s. Don't forget to include the forward slash at the end otherwise, the browser will fix url and all references to your files will be lost.)

`ng build --prod --base-href "https://<repository-name>.github.io/<project>/"`

Deploy to GitHub Pages

`ngh`

Go into `settings` within your Github account and select `settings` tab. Find Github Pages and select `gh-pages` branch from the dropdown menu.  `ngh` should do this automatically, however, its always safe to double check.

# Create From Scratch

Using the angular-cli, create a new angular project.

`ng new angular-nav-menu`

`cd angular-nav-menu`

`npm install --save @ng-bootstrap/ng-bootstrap`

Jump to `To deploy to Github Pages` and follow those instructions.

# Mockup

![alt text](https://raw.githubusercontent.com/stuartmurry/angular-nav-menu/master/mockup.jpg)

# Nav Template

5 lines says it all.  

```html

<div class="container nav-container" [style.height.px]="height">
  <div *ngFor="let m of menuItems" (click)="navClick(m)" [ngStyle]="{ 'flex-grow' : m.GrowFactor }" class="item" [ngClass]="{ 'bkgnd-closed' : IsClosed(m), 'bkgnd-open' : IsOpen(m) }">
    <i data-fa-transform="grow-3" class="icon {{ m.FontAwesomeCategory }} {{ m.FontAwesome }}"></i> {{m.name}}
  </div>
</div>

```




