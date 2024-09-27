#! /usr/bin/env node

const { Command } = require("commander");
const fs = require("fs");
const path = require("path");
const figlet = require("figlet");

const program = new Command();

console.log(figlet.textSync("RPG Story - First Edition"));

program
  .version("1.0.0")
  .name("rpgstory")
  .description("The first edition of RPG Story, an interactive rpg game on the CLI")
  .parse(process.argv);

const options = program.opts();

if (!process.argv.slice(2).length) {
    program.outputHelp();
  }