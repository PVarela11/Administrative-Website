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
                
            });
    }

    // Close the modal when the user clicks outside of it
    $(window).click(function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    //Close the modal when the user clicks on cancel
    cancelBtn.addEventListener("click", function() {
        closeModal();
    });


    function openModal() {
        modal.style.display = "block";
    }
    function closeModal() {
        modal.style.display = "none";
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
