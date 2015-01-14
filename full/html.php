<?php
  // Copyright (c) 2014 The Regents of the University of Michigan.
  // All Rights Reserved. Licensed according to the terms of the Revised BSD license.
  // See LICENSE.txt for details.
?>
<!DOCTYPE html>
<html>
  <head>
    <title>Plain Language Medical Dictionary</title>
    <meta name="viewport" content="initial-scale=1, maximum-scale=1">
    <!--[if lt IE 9]>
      <script src="full/html5shiv/html5shiv-printshiv.js"></script>
    <![endif]-->
    <link href="full/style.css" type="text/css" rel="stylesheet"></link>
    <?php
      include 'data.php';
      include 'js.php';
    ?>
  </head>
  <body>
    <header id="search-form">
      <h1>Plain Language Medical Dictionary <span>application by the University of Michigan Library</span></h1>

      <aside>As you type, matching results will be listed below automatically.</aside>
      <label for="search-field">Search for a term: </label>
      <input type="search" id="search-field"></input>

      <aside>You can also browse all terms, or view all terms starting with a letter.</aside>
      <label for="browse-field">Browse by letter: </label>
      <select id="browse-field" onchange="browse()">
        <option value="default" selected>-</option>
        <?php
          foreach(range('A', 'Z') as $letter) {
            echo '<option value="' . $letter . '">' . $letter . '</option>';
          }
        ?>
      </select>
      <button onclick="view_all()">View all <?php echo count($dictionary); ?> terms</button>
    </header>

    <main id="definition-area">
      <p>This application requires JavaScript to run.</p>
    </main>

    <footer>
      <p>This work was performed under a subcontract with the <a href="http://www.uic.edu/index.html/">University of Illinois at Chicago</a> and made possible by grant #N01-LM-6-3503 from <a href="http://www.nlm.nih.gov/">National Library of Medicine (NLM)</a> and its contents are solely the responsibility of the authors and do not necessarily represent the official views of the National Library of Medicine.</p>

      <p>Original source of definitions: <cite>Plain Language Thesaurus for Health Communications, Draft 3, October 2007. National Center for Health Marketing, Centers for Disease Control and Prevention, Department of Health and Human Services, United States of America. #07-151(NE)/092607.</cite></p>

      <p>This application is copyright 2014, The Regents of the University of Michigan.</p>
    </footer>
  </body>
</html>
