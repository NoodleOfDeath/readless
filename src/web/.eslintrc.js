module.exports = {
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
  plugins: ['react'],
  rules: {
    'react/jsx-closing-bracket-location': [
      'error',
      {
        nonEmpty: 'after-props',
        selfClosing: 'after-props',
      },
    ],
    'react/jsx-closing-tag-location': [
      'error',
      {
        nonEmpty: 'after-props',
        selfClosing: 'after-props',
      },
    ],
    'react/jsx-curly-newline': [
      'error',
      {
        multiline: 'consistent',
        singleline: 'consistent',
      },
    ],
    'react/jsx-curly-spacing': ['error', { when: 'always' }],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-fragments': ['error', 'element'],
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 1,
        when: 'multiline',
      },
    ],
    'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
    'react/jsx-props-no-multi-spaces': ['error'],
    'react/jsx-tag-spacing': [
      'error',
      {
        afterOpening: 'never',
        beforeClosing: 'never',
        beforeSelfClosing: 'always',
        closingSlash: 'never',
      },
    ],
    'react/jsx-wrap-multilines': [
      'error',
      {
        arrow: 'parens-new-line',
        assignment: 'parens-new-line',
        condition: 'parens-new-line',
        declaration: 'parens-new-line',
        logical: 'parens-new-line',
        prop: 'parens-new-line',
        return: 'parens-new-line',
      },
    ],
  },
  settings: {
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      'observer', // `property`
      { property: 'styled' }, // `object` is optional
      { object: 'Mobx', property: 'observer' },
      { object: '<pragma>', property: 'observer' }, // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    formComponents: [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      'CustomForm',
      { formAttribute: 'endpoint', name: 'Form' },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      { linkAttribute: 'to', name: 'Link' },
    ],
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      { object: 'Object', property: 'freeze' },
      { property: 'myFavoriteWrapper' },
      // for rules that check exact prop wrappers
      { exact: true, property: 'forbidExtraProps' },
    ],
    react: { version: '18.2.0' },
  },
};
