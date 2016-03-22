import { Component } from 'angular2/core';

import { Lexer } from '../../translator/lexer';
import { Parser } from '../../translator/parser';
import {
    OperationArityChecker
} from '../../translator/checker';
import { Evaluater } from '../../translator/evaluater';


@Component({
    selector: 'app',
    templateUrl: 'app/templates/app.jade'
})
export class App {

    resultAvailable = false;

    source: string;

    time: string;
    stack: string;
    error: string;
    result: string;
    tokens: string[];

    checks() {
        return [
            OperationArityChecker
        ];
    }

    transform() {
        this.resultAvailable = false;

        this.stack = null;
        this.result = null;
        this.error = null;
        this.tokens = null;

        let source = this.source;

        if (!source) {
            return;
        }

        let time = this.now();

        let lexer = new Lexer(source);
        let tokens = lexer.tokenize();
        let parser = new Parser(tokens);
        let program;
        let evaluater;

        this.tokens = tokens.map(token => token.toKind());

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
            this.error = e.toString();
        }

        this.time = (this.now() - time).toFixed(2);

        this.resultAvailable = true;
    }

    now(): number {
        if (performance) {
            return performance.now();
        }

        return Date.now();
    }
}

