import React from 'react'
import Enzyme, {shallow} from 'enzyme';
import chai, {expect} from 'chai'
import sinon from 'sinon';
import sinonChai from 'sinon-chai'
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter(), disableLifecycleMethods: true });
import Home from '../client/Home.jsx'
import axios from 'axios'

//custom error to mimic a 401 unauthorized error
class CustomError extends Error{
  constructor(status, ...params){
    super(params)
    this.response = {
      status
    }
  }
}


describe('<Home /> componentDidMount', () => {
  let renderedElement = shallow(<Home />)
  let renderedInstance = renderedElement.instance()
  let sandbox = sinon.sandbox.create()
  let err = new CustomError(401)

  before(() => {
    chai.use(sinonChai)
  })

  describe('componentDidMountSignedIn', () => {
      beforeEach(() => {
        sandbox.stub(renderedInstance, 'checkToken').throws(err)
        sandbox.stub(renderedInstance, 'setState')
        sandbox.stub(renderedInstance, 'handleComponentError')
      })

      afterEach(() => {
        sandbox.restore()
      })

      it('checkToken error is handled by handleComponentError', async () => {
          sandbox.stub(renderedInstance, 'checkLoggedIn').resolves(true)
          await renderedInstance.componentDidMount()
          expect(renderedInstance.checkToken).to.have.callCount(1)
          expect(renderedInstance.handleComponentError).to.have.callCount(1)
      })
      it('if not logged in sets state of loggedInModal to true', async () => {
          sandbox.stub(renderedInstance, 'checkLoggedIn').resolves(false)
          await renderedInstance.componentDidMount()
          expect(renderedInstance.setState).to.have.callCount(1)
          expect(renderedInstance.setState).to.be.calledWith({loggedInModal: true})
      })
    })

    describe('handlecomponenterror', () => {
      it('calls handlerefresh if error.response.status === 401', async () => {
        sandbox.stub(renderedInstance, 'handleRefresh')
        await renderedInstance.handleComponentError(err)
        expect(renderedInstance.handleRefresh).to.have.callCount(1)
      })
    })

    describe('checkloggedIn', () => {
      it('if logged in, sets local storage with access token and refresh token', async () => {
        sandbox.stub(axios, 'get').resolves({data: {accessToken: '123', refreshToken: '456'}})
        await renderedInstance.checkLoggedIn()
        expect(localStorage.getItem('currentAccessToken')).to.equal('123')
        expect(localStorage.getItem('currentRefreshToken')).to.equal('456')
      })
    })
  })



