import should from 'should';
import 'jsdom-global/register';

import MultiSelect from '../dist/storm-multi-select.standalone';

const html = `<select class="js-multi-select" multiple name="test-select">
                <option>Select an option</option>
                <option value="1">option 1</option>
                <option value="2">option 2</option>
                <option value="3">option 3</option>
                <option value="4">option 4</option>
                <option value="5">option 5</option>
                </select>`;

document.body.innerHTML = html;
  
let components = MultiSelect.init('.js-multi-select');


describe('Initialisation', () => {

  it('should return array of length 1', () => {
    //indexed by name attribute
    should(components)
      .Array()
      .and.have.lengthOf(1);

  });

  it('each array item should be an object with DOMElement, settings, init, and  handleClick properties', () => {

    components[0].should.be.an.instanceOf(Object).and.not.empty();
    components[0].should.have.property('node');
    components[0].should.have.property('settings').Object();
    components[0].should.have.property('init').Function()

  });


  it('should throw an error if no elements are found', () => {

    //just console.warns, can't test?
    MultiSelect.init.bind(MultiSelect, '.js-err');

  })

});