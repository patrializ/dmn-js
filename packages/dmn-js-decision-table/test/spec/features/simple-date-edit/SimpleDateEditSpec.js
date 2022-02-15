import { bootstrapModeler, inject } from 'test/helper';

import {
  query as domQuery,
  queryAll as domQueryAll
} from 'min-dom';

import TestContainer from 'mocha-test-container-support';

import {
  triggerInputEvent,
  triggerInputSelectChange,
  triggerClick
} from 'dmn-js-shared/test/util/EventUtil';

import simpleNumberEditXML from './simple-date-edit.dmn';

import CoreModule from 'src/core';
import InteractionEventsModule from 'table-js/lib/features/interaction-events';
import ModelingModule from 'src/features/modeling';
import DecisionRulesEditorModule from 'src/features/decision-rules/editor';
import SimpleDateEditModule from 'src/features/simple-date-edit';

import { getSampleDate } from 'src/features/simple-date-edit/Utils';


describe('simple date edit', function() {

  beforeEach(bootstrapModeler(simpleNumberEditXML, {
    modules: [
      CoreModule,
      InteractionEventsModule,
      ModelingModule,
      DecisionRulesEditorModule,
      SimpleDateEditModule
    ],
    debounceInput: false
  }));

  let testContainer;

  beforeEach(function() {
    testContainer = TestContainer.get(this);
  });

  function openSimpleDateEdit(elementId) {
    const cell = domQuery(`[data-element-id="${ elementId }"]`, testContainer);

    triggerClick(cell);

    const button = domQuery('.simple-mode-button', testContainer);

    triggerClick(button);

    return domQuery('.simple-date-edit', testContainer);
  }


  describe('InputClause', function() {

    it('should render', function() {

      // when
      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      // then
      expect(simpleDateEdit).to.exist;
    });


    it('should change type', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const select = domQuery('.dms-input-select', simpleDateEdit);

      // when
      triggerInputSelectChange(select, 'before', testContainer);

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('< date("2018-01-25")');
    }));


    it('should edit start date', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const input = domQuery('.start-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '2000-01-01');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('date("2000-01-01")');
    }));


    it('should validate start date', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const input = domQuery('.start-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry1.businessObject.text).to
        .equal('date("2018-01-25")');
    }));


    it('should set start date to today', inject(function(elementRegistry) {

      // given
      const inputEntry1 = elementRegistry.get('inputEntry1');

      const simpleDateEdit = openSimpleDateEdit('inputEntry1');

      const button = domQuery('.use-today', simpleDateEdit);

      // when
      triggerClick(button);

      // then
      expect(inputEntry1.businessObject.text).to
        .equal(`date("${ getSampleDate() }")`);
    }));


    it('should edit end date', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const input = domQuery('.end-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '2000-01-01');

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal('[date("2018-01-25")..date("2000-01-01")]');
    }));


    it('should validate end date', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const input = domQuery('.end-date-input .dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal('[date("2018-01-25")..date("2018-01-25")]');
    }));


    it('should set end date to today', inject(function(elementRegistry) {

      // given
      const inputEntry7 = elementRegistry.get('inputEntry7');

      const simpleDateEdit = openSimpleDateEdit('inputEntry7');

      const button = domQueryAll('.use-today', simpleDateEdit)[1];

      // when
      triggerClick(button);

      // then
      expect(inputEntry7.businessObject.text).to

        // eslint-disable-next-line
        .equal(`[date("2018-01-25")..date("${ getSampleDate() }")]`);
    }));


    describe('empty', function() {

      it('should only set once valid', inject(function(elementRegistry) {

        // given
        const inputEntry8 = elementRegistry.get('inputEntry8');

        const simpleDateEdit = openSimpleDateEdit('inputEntry8');

        const select = domQuery('.dms-input-select', simpleDateEdit);

        // when
        triggerInputSelectChange(select, 'between', testContainer);

        // then
        // expect not to have been set yet
        expect(inputEntry8.businessObject.text).to.equal('');

        // when
        const buttons = domQueryAll('.use-today', simpleDateEdit);

        triggerClick(buttons[0]);

        // expect not to have been set yet
        expect(inputEntry8.businessObject.text).to.equal('');

        // when
        triggerClick(buttons[1]);

        // expect not to have been set yet
        expect(inputEntry8.businessObject.text).to

          // eslint-disable-next-line
          .equal(`[date("${ getSampleDate() }")..date("${ getSampleDate() }")]`);
      }));

    });

  });


  describe('OutputClause', function() {

    it('should render', function() {

      // when
      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      // then
      expect(simpleDateEdit).to.exist;
    });


    it('should edit date', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, '2000-01-01');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('date("2000-01-01")');
    }));


    it('should validate date', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      const input = domQuery('.dms-input', simpleDateEdit);

      // when
      triggerInputEvent(input, 'foo');

      // then
      expect(outputEntry1.businessObject.text).to
        .equal('date("2018-01-25")');
    }));


    it('should set date to today', inject(function(elementRegistry) {

      // given
      const outputEntry1 = elementRegistry.get('outputEntry1');

      const simpleDateEdit = openSimpleDateEdit('outputEntry1');

      const button = domQuery('.use-today', simpleDateEdit);

      // when
      triggerClick(button);

      // then
      expect(outputEntry1.businessObject.text).to
        .equal(`date("${ getSampleDate() }")`);
    }));

  });

});