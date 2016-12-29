'use strict';
const config = require('../config.json');
const clone = require('lodash').clone;
const Node = require('./graph').Node;
const path = require('path');
/**
 * @class Model
 *
 * Represents a Model artifact in the Workspace graph.
 */
class Model extends Node {
  constructor(Workspace, id, modelDef, options) {
    super(Workspace, 'ModelDefinition', id, modelDef);
    this.properties = {};
    this.methods = {};
    this.relations = {};
    this.config = {};
    this.options = options;
    Workspace.addNode(this);
  }
  setProperty(name, property) {
    this.properties[name] = property;
  }
  getDefinition() {
    const model = this;

    const properties = {};
    Object.keys(model.properties).forEach(function(key) {
      const modelProperty = model.properties[key];
      properties[key] = modelProperty._content;
    });

    const methods = {};
    Object.keys(model.methods).forEach(function(key) {
      const modelMethod = model.methods[key];
      methods[key] = modelMethod._content;
    });

    const relations = {};
    Object.keys(model.relations).forEach(function(key) {
      const modelRelation = model.relations[key];
      relations[key] = modelRelation._content;
    });

    const data = model._content;
    const modelDef = clone(data);
    modelDef.properties = properties;
    modelDef.methods = methods;
    modelDef.relations = relations;
    return modelDef;
  }
  getFilePath() {
    const modelDef = this._content;
    const filePath = path.resolve(this._graph.directory, modelDef.facetName,
      config.ModelDefaultDir, modelDef.name + '.json');
    return filePath;
  }
};

module.exports = Model;