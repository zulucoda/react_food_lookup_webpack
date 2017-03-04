/**
 * Created by Muzikayise Flynn Buthelezi (zuluCoda) on 2017/03/04.
 * Copyright mfbproject.co.za - muzi@mfbproject.co.za
 * Copyright zulucoda - mfbproject
 */
import { shallow } from 'enzyme';
import React from 'react';
import FoodSearch from '../src/FoodSearch';
import Client from '../src/Client';

jest.mock('../src/Client');

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

  describe('user populates search field', function () {
    const value = 'brocc';

    beforeEach(function () {
      const input = wrapper.find('input').first();
      input.simulate('change', {
        target: { value: value }
      });
    });

    afterEach(function () {
      Client.search.mockClear();
    });

    it('should update state property `searchValue`', function () {
      expect(wrapper.state().searchValue).toEqual(value);
    });

    it('should display the remove icon', function () {
      expect(wrapper.find('.remove.icon').length).toBe(1);
    });

    it('should call `Client.Search()` with `value`', function () {
      const invocationArgs = Client.search.mock.calls[ 0 ];
      expect(invocationArgs[ 0 ]).toEqual(value);
    });

    describe('and API returns results', function () {
      const foods = [
        {
          description: 'Broccolini',
          kcal: '100',
          protein_g: '11',
          fat_g: '21',
          carbohydrate_g: '31'
        }, {
          description: 'Broccoli rabe',
          kcal: '200',
          protein_g: '12',
          fat_g: '22',
          carbohydrate_g: '33'
        }
      ];

      beforeEach(function () {
        const invocationArgs = Client.search.mock.calls[ 0 ];
        const cb = invocationArgs[ 1 ];
        cb(foods);
        wrapper.update();
      });

      it('should set the state property foods', function () {
        expect(
          wrapper.state().foods
        ).toEqual(foods);
      });

      it('should display two rows', function () {
        expect(wrapper.find('tbody tr').length).toEqual(2);
      });

      foods.map((food) => {
        it(`should render the description for: ${food.description}`, function () {
          expect(wrapper.html()).toContain(food.description);
        });
      });
    });
  });
});
