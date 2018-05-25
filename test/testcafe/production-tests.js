import {ClientFunction, RequestLogger, Selector} from 'testcafe';
import fs from 'fs';


const getLocation = ClientFunction(() => document.location.href);
const script_loader_function = new Function(fs.readFileSync('./test/testcafe/test-snippet.js').toString());

fixture `Test Page`
  .page `https://prodperfect.github.io/html5-test-page/`;

const logger = RequestLogger('test.datapipe.prodperfect.com');

test.requestHooks(logger)('0 Pageview', async t => {
  await t.expect(getLocation()).contains('/html5-test-page/');
  await t.eval(script_loader_function);
  await t.wait(2000);

  debugger;
  await t.expect(logger.count(r => r.response.statusCode.includes('200'))).eql(1);

});
