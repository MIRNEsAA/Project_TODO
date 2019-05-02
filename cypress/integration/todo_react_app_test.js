// TODO testing 

//var todoData = require('../fixtures/todo_data.json');

describe('TODO React app', function() {
  // Apply data driven test. Used data are stored in fixtures todo_data 
  var todoData = require('../fixtures/todo_data.json')

  // Before each test visit the base url
  beforeEach(function(){
    cy.visit('http://localhost:3000/')
  })

  /*
  * Start point : 
  * With empty list no operations are available, except Add
  */
  it('No items, No displyed filters', function(){
    cy.get('.todo-list li').should('not.exist')
    cy.get('.footer').should('not.exist')

  })

  /*
  * 
  * Test adding items to the list 
  * 
  */
  it('Add items and count', function () {
    cy
        cy.get('.new-todo')
        .type(todoData.firstItem).type('{enter}')
        .type(todoData.secondItem).type('{enter}')
        .type(todoData.thirdItem).type('{enter}')
        .type(todoData.fourthItem).type('{enter}')
        cy.get('.todo-list li').should('have.length',4) // check number of items in the list
  });

  /*
  * Apply filters to check status of the tasks
  * 
  */
  it('Select item and apply filter', function(){

        cy.get('.new-todo')
        .type('todoData.firstItem')
        .type('{enter}')
        .type('todoData.secondItem')
        .type('{enter}')
        .type('todoData.thirdItem')
        .type('{enter}')
        .type('todoData.fourthItem')
        .type('{enter}')
        cy
        .get('ul>li')
        .each(($el, index, $list) => {
          let text = ($el).text()
          if (text==='todoData.thirdItem') {
              cy.wrap($el).find('input').click() //.then( () => {console.log('Hit'); return false})
          }

          console.log(text)
        })

        /*Get numbers of active, completed and all tasks, check if filters work
          First we will select all tasks and count how many were active and completed,
          then we click the filters count again. The counts must match
          */
        
        cy
        .get('li[data-cy=todo-item][class=completed]').its('length').then(($count_completed) => {
        
          cy
          .get('li[data-cy=todo-item][class!=completed]').its('length').then(($count_active) => {
            cy
            .get('li[data-cy=todo-item]').its('length').then(($count_total) => {

                /*Display the counts*/
                console.log($count_completed)
                console.log($count_active)
                console.log($count_total)

                /*Check the completed filter*/
                cy.contains('.filters a','Completed').click()
                cy.get('li[data-cy=todo-item]').its('length').should('eq',$count_completed)

                /*Check the active filter*/
                cy.contains('.filters a','Active').click()
                cy.get('li[data-cy=todo-item]').its('length').should('eq',$count_active)


            })
          })
        })

        
     
  })

  


  /*
  * Aply select option 
  * All items should be selected
  * Counter should show message 'No items left'
  */

  it('All items are selected properly ', function(){
    cy
        cy.get('.new-todo')
        .type(todoData.firstItem).type('{enter}')
        .type(todoData.secondItem).type('{enter}')
        .type(todoData.thirdItem).type('{enter}')
        .type(todoData.fourthItem).type('{enter}')

        cy.get('[data-cy=toggle-all-label]').click() // use  check insted of click
        // cy.get('ul>li').eq(1).should('have.class', 'completed')
        cy
        .get('[data-cy= todo-list]>li')
        .each(($el2,index,$list) => {

            cy.wrap($el2).should('have.class', 'completed')

        })

        cy.get('[data-cy=todo-count]').contains('No items left')

  })

  /*
  * Remove item from the list 
  * Item can be removed eather can be selected or not
  */
  it('Delete item from list-destroy',function(){
      cy.get('.new-todo')
      .type('This is mistake{enter}')
      .type('It will be deleted{enter}')
      cy.get('[data-cy=todo-count]').contains('2 items left')

      // Apply mouseover

      cy.get('[data-cy=todo-item-remove]').should('be.hidden').invoke('show')
      
      cy
        .get('ul>li')
        .each(($el, index, $list) => {
          let text = ($el).text()
          if (text==='It will be deleted') {
              cy.wrap($el).find('button').click() //.then( () => {console.log('Hit'); return false})
          }

          console.log(text)
        })
       
        // Verification 
        cy.get('.todo-list li').should('have.length',1)
        cy.get('[data-cy=todo-count]').contains('1 item left')
  })



/*
  * Option to clear completed item will be visible 
  * only ifyou have at least one item selected - completed 
  * 
  */
it('Clear complete visible if at least one item selected',function(){

  // No item in list 
  cy.get('.clear-completed').should('not.exist')
  
  
  // add items into list
  cy.get('.new-todo')
  .type('Has to be destroy 1{enter}')
  .type('Has to be destroy 2{enter}')
  cy.get('[data-cy=todo-count]').contains('2 items left')
  // If item is  not selected option to clear completed item should not be visible
  cy.get('.clear-completed').should('not.exist')
  
  // Select one item
  cy.get('.todo-list li').eq(1).find('.toggle').check()
  //Option to clear is visible
  cy.get('.clear-completed').should('be.visible')
  cy.get('.clear-completed').click()

  // To verity that copleted item is clear
  cy.get('[data-cy=todo-count]').contains('1 item left')

})

/*
  * The last important part  is  
  * highlight selected filter
  */
 it('Selected filter is highlight',function(){

  // add items into list to disply footer
  cy.get('.new-todo')
  .type('Has to be destroy 1{enter}')
  .type('Has to be destroy 2{enter}')
  cy.get('[data-cy=todo-count]').contains('2 items left')
  
  cy.get('.filters').within(function(){
    cy.contains('All').should('have.class','selected')
    cy.contains('Active').click().should('have.class','selected')
    cy.contains('Completed').click().should('have.class','selected')


  })

})





})


