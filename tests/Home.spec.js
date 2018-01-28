import React from 'react'
import axios from 'axios'
import chai, {expect} from 'chai';
import {shallow} from 'enzyme';
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import './index'
import Home from '../client/Home.jsx'

describe('<Home /> componentDidMount', () => {
  let renderedInstance,
  renderedElement,
  fakePromiseResolveUser,
  loggedIn,
  sandbox,
  user

  before(() => {
    chai.use(sinonChai)
  })

  describe('componentDidMountSignedIn', () => {
      beforeEach(() => {
        sandbox = sinon.sandbox.create()
        renderedElement = shallow(<Home />)
        renderedInstance = renderedElement.instance()
        sandbox.stub(axios, 'get').returns(fakePromiseResolveUser)
        sandbox.stub(renderedInstance, 'setState')

      })
      afterEach(() => {
        sandbox.restore()
      })

      it('should have sent a request to the API endpoint', () => {
        renderedInstance.componentDidMount()
        expect(axios.get).to.have.callCount(1)
        expect(axios.get).to.be.calledWith('/api/auth')
      })

        describe('Given axios request completed and returns a valid user', () => {

          user = {id: 1}

          fakePromiseResolveUser = new Promise(resolve => {
            resolve(user)
          })

          beforeEach(done => {
            fakePromiseResolveUser
            .then(() => {
              done()
            })
          })

          it('should set state to loggedIn : true', () => {
            renderedInstance.checkLoggedIn()
            .then(res => {
              loggedIn = res
              expect(renderedInstance.setState).to.have.callCount(1)
              expect(renderedInstance.setState).to.be.calledWith(loggedIn)
            })
          })
      })


      describe('Given axios request completed and returns a invalid user', () => {

        user = {}

        fakePromiseResolveUser = new Promise(resolve => {
          resolve(user)
        })

        beforeEach(done => {
          fakePromiseResolveUser
          .then(() => {
            done()
          })
        })

        it('should set state to loggedIn : false', () => {
          renderedInstance.checkLoggedIn()
          .then(res => {
            loggedIn = res
            expect(renderedInstance.setState).to.have.callCount(1)
            expect(renderedInstance.setState).to.be.calledWith(loggedIn)
          })
        })
      })
    })
  })

