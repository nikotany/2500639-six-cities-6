type ParserCommand = Record<string, string[]>

export class CommandParser {
  static parse(cliArguments: string[]): ParserCommand {
    const parsedCommand: ParserCommand = {};

    let currentCommand = '';

    for(const argument of cliArguments){
      if(argument.startsWith('--')){
        parsedCommand[argument] = [];
        currentCommand = argument;
      } else if (currentCommand && argument){
        parsedCommand[currentCommand].push(argument);
      }
    }

    return parsedCommand;
  }
}
