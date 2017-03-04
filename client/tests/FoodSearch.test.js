/**
 * Created by Muzikayise Flynn Buthelezi (zuluCoda) on 2017/03/04.
 * Copyright mfbproject.co.za - muzi@mfbproject.co.za
 * Copyright zulucoda - mfbproject
 */
import { shallow } from 'enzyme';
import React from 'react';
import FoodSearch from '../src/FoodSearch';

describe('FoodSearch', function () {
    let wrapper;

    beforeEach(function () {
        wrapper = shallow(<FoodSearch/>);
    });

    describe('initial state', function () {
        it('should not display the remove icon', function () {
            expect(wrapper.find('.remove.icon').length).toBe(0);
        });
        
        it('should display zero rows', function () {
            expect(wrapper.find('tbody tr').length).toBe(0);
        });
    });
});
