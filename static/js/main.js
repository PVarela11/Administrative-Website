$(document).ready(function() {
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");

    //Dynamic variables
    let prevBtn;
    let nextBtn;
    let sections;
    let submitBtn;
    let form;
    let startDateField;
    let endDateField;
    let action;
    let currentSection = 0;
    let activitiesContainer;

    const modalFormContainer = document.getElementById("modalFormContainer");
    const createUrl = $("#createUrl").attr("data-url");
    let deleteBtns = document.querySelectorAll('a.deleteBtn');

    //Listeners
    openModalBtn.addEventListener("click", function() {
        action = "create";
        fetchFormHtml(createUrl);
        currentSection=0;
    });

    deleteBtns.forEach(function(deleteBtn) {
    deleteBtn.addEventListener('click', function(event) {
        //Prevent triggering tr click event
        event.preventDefault();
        event.stopPropagation();
        let deleteUrl = this.getAttribute('data-url');
        action = "delete";
        console.log(deleteUrl)
        event.preventDefault();
        fetchFormHtml(deleteUrl);
        });
    });
    //Click on the table rows opens modal to edit the project
    $(document.body).on("click", "tr[data-href]", function () {
        //window.location.href = this.dataset.href;
        action = "edit";
        currentSection=0;
        //console.log(this.dataset.href)
        fetchFormHtml(this.dataset.href);
    });

    // Fetch the form HTML using AJAX
    function fetchFormHtml(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                modalFormContainer.innerHTML = html;
                openModal();
                initializeForm(); 
            });
    }

    function initializeForm(){

        toggleInputFields();
        const closeModalBtn = document.getElementById("closeModalBtn");
        closeModalBtn.addEventListener("click", function() {
            closeModal();
        });
        submitBtn = document.querySelector("input[type='submit']");
        if(action!="delete"){

            // Get the activity formset and the container element
            //var activityFormset = document.querySelector('#id_activity-TOTAL_FORMS').parentNode;
            //var activitiesContainer = activityFormset.parentNode;
            activitiesContainer = document.querySelector('#section4');
            var activityList = document.querySelector('#activity-list');
            var addActivityButton = document.querySelector('#add-activity');
            // Add an event listener to the "Add Activity" button
            document.querySelector('#add-activity').addEventListener('click', function() {
                // Get the total number of forms in the formset
                var totalForms = parseInt(document.querySelector('#id_activity-TOTAL_FORMS').value);

                // Get the values of the activity form fields
                var lastActivityForm = activitiesContainer.querySelector('.activity-form:not([style*="display: none"])');
                var activityName = lastActivityForm.querySelector('[name$=activity_name]').value;
                var activityDescription = lastActivityForm.querySelector('[name$=description]').value;
                var activityResponsible = lastActivityForm.querySelector('[name$=responsible]').value;
                var activityParticipants = lastActivityForm.querySelector('[name$=participants]').value;

                // Check if any of the fields are empty
                if (!activityName || !activityDescription || !activityResponsible || !activityParticipants) {
                    // If any of the fields are empty, display an alert message and return
                    alert('Please fill in all fields before adding a new activity.');
                    return;
                }

                // Check if an activity with the same name already exists
                existingActivityNames = Array.from(activitiesContainer.querySelectorAll('.activity-form[style*="display: none"] [name$=activity_name]')).map(function(input) {
                    return input.value;
                });
                var nameField = lastActivityForm.querySelector('input');
                if (existingActivityNames.includes(activityName)) {
                    // If an activity with the same name already exists, display an alert message and return
                    alert('An activity with this name already exists. Please choose a different name.');
                    nameField.classList.add("error");
                    return;
                }

                // Clone the last activity form
                var newActivityForm = lastActivityForm.cloneNode(true);
                lastActivityForm.style.display = "none";
                clearFields(newActivityForm);

                // Update the form index
                var formIndexRegex = new RegExp(`activity-(\\d+)-`, 'g');
                newActivityForm.innerHTML = newActivityForm.innerHTML.replace(formIndexRegex, `activity-${totalForms}-`);

                // Append the new activity form to the container element
                activitiesContainer.insertBefore(newActivityForm, document.querySelector('#add-activity'));

                // Increment the total number of forms in the formset
                document.querySelector('#id_activity-TOTAL_FORMS').value = totalForms + 1;

                // Check if there are any hidden activities or if the button text is 'Update Activity'
                var hiddenActivities = activityList.querySelectorAll('.activity-item[style*="display: none"]');
                if (hiddenActivities.length > 0 || addActivityButton.textContent === 'Update Activity') {
                    console.log("Edit Activity");
                    // Display all the activities
                    var activityItems = activityList.querySelectorAll('.activity-item');
                    // Get the activity-item element that is being shown
                    var visibleActivityItem = activityList.querySelector('.activity-item:not([style*="display: none"])');
                    console.log(visibleActivityItem);
                    activityItems.forEach(function(item) {
                        item.style.removeProperty('display');
                        // Remove the unclickable class from all activityItems
                        item.classList.remove('unclickable');
                    });

                    // Get the value of the input element where the user entered the new name
                    var newName = lastActivityForm.querySelector('[name$=activity_name]').value;
            
                    // Update the data inside the span element with the new data
                    visibleActivityItem.querySelector('span').textContent = newName;

                    // Change the text of the add-activity button back to 'Add Activity'
                    addActivityButton.textContent = 'Add Activity';
                    return;
                }else{
                    // Create a new activity item and append it to the activity list
                    var activityName = lastActivityForm.querySelector('[name$=activity_name]').value;
                    var activityItem = document.createElement('div');
                    activityItem.classList.add('activity-item');
                    var activityNameElement = document.createElement('span');
                    activityNameElement.textContent = activityName;
                    activityItem.appendChild(activityNameElement);
                    var deleteButton = document.createElement('button');
                    deleteButton.textContent = 'x';
                    deleteButton.classList.add('delete-activity');
                    activityItem.appendChild(deleteButton);
                    activityList.appendChild(activityItem);
                } 
                // Add a common class to all activity-form elements
                var activityForms = activitiesContainer.querySelectorAll('.activity-form');
                activityForms.forEach(function(form) {
                    form.classList.add('activity-form-item');
                });
                //updateActivityFormIDs();

                // Add an event listener to the activity item
                activityItem.addEventListener('click', function(event) {
                    event.preventDefault();
                    // Check if the delete button was clicked
                    if (event.target.matches('.delete-activity')) {
                        var confirmDelete = confirm('Are you sure you want to delete this activity?');
                        if (confirmDelete) {
                            console.log("Entrou delete");
                            // Get the index of the clicked activity item
                            var activityIndex = Array.from(activityList.children).indexOf(event.target.parentNode);
                            console.log(activityIndex);
                            //var activityForms = activitiesContainer.querySelectorAll('.activity-form'); 
                            //var activityForm = activityForms[activityIndex]
                            // Remove the corresponding activity form
                            var activityForms = activitiesContainer.querySelectorAll('.activity-form'); 
                            var activityForm = activityForms[activityIndex]
                            //console.log(activityForm);
                            // Check if the activity form exists and is a valid node
                            if (activityForm && activityForm.parentNode) {
                                // Remove the corresponding activity form
                                activitiesContainer.removeChild(activityForm);
                                // Decrement the total number of forms in the formset
                                var totalForms = parseInt(document.querySelector('#id_activity-TOTAL_FORMS').value);
                                document.querySelector('#id_activity-TOTAL_FORMS').value = totalForms - 1;

                                // Remove the clicked activity item
                                activityList.removeChild(event.target.parentNode);
                                updateActivityFormIDs();
                            } else {
                                console.error('Invalid activity form or node.');
                            }
                        }  
                    } else if (event.target.closest('.activity-item')) {
                        // Get the index of the clicked activity item
                        // Get the clicked activity item
                        var activityItem = event.target.closest('.activity-item');

                        // Get all the activity-item elements
                        var activityItems = activityList.querySelectorAll('.activity-item');
                        
                        // Hide all the activity-item elements except for the clicked one
                        activityItems.forEach(function(item) {
                            if (item !== activityItem) {
                                item.style.display = 'none';
                            }
                        });
                        
                        // Add the unclickable class to the clicked activityItem
                        activityItem.classList.add('unclickable');

                        // Change the text of the add-activity button
                        addActivityButton.textContent = 'Update Activity';
                    
                        // Get the index of the clicked activity item
                        var activityIndex = Array.from(activityList.querySelectorAll('.activity-item')).indexOf(activityItem);
                        //var activityIndex = Array.from(activityList.children).indexOf(event.target.parentNode);
                        //var activityIndex = Array.from(activityList.children).indexOf(event.target.closest('.activity-item'));
                        //console.log(activityIndex);
                        var activityForms = activitiesContainer.querySelectorAll('.activity-form'); 
                        var activityForm = activityForms[activityIndex]
                        //console.log(activityForm);

                        // Delete the currently visible activity form
                        var visibleActivityForm = activitiesContainer.querySelector('.activity-form:not([style*="display: none"])');
                        if (visibleActivityForm) {
                            activitiesContainer.removeChild(visibleActivityForm);

                            // Decrement the total number of forms in the formset
                            var totalForms = parseInt(document.querySelector('#id_activity-TOTAL_FORMS').value);
                            document.querySelector('#id_activity-TOTAL_FORMS').value = totalForms - 1;
                        }
                        
                        // Remove the clicked activity item from the activity list
                        //activityList.removeChild(activityItem);

                        //activityForms.removeChild(activityForm);
                        //updateActivityFormIDs();
                        // Show the corresponding activity form
                        activityForm.style.display = 'block';
                        
                    }
                });
            });

            prevBtn = document.getElementById("prevBtn");
            nextBtn = document.getElementById("nextBtn");
            sections = document.querySelectorAll(".form-section");
            // Show the first section
            sections[currentSection].style.display = "block";
            // Hide the "Previous" button on the first section
            prevBtn.style.display = "none";
            prevBtn.addEventListener("click", function() {
                //console.log(currentSection);
                // Hide the current section
                sections[currentSection].style.display = "none";
                // Decrement the current section index
                currentSection--;
                // Show the previous section
                sections[currentSection].style.display = "block";

                // Hide the "Previous" button on the first section
                if (currentSection === 0) {
                    prevBtn.style.display = "none";
                }

                // Show the "Next" button if it was hidden
                nextBtn.style.display = "inline-block";

                // Hide the submit button if it was shown
                submitBtn.style.display = "none";
            });
            nextBtn.addEventListener("click", function() {
                // Hide the current section
                sections[currentSection].style.display = "none";
                // Increment the current section index
                currentSection++;
                // Show the next section
                sections[currentSection].style.display = "block";

                // Show the "Previous" button if it was hidden
                prevBtn.style.display = "inline-block";

                // Hide the "Next" button on the last section
                if (currentSection === sections.length - 1) {
                    nextBtn.style.display = "none";
                    // Show the submit button on the last section
                    submitBtn.style.display = "inline-block";
                }
            });
            form = document.querySelector("form");
            form.addEventListener("submit", function(event) {
                event.preventDefault();
                console.log(action + " submit");
                validateForm(action, form, event);
            });
        }
        $('#id_client').on('change', function() {
            var clientId = $(this).val();
            toggleInputFields();
            if (clientId) {
                $.ajax({
                    url: '/clients/' + clientId + '/',
                    type: 'GET',
                    dataType: 'json',
                    success: function(data) {
                        $('#id_client_name').val(data.client_name);
                        $('#id_tax_id').val(data.tax_id);
                        $('#id_reference').val(data.reference);
                        $('#id_purchase_num').val(data.purchase_num);
                        $('#id_project_value').val(data.project_value);
                        $('#id_hour_value').val(data.hour_value);
                        $('#id_extra_costs').val(data.extra_costs);
                        $('#id_payment_days').val(data.payment_days);
                        $('#id_type_vat').val(data.type_vat);
                    }
                });
            } /*else {
                console.log("Entrou no else");
                // clear the client fields if no client is selected
                $('#id_client_name').val('');
                $('#id_tax_id').val('');
                $('#id_reference').val('');
                $('#id_purchase_num').val('');
                $('#id_project_value').val('');
                $('#id_hour_value').val('');
                $('#id_extra_costs').val('');
                $('#id_payment_days').val('');
                $('#id_type_vat').val('');
            }*/
        });
    }
    function updateActivityFormIDs() {
        // Get all activity forms
        var activityForms = activitiesContainer.querySelectorAll('.activity-form');

        // Update the IDs of all activity forms
        for (var i = 0; i < activityForms.length; i++) {
            var activityForm = activityForms[i];

            // Update the form index
            var formIndexRegex = new RegExp(`activity-(\\d+)-`, 'g');
            var formFields = activityForm.querySelectorAll('[name]');
            for (var j = 0; j < formFields.length; j++) {
                var formField = formFields[j];
                formField.name = formField.name.replace(formIndexRegex, `activity-${i}-`);
                // Update the ID attribute
                if (formField.id) {
                    formField.id = formField.id.replace(formIndexRegex, `activity-${i}-`);
                }

                // Update the label's for attribute
                var label = activityForm.querySelector(`label[for="${formField.id}"]`);
                if (label) {
                    label.setAttribute('for', formField.id);
                }
            }
        }
    }
    function clearFields(form){
        // Clear the values of each form field
        var fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(function(field) {
            field.classList.remove("error");
            if (field.type === 'checkbox' || field.type === 'radio') {
                field.checked = false;
            } else {
                field.value = '';
            }
        });
    }
    function validateForm(action, form, event){
        // Keep track of the fields that are not filled
        let unfilledFields = [];
        //Loop through all fields
        for (let i = 0; i < form.elements.length; i++) {
            let field = form.elements[i];
            // Check if the current field is part of an activity form
            if (field.closest('.activity-form')) {
                // Skip the current field if it is part of an activity form
                continue;
            }
            //console.log(field.name + ': ' + field.value);
            if (!field.value && field.type !== "submit" && field.type !== "button" && field.name !== "client") {
                console.log(field.name);
                unfilledFields.push(field.name);
                field.classList.add("error");
            }else{
                field.classList.remove("error");
            }
        }
        // Get the activity list element
        var activityList = document.querySelector('#activity-list');

        startDateField = document.querySelector('#id_start_date');
        endDateField = document.querySelector('#id_end_date');
        // If there are any unfilled fields, display an alert and prevent form submission
        if (unfilledFields.length > 0) {
            event.preventDefault();
            alert('Please fill in the following fields:\n-' + unfilledFields.join('\n- '));
        // Check if there are any activity items in the activity list
        }else if (activityList.children.length === 0) {
            event.preventDefault();
            // If there are no activity items, show an alert
            alert('Please create at least one activity.');
        }else {
            // Check if the date fields contain valid dates
            if (!isValidDate(startDateField.value) || !isValidDate(endDateField.value)) {
                // If the dates are not valid, display an error message and prevent form submission
                console.log('INVALID DATES');
                event.preventDefault();
                alert('Please enter valid dates in the format YYYY-MM-DD\n' + startDateField.value + "\n" + endDateField.value);
            }else{
                //console.log(form);
                console.log('FETCHING RESPONSE');
                // The form data is valid, submit the form using an AJAX request
                fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {'X-Requested-With': 'XMLHttpRequest'}
                    })
                .then(response => {
                        console.log('Response:', response);
                        return response.json();
                    })
                .then(data => {
                    console.log(data);
                    if (data.success) {
                        console.log('SUCCESS RESPONSE');
                        // The form was submitted successfully
                        // Redirect to a success page or close the modal
                        window.location.href = data.success_url;
                    } else {
                        console.log('UNSUCCESSFUL RESPONSE');
                        form.querySelectorAll('input').forEach(input => {
                            input.addEventListener('input', function () {
                                this.classList.remove('error');
                                this.setCustomValidity('');
                            });
                        });
                        
                        //event.preventDefault();
                        // The form has errors
                        // Reset the form
                        //form.reset();
                        // Clear any custom validation messages
                        for (const fieldElement of form.elements) {
                            fieldElement.setCustomValidity('');
                        }
                        // Display the errors to the user
                        for (const [field, errors] of Object.entries(data.errors)) {
                            if (field === '__all__') {
                                // Display non-field errors
                                const nonFieldErrorsElement = document.querySelector('#non-field-errors');
                                nonFieldErrorsElement.textContent = errors.join('\n');
                                console.log(errors[0]);
                                if(errors[0]=="Project with this Code1 and Code2 already exists."){
                                    document.querySelector('#id_code1').classList.add('error');
                                    document.querySelector('#id_code2').classList.add('error');
                                }
                            } else {
                                // Display field errors
                                const fieldElement = form.querySelector(`[name="${field}"]`);
                                if (fieldElement) {
                                    fieldElement.setCustomValidity(errors.join('\n'));
                                    fieldElement.classList.add('error');
                                }
                            }                                   
                            console.log(field, errors);
                        }
                        //goToSection(0);
                        form.reportValidity();
                        // Reset the form fields
                        //form.reset();
                        setTimeout(function () {
                            resetFormFields(form);;
                          }, 1000);
                        
                    }
                })
                .catch(error => {
                    console.error('Fetch Error:', error);
                });
            }
        }
    }
    function resetFormFields(form) {
        // Clear any custom validation messages
        for (const fieldElement of form.elements) {
          fieldElement.setCustomValidity('');
        }
    }
    function goToSection(section){
        if(currentSection!= section){
            sections[currentSection].style.display = "none";
            sections[section].style.display = "block";
            currentSection = section;
            prevBtn.style.display = "none";
        }
    }
    function openModal() {
        modal.style.display = "block";
    }
    function closeModal() {
        modal.style.display = "none";
    }
    function isValidDate(dateString) {
        // Check if the date string matches the format YYYY-MM-DD
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return false;
        }
    
        // Parse the date parts to integers
        let parts = dateString.split('-');
        let year = parseInt(parts[0], 10);
        let month = parseInt(parts[1], 10);
        let day = parseInt(parts[2], 10);
    
        // Check if the date is valid
        if (month < 1 || month > 12) {
            return false;
        }
        if (day < 1 || day > 31) {
            return false;
        }
        if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
            return false;
        }
        if (month === 2) {
            let isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
            if (day > 29 || (day === 29 && !isLeapYear)) {
                return false;
            }
        }
    
        // The date is valid
        return true;
    }
    function toggleInputFields() {
        const clientSelect = $('#id_client');
        const inputFields = $('.disable-on-select');

        if (clientSelect.val() === '') {
            // Enable the input fields when the client select is set to the default value
            inputFields.prop('disabled', false);
        } else {
            // Disable the input fields when the client select is not set to the default value
            inputFields.prop('disabled', true);
        }
    }

    // Close the modal when the user clicks outside of it
    $(window).click(function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });
    //Alert code:
    setTimeout(function() {
        document.querySelector('.alert').classList.add('hide');
    }, 3000);
    
});
