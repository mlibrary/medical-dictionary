<script>

    ///////////////////
   // INITIAL SETUP //
  ///////////////////

  window.onload = function() {
    // Clear out the "No JavasSript" message
    clear_page()

    // Initialize global-ish variables
    var dictionary   = <?php echo(json_encode($dictionary)); ?>;
    var alphabetical = <?php echo(json_encode($alphabetical)); ?>;
    var search_field = document.getElementById('search-field')
    var browse_field = document.getElementById('browse-field')
    var all_letters      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    var search_timer

    // When a letter is entered in the search field...
    document.onkeyup = function() {
      if (document.activeElement === search_field) {
        // Reset the browse field so it is clear which input was used
        browse_field.selectedIndex = 0

        // Clear the previous timer
        window.clearTimeout(search_timer)

        // Update the list of results after a delay.
        // The delay prevents the from flashing quickly as you type.
        search_timer = window.setTimeout(
                         function() {
                           add_result_to_page(
                             search_and_render(search_field.value)
                           )
                         },
                         200
                       )
      }
    }

    // Function called when a letter is selected from the browse dropdown
    browse = function() {
      // Reset the search field so it is clear which input was used
      search_field.value = ''

      // Get the letter
      letter = browse_field.options[browse_field.selectedIndex].value

      if (letter !== 'default') {
        add_result_to_page(search_and_render(letter, true))
      } else {
        clear_page()
      }
    }

    // Function called when a letter is selected from the browse dropdown
    view_all = function() {
      // Reset the search and browse fields so it is clear which input was used
      search_field.value = ''
      browse_field.selectedIndex = 0

      var output = ''

      // Call search and render on every letter in the alphabet
      for (var i = 0; i < all_letters.length; ++i) {
        output = output.concat(search_and_render(all_letters[i], true))
      }

      add_result_to_page(output)
    }

      ////////////
     // SEARCH //
    ////////////

    // A wrapper around search_for() and render_list() that also sets the render
    // message based on whether you are searching or browsing
    function search_and_render(query, is_a_browse) {
      match_message = (is_a_browse) ? "Terms starting with" : "Possible matches for"

      return render_list(
               query,
               sort_matches(
                 search_for(query, is_a_browse)
               ),
               match_message
             )
    }

    // Get an array of terms that loosely match the given string.
    function search_for(query, is_a_browse) {
      var query   = query.toLowerCase()
      var matches = []
      var splittable_chars = /[ ()[\]<>{}]/
      // Set the minimum score, and the range around the best score that will be accepted.
      var best_score  = 0.85
      var score_range = 0.05
      // Split the query so we can search through it word by word.
      var query_words = query.split(splittable_chars)

      if (query.length > 0) {
        // For every word in the dictionary...
        for (var i = 0; i < alphabetical.length; ++i) {
          var term       = alphabetical[i].toLowerCase()
          var term_words = term.split(splittable_chars)

          // If this is a browse...
          if (is_a_browse) {
            if (query === term.charAt(0)) {
              matches.push({'term': alphabetical[i]})
            }
          // If this is a search...
          } else {
            // For every word in the current dictionary term...
            for (var j = 0; j < term_words.length; ++j) {
              // Get the word from the term and set the minimum distance.
              var term_word = term_words[j]
              var distance  = 0

              // For every word in the query...
              for (k = 0; k < query_words.length; ++k) {
                distance = Math.max(
                             jaro_winkler(
                               term_word,
                               query_words[k]
                             ),
                             distance
                           )
              }

              var result = { 'term':     alphabetical[i],
                             'distance': distance }

              // If this is the first match and it is within the minimum range, or
              // the match is above the range for the current best match, set it as
              // the new best score and reset the matches array.
              if ((matches.length === 0 && (best_score - score_range) < distance) ||
                  distance > (best_score + score_range)) {

                best_score = distance
                matches = [result]
              // ... if that fails, but the match is within the current range, push
              // it to the matches array.
              } else if (distance > (best_score - score_range) &&
                         distance < (best_score + score_range)) {
                matches.push(result)
              }
            }
          }
        }
      }

      return matches
    }

      //////////
     // SORT //
    //////////

    // Include the Jaro-Winkler string distance algorithm
    <?php include 'jaro_winkler/jaro-winkler.js'; ?>

    // Take an array of matches and sort them in some sensible way.
    function sort_matches(matches) {
      // If we have matches, sort them by distance from the query.
      if (matches.length > 0) {
        matches = matches.sort(
          function(first, second) {
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
          }
        )
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
        for (var i = 0; i < matches.length; ++i) {
          var term = matches[i]['term']
          output = output + '<dt>' + term + '</dt><dd>' + dictionary[term] + '</dd>'
        }

        output = output + '</dl>'
      }

      return output
    }

    function add_result_to_page(html) {
      document.getElementById("definition-area").innerHTML = html
    }

    function clear_page() {
      add_result_to_page('')
    }
  }
</script>
