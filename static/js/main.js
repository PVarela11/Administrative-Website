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
        const closeModalBtn = document.getElementById("closeModalBtn");
        closeModalBtn.addEventListener("click", function() {
            closeModal();
        });
        submitBtn = document.querySelector("input[type='submit']");
        if(action!="delete"){
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
            } else {
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
            }
        });
    }

    function validateForm(action, form, event){
        // Keep track of the fields that are not filled
        let unfilledFields = [];
        //Loop through all fields
        for (let i = 0; i < form.elements.length; i++) {
            let field = form.elements[i];
            //console.log(field.name + ': ' + field.value);
            if (!field.value && field.type !== "submit" && field.type !== "button") {
                console.log(field.name);
                unfilledFields.push(field.name);
                field.classList.add("error");
            }else{
                field.classList.remove("error");
            }
        }
        startDateField = document.querySelector('#id_start_date');
        endDateField = document.querySelector('#id_end_date');
        // If there are any unfilled fields, display an alert and prevent form submission
        if (unfilledFields.length > 0) {
            event.preventDefault();
            alert('Please fill in the following fields:\n-' + unfilledFields.join('\n- '));
        }else {
            // Check if the date fields contain valid dates
            if (!isValidDate(startDateField.value) || !isValidDate(endDateField.value)) {
                // If the dates are not valid, display an error message and prevent form submission
                console.log('INVALID DATES');
                event.preventDefault();
                alert('Please enter valid dates in the format YYYY-MM-DD\n' + startDateField.value + "\n" + endDateField.value);
            }else{
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
                    if (data.success) {
                        console.log('SUCCESS RESPONSE');
                        // The form was submitted successfully
                        // Redirect to a success page or close the modal
                        window.location.href = data.success_url;
                    } else {
                        console.log('UNSUCSSEFUL RESPONSE');
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
                                if (nonFieldErrorsElement) {
                                    nonFieldErrorsElement.textContent = errors.join('\n');
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
                        goToSection(0);
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
