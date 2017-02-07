'use strict';
const config = require('../config.json');
const Entity = require('./entity');
const path = require('path');
const ModelConfig = require('./model-config');
const FacetConfig = require('./facet-config');

/**
 * @class Facet
 *
 * Represents a Facet artifact in the Workspace graph.
 */
class Facet extends Entity {
  constructor(Workspace, name, data, options) {
    super(Workspace, 'Facet', name, data);
    // Facet adds itself to the workspace
    Workspace.addNode(this);
  }
  getName() {
    return this._name;
  }
  addModelConfig(workspace, modelId, config) {
    const modelConfig = new ModelConfig(workspace, modelId, config);
    this.addContainsRelation(modelConfig);
  }
  getPath() {
    return path.join(this._graph.getDirectory(), this._name);
  }
  getConfigPath() {
    const filePath = path.join(this._graph.getDirectory(), this._name,
      this._graph.getConfig().FacetConfigFile);
    return filePath;
  }
  getModelConfigPath() {
    const filePath = path.join(this._graph.getDirectory(), this._name,
      this._graph.getConfig().ModelConfigFile);
    return filePath;
  }
  setModelConfig(config) {
    const workspace = this._graph;
    let modelConfigNodes = this.getContainedSet('ModelConfig');
    modelConfigNodes = modelConfigNodes || {};
    Object.keys(config).forEach(function(key) {
      if (key === '_meta') return;
      let modelConfig = modelConfigNodes[key];
      if (modelConfig) {
        modelConfig._content = config[key];
      } else {
        if (workspace.getModel(key)) {
          this.addModelConfig(workspace, key, config[key]);
        } else
        this.addModelConfig(workspace, 'common.models.' + key, config[key]);
      }
    }, this);
  }
  getModelConfig(modelId) {
    const modelConfigNodes = this.getContainedSet('ModelConfig');
    const modelConfig = {};
    if (modelConfigNodes) {
      Object.keys(modelConfigNodes).forEach(function(key) {
        let parts = key.split('.');
        let modelName = parts[parts.length - 1];
        modelConfig[modelName] = modelConfigNodes[key]._content;
      });
    }
    if (modelId) {
      const parts = modelId.split('.');
      const modelName = parts[parts.length - 1];
      return modelConfig[modelName];
    } else {
      modelConfig._meta = config.modelsMetadata;
      return modelConfig;
    }
  }
  getConfig() {
    const facetNodes = this.getContainedSet('FacetConfig');
    let config = {};
    if (facetNodes) {
      Object.keys(facetNodes).forEach(function(key) {
        let facetConfig = facetNodes[key];
        if (facetConfig && facetConfig.getDefinition()) {
          config = facetConfig.getDefinition();
        }
      });
    }
    return config;
  }
  addConfig(config) {
    const facetConfig = new FacetConfig(this._graph, this._name, config);
    this.addContainsRelation(facetConfig);
  }
};

module.exports = Facet;
