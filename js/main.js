 $(document).ready(
   function() {
     //post page
     let sectionButtons = $('#conditionalForm input:radio[name = sectionRadios]');



     let authorDetails = $('#conditionalForm #authorDetails');
     let postTitleNTags = $('#conditionalForm #postTitleNTags');
     let introTextArea = $('#conditionalForm textarea[name = "introTextArea"]').parent();
     let linkTextAtrea = $('#conditionalForm textarea[name = "linkTextAtrea"]').parent();
     let postTextAtrea = $('#conditionalForm textarea[name = "postTextAtrea"]').parent();
     let imageLinkText = $('#conditionalForm textarea[name = "imageLinkText"]').parent();

     let completeForm = authorDetails.add(postTitleNTags).add(introTextArea).add(linkTextAtrea).add(postTextAtrea).add(imageLinkText);
     let bookForm = authorDetails.add(postTitleNTags).add(introTextArea).add(linkTextAtrea).add(imageLinkText);
     let vedAudioForm = authorDetails.add(postTitleNTags).add(introTextArea).add(linkTextAtrea);
     let articleForm = authorDetails.add(postTitleNTags).add(introTextArea).add(postTextAtrea);

     sectionButtons.change(function() {
       var value = this.value;
       completeForm.addClass('hidden');

       if (value == "Article") {
         articleForm.removeClass('hidden');
       } else if (value == "Book") {
         bookForm.removeClass('hidden');
       } else {
         vedAudioForm.removeClass('hidden');
       }
     });
     //post page

     // enhance multiple select in post page
     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
       $('.selectpicker').selectpicker('mobile');
     }


     //animated nav-bar icon
     $('.first-button').on('click', function() {

       $('.animated-icon1').toggleClass('open');
     });





     // Animations initialization
     new WOW().init();
   });