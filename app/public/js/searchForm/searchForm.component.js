(function() {
  'use strict';

  angular.module('app')
    .component('searchForm', {
      controller: SearchFormController,
      templateUrl: '/js/searchForm/searchForm.template.html'
    });

    SearchFormController.$inject = ['$state', 'searchFormService'];

    function SearchFormController($state, searchFormService){
      const vm = this;

      vm.search = function() {
        searchFormService.getResults(vm.searchForm)
          .then(() => {
            console.log('this happened');
            return $state.go('jobList');
          });
      }
    };


}());
