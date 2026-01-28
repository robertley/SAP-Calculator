// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
    context(
        path: string,
        deep?: boolean,
        filter?: RegExp,
    ): {
        keys(): string[];
        <T>(id: string): T;
    };
};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    { teardown: { destroyAfterEach: true } },
);

// Then we find all the tests.
// Updated path to search src directory from tests directory
const context = require.context('../src', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
