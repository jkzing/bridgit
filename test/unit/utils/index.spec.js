require('assert');
const path = require('path');
const fs = require('fs');
const {requireSrc} = require('../../helpers');

const merge = requireSrc('utils/mergeConfiguration');
const {configFilePath, configKeys} = requireSrc('constants');