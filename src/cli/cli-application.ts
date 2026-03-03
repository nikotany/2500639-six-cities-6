import { CommandParser } from './command-parser.js';
import { Command } from './command/command.interface';

type CommandCollection = Record<string, Command>;


export class CLIApplication {
  private commands: CommandCollection = {};

  constructor(
    private readonly defaultCommand: string = '--help'
  ){}

  public registerCommand(commandList: Command[]):void {
    commandList.forEach((command) => {
      if(Object.hasOwn(this.commands, command.getName())){
        throw new Error(`Command ${command.getName()} is already registered`);
      }
      this.commands[command.getName()] = command;
    });
  }

  public getCommand(commandName: string): Command{
    return this.commands[commandName] ?? this.getDefaulCommand();
  }

  public getDefaulCommand(): Command | never {
    if (! this.commands[this.defaultCommand]) {
      throw new Error(`The default command (${this.defaultCommand}) is not resistered`);
    }

    return this.commands[this.defaultCommand];
  }

  public processCommand(argv: string[]): void {
    const parsedCommand = CommandParser.parse(argv);
    const [commandName] = Object.keys(parsedCommand);
    const command = this.getCommand(commandName);
    const commandArguments = parsedCommand[commandName] ?? [];
    command.execute(...commandArguments);
  }
}
