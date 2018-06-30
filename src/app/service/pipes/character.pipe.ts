import { Pipe, PipeTransform } from "@angular/core";
import { Character } from "../../app";

@Pipe({
  name: "character"
})
export class CharacterPipe implements PipeTransform {
  transform(c: Character[], args?: any): any {
    if (args) {
      console.log("Transforming..");
      console.log(c);
      console.log(args);
      return c.filter(s => s.CharacterID == args);
    }
  }
}
