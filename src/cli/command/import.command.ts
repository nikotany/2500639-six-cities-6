import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Command } from './command.interface';
import chalk from 'chalk';

export class ImportCommand implements Command{

  public getName(): string {
    return '--import';
  }

  public execute(...parameters: string[]): void{
    const [fileName] = parameters;
    const fileReader = new TSVFileReader(fileName.trim());

    try{
      fileReader.read();
      chalk.green(console.log(fileReader.toArray()));
    }catch(error){
      if (!(error instanceof Error)){
        throw error;
      }
      chalk.red(console.error(`Can't import data from file: ${fileName}`));
      chalk.red(console.error(`Details: ${error.message}`));
    }
  }
}
