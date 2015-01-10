<?php
  // Get the $dictionary and $alphabetical variables
  include 'data.php';
?>

<script>

    ///////////////////
   // INITIAL SETUP //
  ///////////////////

  window.onload = function() {
    // Include the Jaro-Winkler string distance algorithm
    <?php include 'jaro_winkler/jaro-winkler.js' ?>

    // Initialize global variables
    dictionary = <?php echo(json_encode($dictionary)); ?>;
    alphabetical = <?php echo(json_encode($alphabetical)); ?>;
    search_field = document.getElementById('search-field')
    browse_field = document.getElementById('browse-field')
    var search_timer

    // When a letter is entered in the search field...
    document.onkeyup = function() {
      if (document.activeElement === search_field) {
        // Reset the browse field so it is clear which was searched
        browse_field.selectedIndex = 0

        // Clear the previous timer
        window.clearTimeout(search_timer)

        // Update the list of results after a delay.
        // The delay prevents the from flashing quickly as you type.
        search_timer = window.setTimeout(search_and_render(search_field.value), 200)
      }
    }

    // Function called when a letter is selected from the browse dropdown
    browse = function() {
      // Reset the search field so it is clear which was searched
      search_field.value = ''

      // Get the letter
      letter = browse_field.options[browse_field.selectedIndex].value

      if (letter !== 'default') {
        search_and_render(letter, true)
      } else {
        document.getElementById("definition-area").innerHTML = ''
      }
    }

      ////////////
     // SEARCH //
    ////////////

    // A wrapper around search_for() and render_list() that also sets the render
    // message based on whether you are searching or browsing
    function search_and_render(query, is_a_browse) {
      match_message = (is_a_browse) ? "Terms starting with" : "Possible matches for"

      render_list(
        query,
        sort_matches(
          search_for(
            query,
            is_a_browse
          )
        ),
        match_message
      )
    }

    // Get an array of terms that loosely match the given string.
    function search_for(query, is_a_browse) {
      var query   = query.toLowerCase()
      var matches = []
      // Set the minimum score, and the range around the best score that will be accepted.
      var best_score  = 0.85
      var score_range = 0.05
      // Split the query so we can search through it word by word.
      var query_words = query.split(/[ ()[\]<>{}]/)

      if (query.length > 0) {
        // Iterate over every term in the alphabetical array.
        for (i = 0; i < alphabetical.length; ++i) {
          var term         = alphabetical[i].toLowerCase()
          var search_words = term.split(' ')

          // If this is a browse...
          if (is_a_browse) {
            if (query === term.charAt(0)) {
              matches.push({'term': alphabetical[i]})
            }
          // If this is a search
          } else {
            // Iterate over each word in that term.
            for (j = 0; j < search_words.length; ++j) {
              // Get the word from the term and set the minimum distance.
              var search_word = search_words[j]
              var distance    = 0

              // Iterate over each word in the search query and find the best match
              // amongst them. Use that as the distance for future calculations.
              for (k = 0; k < query_words.length; ++k) {
                distance = Math.max(
                             jaro_winkler(
                               search_word,
                               query_words[k]
                             ),
                             distance
                           )
              }

              // If this is the first match and it is within the minimum range, or
              // the match is above the range for the current best match, set it as
              // the new best score and reset the matches array.
              if ((matches.length === 0 && (best_score - score_range) < distance) ||
                  distance > (best_score + score_range)) {

                best_score = distance
                matches = [{'term':     alphabetical[i],
                          'distance': distance}]
              // ... if that fails, but the match is within the current range, push
              // it to the matches array.
              } else if (distance > (best_score - score_range) &&
                         distance < (best_score + score_range)) {

                matches.push({'term':     alphabetical[i],
                              'distance': distance})
              }
            }
          }
        }
      }

      return matches
    }

    function match_by_letter() {

    }

    function match_by_words() {

    }

      //////////
     // SORT //
    //////////

    // Take an array of matches and sort them in some sensible way.
    function sort_matches(matches) {
      // If we have matches, sort them by distance from the query.
      if (matches.length > 0) {
        matches = matches.sort(function(first, second) {
          difference = second['distance'] - first['distance']

          if (difference !== 0) {
            return difference
          // If the the distances are the same sort the terms in alphabetical order.
          } else {
            first = first['term'].toLowerCase()
            seccond = second['term'].toLowerCase()

            if (first > second) {
              return -1
            } else if (first < second) {
              return 1
            } else {
              return 0
            }
          }
        })
      }

      return matches
    }

      ////////////
     // RENDER //
    ////////////

    // Take a query string and an array of matches and render them on the page.
    function render_list(query, matches, match_message) {
      // Default for when there are no matches
      var output = (search_field.value === '') ? '' : '<h2>No matches for <strong>' + query + '</strong></h2>'

      if (matches.length > 0) {
        output = '<h2>' + match_message + ' <strong>' + query + '</strong>:</h2><dl>'

        // Add each matched term to the output
        for (i = 0; i < matches.length; ++i) {
          var term = matches[i]['term']
          output = output + '<dt>' + term + '</dt><dd>' + dictionary[term] + '</dd>'
        }

        output = output + '</dl>'
      }

      // Render the list to the page
      document.getElementById("definition-area").innerHTML = output
    }
  }
</script>
