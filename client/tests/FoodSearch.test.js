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
  const onFoodClick = jest.fn();

  beforeEach(function () {
    wrapper = shallow(<FoodSearch onFoodClick={onFoodClick}/>);
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
      onFoodClick.mockClear();
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

      describe('then user clicks food item', function () {
        beforeEach(function () {
          const foodRow = wrapper.find('tbody tr').first();
          foodRow.simulate('click');
        });

        it('should call prop `onFoodClick` with `food`', function () {
          const food = foods[ 0 ];
          expect(onFoodClick.mock.calls[ 0 ]).toEqual([ food ]);
        });
      });

      describe('then user types more', function () {
        const moreValue = 'X';
        beforeEach(function () {
          const input = wrapper.find('input').first();
          input.simulate('change', {
            target: { value: moreValue }
          });
        });

        describe('and the API returns no results', function () {
          beforeEach(function () {
            const secondInvocationArgs = Client.search.mock.calls[ 1 ];
            const cb = secondInvocationArgs[ 1 ];
            cb([]);
            wrapper.update();
          });

          it('should set the state property `foods`', function () {
            expect(wrapper.state().foods).toEqual([]);
          });
        });
      });

      describe('then user clicks on X remove icon', function () {
        beforeEach(function () {
          const removeIcon = wrapper.find('.remove.icon').first();
          removeIcon.simulate('click');
        });

        it('should update state property `searchValue` to empty value', function () {
          expect(wrapper.state().searchValue).toEqual('');
        });
        it('shoudld update state property `foods` to empty array', function () {
          expect(wrapper.state().foods).toEqual([]);
        });
        it('should update state property `showRemoveIcon` to false', function () {
          expect(wrapper.state().showRemoveIcon).toBeFalsy();
        });
        it('should not display the remove icon', function () {
          expect(wrapper.find('.remove.icon').length).toBe(0);
        });
        it('should not display any rows', function () {
          expect(wrapper.find('tbody tr').length).toBe(0);
        });
      });
    });
  });
});
