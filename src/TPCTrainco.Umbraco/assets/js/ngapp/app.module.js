/**
 * @ngdoc overview
 * @name train
 * @description The main module for TrainCO
 */

(function() {

  'use strict';

  angular.module('train', [
    'train.core',
    'train.common',
    'train.components',
    'train.register',
    'train.seminar',
    'train.auth'
  ]);

}());
