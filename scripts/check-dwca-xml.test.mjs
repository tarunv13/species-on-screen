#!/usr/bin/env node
/*
  scripts/check-dwca-xml.test.mjs
  --------------------------------
  Unit test for the pure well-formedness scanner (checkXmlWellFormed in
  check-dwca-xml.js). Asserts it accepts realistic well-formed XML and
  discriminates each failure mode it claims to catch — mirroring the
  negative-testing precedent set by check-manifest.js / check-bindings.js
  (a check that only ever passes proves nothing). Dependency-free (Node
  stdlib). Exit 0 iff every assertion passes.
*/
import { checkXmlWellFormed } from './check-dwca-xml.js';

let failures = 0;
const check = (name, cond) => { if (!cond) { failures++; console.error(`  FAIL: ${name}`); } };

// --- well-formed inputs should produce zero errors ---

const declOnly = '<?xml version="1.0" encoding="UTF-8"?>\n<root><child attr="a &gt; b">text</child></root>';
check('declaration + nested element: no errors', checkXmlWellFormed(declOnly).length === 0);

const withComment = '<?xml version="1.0"?>\n<!-- a comment with < and > and & inside -->\n<root/>';
check('comment content is opaque (ignored): no errors', checkXmlWellFormed(withComment).length === 0);

const withCdata = '<root><![CDATA[raw <tag> & text]]></root>';
check('CDATA content is opaque: no errors', checkXmlWellFormed(withCdata).length === 0);

const selfClosingRoot = '<root attr="x"/>';
check('single self-closing root: no errors', checkXmlWellFormed(selfClosingRoot).length === 0);

const properEntities = '<root>Smith &amp; Jones report &#169; and &#x2019;</root>';
check('valid entity references (named, decimal, hex): no errors', checkXmlWellFormed(properEntities).length === 0);

const quotedAngleInAttr = '<root><a href="x?y>z">t</a></root>';
check("'>' inside a quoted attribute value does not end the tag early", checkXmlWellFormed(quotedAngleInAttr).length === 0);

// --- each claimed failure mode should be caught ---

check('unclosed tag is caught', checkXmlWellFormed('<root><child></root>').length > 0);

check('mismatched closing tag is caught', checkXmlWellFormed('<root><child></wrong></root>').length > 0);

check('multiple root elements is caught', checkXmlWellFormed('<a/><b/>').length > 0);

check('no root element is caught', checkXmlWellFormed('<?xml version="1.0"?>\n<!-- just a comment -->').length > 0);

check('unescaped bare ampersand in text is caught', checkXmlWellFormed('<root>Smith & Jones</root>').length > 0);

check('unescaped ampersand inside an attribute value is caught', checkXmlWellFormed('<root note="Smith & Jones"/>').length > 0);

check('closing tag with no matching open tag is caught', checkXmlWellFormed('<root></child></root>').length > 0);

if (failures) {
  console.error(`\ncheck-dwca-xml.test: FAIL — ${failures} assertion(s).\n`);
  process.exit(1);
}
console.log('check-dwca-xml.test: PASS (well-formed XML accepted; every claimed failure mode discriminated)');
