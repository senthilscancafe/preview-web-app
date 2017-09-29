/*global define*/

define(['Augment'], function (augment) {

	'use strict';

	var instance = {
		init: function () {},

		is: function (object) {
			return object.isPrototypeOf(this);
		},

		create: function () {
			return augment(this, Constructor, arguments);
		}
	};

	function Constructor(args, base) {
		base.init.apply(this, args);
	}

	return instance;
});