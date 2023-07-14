$(document).ready(function() {
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const modalFormContainer = document.getElementById("modalFormContainer");
    const cancelBtn = document.getElementById("cancelBtn");
    const url = $("#createUrl").attr("data-url");
    let currentSection = 0;

    openModalBtn.addEventListener("click", function() {
        fetchFormHtml(url);
    });

    // Fetch the form HTML using AJAX
    function fetchFormHtml(url) {
        fetch(url)
            .then(response => response.text())
            .then(html => {
                modalFormContainer.innerHTML = html;
                openModal();

                const closeModalBtn = document.getElementById("closeModalBtn");
                closeModalBtn.addEventListener("click", function() {
                    closeModal();
                });

                const prevBtn = document.getElementById("prevBtn");
                const nextBtn = document.getElementById("nextBtn");
                const submitBtn = document.querySelector("input[type='submit']");
                const sections = document.querySelectorAll(".form-section");

                // Show the first section
                sections[currentSection].style.display = "block";

                // Hide the "Previous" button on the first section
                prevBtn.style.display = "none";
                
                prevBtn.addEventListener("click", function() {
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

                const form = document.querySelector("form");
                form.addEventListener("submit", function(event) {
                    // Get the date fields
                    let startDateField = document.querySelector('#id_start_date');
                    let endDateField = document.querySelector('#id_end_date');

                    // Get all the required form fields
                    let requiredFields = document.querySelectorAll('[required]');

                    // Keep track of the fields that are not filled
                    let unfilledFields = [];
                    
                    // Check if all the required fields are filled
                    requiredFields.forEach(function(field) {
                        if (!field.value) {
                            unfilledFields.push(field.name);
                            field.classList.add("error");
                        }else{
                            field.classList.remove("error");
                        }
                    });

                    // If there are any unfilled fields, display an alert and prevent form submission
                    if (unfilledFields.length > 0) {
                        event.preventDefault();
                        alert('Please fill in the following fields:\n-' + unfilledFields.join('\n- '));
                    }else {
                        // Check if the date fields contain valid dates
                        if (!isValidDate(startDateField.value) || !isValidDate(endDateField.value)) {
                            // If the dates are not valid, display an error message and prevent form submission
                            event.preventDefault();
                            alert('Please enter valid dates in the format YYYY-MM-DD');
                    }
                    }

                });
            });
    }

    // Close the modal when the user clicks outside of it
    /*$(window).click(function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });*/

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
});

//Modal Code
/*document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    const openModalBtn = document.getElementById("openModalBtn");
    const modalFormContainer = document.getElementById("modalFormContainer");
    var url = $("#createUrl").attr("data-url")
    
    openModalBtn.addEventListener("click", function() {
        // Fetch the form HTML using AJAX
        fetch(url)
            .then(response => response.text())
            .then(html => {
                modalFormContainer.innerHTML = html;
                modal.style.display = "block";
            });
    });

    // Close the modal when the user clicks outside of it
    window.addEventListener("click", function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    });
});*/



//Table Row Click Code
$(document).ready(function () {
    $(document.body).on("click", "tr[data-href]", function () {
        window.location.href = this.dataset.href;
    });
});
