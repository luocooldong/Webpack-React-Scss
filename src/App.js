import React, { Component,  } from 'react';
import PropTypes from 'prop-types';
import './App.css';
const TOGGLE_CONTEXT = '__toggle__'

const ToggleOn = withToggle(({children, on}) => {
  return on ? children : null
})
const ToggleOff = withToggle(({children, on}) => {
  return on ? null : children
})
const ToggleButton = withToggle(
  ({on, toggle, ...props}) => {
    return (
      <Switch
        on={on}
        onClick={toggle}
        {...props}
      />
    )
  },
)

class Toggle extends React.Component {
  static On = ToggleOn
  static Off = ToggleOff
  static Button = ToggleButton
  static defaultProps = {onToggle: () => {}}
  static childContextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired,
  }

  state = {on: false}
  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  getChildContext() {
    return {
      [TOGGLE_CONTEXT]: {
        on: this.state.on,
        toggle: this.toggle,
      },
    }
  }
  render() {
    return <div>{this.props.children}</div>
  }
}

function withToggle(Component) {
  function Wrapper(props, context) {
    const toggleContext = context[TOGGLE_CONTEXT]
    return (
      <Component {...toggleContext} {...props} />
    )
  }
  Wrapper.contextTypes = {
    [TOGGLE_CONTEXT]: PropTypes.object.isRequired,
  }
  return Wrapper
}

const MyToggle = withToggle(({on, toggle}) => (
  <button onClick={toggle}>
    {on ? 'on' : 'off'}
  </button>
))

class App extends Component {
  render() {
    return (
      <Toggle
       onToggle={on => console.log('toggle', on)}
       >
        <Toggle.On>The button is on</Toggle.On>
        <Toggle.Off>The button is off</Toggle.Off>
        <Toggle.Button />
        <hr />
        <MyToggle />
      </Toggle>
    );
  }
}

function Switch({on, className = '', ...props}) {
  return (
    <div className="toggle">
      <input
        className="toggle-input"
        type="checkbox"
      />
      <button
        className={`${className} toggle-btn ${on
          ? 'toggle-btn-on'
          : 'toggle-btn-off'}`}
        aria-expanded={on}
        {...props}
      />
    </div>
  )
}

export default App;
