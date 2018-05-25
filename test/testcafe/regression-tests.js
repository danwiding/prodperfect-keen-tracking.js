import {ClientFunction, RequestLogger, Selector} from 'testcafe';
import fs from 'fs';


const getLocation = ClientFunction(() => document.location.href);
const script_loader_function = new Function(fs.readFileSync('./test/testcafe/test-snippet.js').toString());

fixture `Test Page`
  .page `https://cbracco.github.io/html5-test-page/`;

const logger = RequestLogger('test.datapipe.prodperfect.com');

test.requestHooks(logger)('0 Pageview', async t => {
  await t.expect(getLocation()).contains('/html5-test-page/');
  await t.eval(script_loader_function);
  await t.wait(2000);
});

test('1 Click', async t => {
  await t.expect(getLocation()).contains('/html5-test-page/');

  await t.eval(script_loader_function);
  await t.wait(2000);
  await t.click('a[href="#text"]');

  await t.eval(script_loader_function);
  await t.wait(2000);
  await t.click('input[value="<input type=button>"]');
  await t.wait(1000);
});

test('2 Form submission', async t => {
  await t.expect(getLocation()).contains('/html5-test-page/');

  await t.eval(script_loader_function);
  await t.wait(2000);
  await t.click('input[value="<input type=submit>"]');
  await t.wait(1000);
});

test('3 Input change', async t => {
  await t.expect(getLocation()).contains('/html5-test-page/');

  await t.eval(script_loader_function);
  await t.wait(2000);
  await t.typeText('#input__text', 'text');
  await t.typeText('#textarea', 'text');
  await t.wait(1000);
});
