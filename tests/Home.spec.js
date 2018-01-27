import React from 'react'
import axios from 'axios'
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'

import Home from '../client/Home.jsx'

describe('<Home /> componentDidMount', () => {
  let renderedInstance,
  renderedElement,
  fakePromise1,
  fakePromise2,
  sandbox,
  user

  before(() => {
    chai.use(sinonChai)
  })

  describe('componentDidMountSignedIn', () => {
      beforeEach(() => {
        sandbox = sinon.sandbox.create()
        user = {id: 1}
        renderedElement = shallow(<Home />)
        renderedInstance = renderedElement.instance()
        fakePromise1 = new Promise(resolve => {
          resolve(user)
        })
        sandbox.stub(axios, 'get').returns(fakePromise1)
        sandbox.stub(renderedInstance, 'setState')
        renderedInstance.componentDidMount()
      })
      afterEach(() => {
        sandbox.restore()
      })

      it('should have sent a request to the API endpoint', () => {
        expect(axios.get).to.have.callCount(1)
        expect(axios.get).to.be.calledWith('/api/auth')
      })
  })

  // let fakePromiseSignedOut =
})
