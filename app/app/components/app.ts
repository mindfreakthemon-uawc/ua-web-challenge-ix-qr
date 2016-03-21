import { Component } from 'angular2/core';

import { Lexer } from '../../translator/lexer';
import { Parser } from '../../translator/parser';
import {
    FunctionDuplicateDefineChecker,
    OperationArityChecker,
    FunctionCallChecker
} from '../../translator/checker';
import { Evaluater } from '../../translator/evaluater';


@Component({
    selector: 'app',
    templateUrl: 'app/templates/app.jade'
})
export class App {
    source: string;

    stack: string;
    
    result: string;

    checks() {
        return [
            FunctionDuplicateDefineChecker,
            OperationArityChecker,
            FunctionCallChecker
        ];
    }

    transform() {
        let lexer = new Lexer(this.source);
        let tokens = lexer.tokenize();
        let parser = new Parser(tokens);
        let program;
        let evaluater;

        try {
            program = parser.parse();

            this.checks()
                .forEach(CheckerConstructor => {
                    let checker = new CheckerConstructor(program);

                    checker.check();
                });

            evaluater = new Evaluater(program);
            
            this.result = evaluater.evaluate();
        } catch (e) {
            this.stack = e.toString();
            return;
        }
    }
}

