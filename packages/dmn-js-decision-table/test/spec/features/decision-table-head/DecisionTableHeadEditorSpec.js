
// eslint-disable-next-line
import Inferno from 'inferno';

require('../../../TestHelper');

/* global bootstrapModeler, inject */

import { query as domQuery } from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import { triggerInputEvent } from '../../../util/EventUtil';

import simpleXML from '../../simple.dmn';

import CoreModule from '../../../../lib/core';
import DecisionTableHeadModule from '../../../../lib/features/decision-table-head';
import DecisionTableHeadEditorModule from '../../../../lib/features/decision-table-head/editor';

describe('decision table head editor', function() {

  beforeEach(bootstrapModeler(simpleXML, {
    modules: [
      CoreModule,
      DecisionTableHeadModule,
      DecisionTableHeadEditorModule
    ],
    debounceOnInput: false
  }));

  let testContainer;

  beforeEach(function() {    
    testContainer = TestContainer.get(this);
  });


  it('should render output name', function() {

    // then
    expect(domQuery('.output-name-editor', testContainer)).to.exist;
  });


  describe('output name editing', function() {

    it('should edit output name', inject(function(sheet) {

      // given
      const outputName = domQuery('.output-name', testContainer);

      outputName.focus();

      // when
      triggerInputEvent(outputName, 'foo');

      // then
      const root = sheet.getRoot();
    
      const output = root.businessObject.output[0];
  
      expect(output.name).to.equal('foo');
    }));

  });

});