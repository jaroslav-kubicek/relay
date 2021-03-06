/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {
  ArgumentDefinition,
  Fragment,
  FragmentSpread,
  LocalArgumentDefinition,
} from '../../core/GraphQLIR';

function buildFragmentSpread(fragment: Fragment): FragmentSpread {
  const args = [];
  for (const argDef of fragment.argumentDefinitions) {
    if (argDef.kind !== 'LocalArgumentDefinition') {
      continue;
    }
    args.push({
      kind: 'Argument',
      loc: {kind: 'Derived', source: argDef.loc},
      name: argDef.name,
      type: argDef.type,
      value: {
        kind: 'Variable',
        loc: {kind: 'Derived', source: argDef.loc},
        variableName: argDef.name,
        type: argDef.type,
      },
    });
  }
  return {
    args,
    directives: [],
    kind: 'FragmentSpread',
    loc: {kind: 'Derived', source: fragment.loc},
    metadata: null,
    name: fragment.name,
  };
}

function buildOperationArgumentDefinitions(
  argumentDefinitions: $ReadOnlyArray<ArgumentDefinition>,
): $ReadOnlyArray<LocalArgumentDefinition> {
  return argumentDefinitions.map(argDef => {
    if (argDef.kind === 'LocalArgumentDefinition') {
      return argDef;
    } else {
      return {
        kind: 'LocalArgumentDefinition',
        name: argDef.name,
        type: argDef.type,
        defaultValue: null,
        loc: argDef.loc,
      };
    }
  });
}

module.exports = {
  buildFragmentSpread,
  buildOperationArgumentDefinitions,
};
