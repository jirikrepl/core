/* global
    Match: false,
    ReactiveVar: false,
    s: false,
    UserAccounts: false,
    UALog: false
*/
'use strict';


// ------------------------------------------
//  Logs the start of execution for this file
// ------------------------------------------
UALog.trace('Loading client.js');

_.extend(UserAccounts, {

  /**
   * Allowed Internal (client-side) States
   */
  _states: [
    'signIn', // Sign In
    'signUp', // Sign Up
  ],

  /**
   *
   */
  currentFramework: 'none',

  /**
   * Default initial state
   */
  defaultState: 'signIn',

  /**
   *
   */
  frameworks: [],

  /**
   *
   */
  skins: {},

  /**
   *
   */
  tmplInstances: [],

  /**
   * applySkin - Apply skin to modules
   *
   * @param  {string} framework description
   * @param  {object} skin      description
   */
  applySkin(framework, skin) {
    var self = this;

    _.each(skin, function skn(elements, moduleName) {
      var module = moduleName === 'uaForm' ? self : self._modules[moduleName];
      if (module) {
        module.skins[framework] = _.extend(
          module.skins[framework] || {},
          elements
        );
      }
    });
    self.frameworks.push(framework);
    self.currentFramework = framework;
  },

  /**
   * init - description
   *
   */
  init() {
    this._startup();
    Template.registerHelper('UserAccounts', UserAccounts);
  },

  /**
   * initFormTemplate - description
   *
   * @param  {type} uaForm description
   */
  initFormTemplate(uaForm) {
    var self = this;
    var data = uaForm.data;
    var objs = _.union(_.values(self._modules), _.values(self._plugins));
    var framework = data && data.framework || self.currentFramework;
    var defaultState = data && data.defaultState || self.defaultState;

    UALog.trace('UserAccounts.initFormTemplate');

    if (!_.contains(self._states, defaultState)) {
      throw Error('Invalid inital state!');
    }

    _.extend(uaForm, {
      /**
       *
       */
      disabled: new ReactiveVar(false),

      /**
       *
       */
      framework,

      /**
       *
       */
      loading: new ReactiveVar(false),

      /**
       *
       */
      state: new ReactiveVar(defaultState),

      /**
       * _isValidState - State validation
       *
       * @param  {string} value description
       * @return {bool}       description
       */
      _isValidState(value) {
        return _.contains(self._states, value);
      },

      /**
       * getState - Getter for current state
       *
       * @return {string}  description
       */
      getState() {
        return this.state.get();
      },

      /**
       * isDisabled - Getter for disabled state
       *
       * @return {bool}  description
       */
      isDisabled() {
        return this.disabled.get();
      },

      /**
       * isLoading - Getter for loading state
       *
       * @return {bool}  description
       */
      isLoading() {
        return this.loading.get();
      },

      /**
       * setLoading - Setter for loading state
       *
       * @param  {bool} value description
       * @return {bool}       description
       */
      setLoading(value) {
        check(value, Boolean);
        return this.loading.set(value);
      },

      /**
       * setDisabled - Setter for disabled state
       *
       * @param  {bool} value description
       * @return {bool}       description
       */
      setDisabled(value) {
        check(value, Boolean);
        return this.disabled.set(value);
      },

      /**
       * setState - Setter for current state
       *
       * @param  {string} state    description
       * @param  {function} callback description
       * @throws {Error} Will throw an error in case of invalid state.
       */
      setState(state, callback) {
        check(state, String);
        check(callback, Match.Optional(Function)); //eslint-disable-line
        if (!this._isValidState(state)) {
          throw new Meteor.Error(
            500,
            'Internal server error',
            'accounts-templates-core package got an invalid state value!'
          );
        }
        this.state.set(state);
        // this.clearState();
        if (_.isFunction(callback)) {
          callback();
        }
      },
    });

    // Ask each module and each plugin to possibly add other stuff to the uaForm
    _.each(objs, function o(obj) {
      if (!!obj._initFormTemplate) {
        obj._initFormTemplate(uaForm);
      }
    });
  },

  /**
   * setInitialState - description
   *
   * @param  {string} state description
   * @throws {Error} Will throw an error in case of invalid initial state.
   */
  setInitialState(state) {
    if (!_.contains(this._states, state)) {
      throw Error('Invalid inital state!');
    }
    UserAccounts.defaultState = state;
  },

  /**
   * t - description
   *
   * @return {string}  description
   */
  t() {
    var key;
    var text;

    UALog.trace('UserAccounts.t');

    // Retrieve the requested key
    key = arguments[0];
    // Retrieve the text currently associated with the requested key
    text = UserAccounts.texts[key] || key;

    // In case we get more that one argument we expext the key
    // to have placeholders to be substituded with the arguments
    // following the first one...
    if (arguments.length >= 3) {
      // Put the retrieved text back in first position
      arguments[0] = text;
      // Actually substitute placeholders
      text = s.sprintf.apply(s, arguments);
    }

    return text;
  },
});