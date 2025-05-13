# Plain Language Medical Dictionary

The Plain Language Medical Dictionary (PLMD) widget is a project of the University of Michigan Taubman Health Sciences Library as part of the Michigan Health Literacy Awareness project, aimming to help people with a non-medical background better understand the medical terms. 

The initial version was designed in 2011 and published in three versions: website widget, iOS mobile application, and Android mobile application. In 2019, the widget was redesigned to a responsive webpage as one of [the Library Engagement Fellow projects](https://engage.lib.umich.edu/engagement-fellows/) and in 2024 the widget was updated to support images and remediate accessibility issues.

© This application is copyright 2025, The Regents of the University of Michigan.

## Install

To install this widget in your own website, please use the follwing code:

```html
<iframe src="https://mlibrary.github.io/medical-dictionary/" style="margin: 0 auto; height: 640px; width: 600px; border: 2px solid #eee;"></iframe>
```

The widget is responsive with a min-width of 320px, max-width of 768px and max-height of 700px. The recommended iframe width is 600px.


## Features & Functions

### Letter browsing

The user can browse terms by letter by selecting the first and second letter buttons:

![A screenshot of the Plain Launguage Medical Dictionary showing the letters "a" and "ag" selected. Two matching terms, "Agender" and "Aggregate" are shown in the results.](https://github.com/user-attachments/assets/ebcfb637-69ed-4bd9-bc89-fcee749eb159)

### "Word Search": for short terms

Users can search for terms by typing in the search input while the "Word" mode is selected

![A screenshot showing the search input with the letters "a" and "b" typed into it. A series of matching autofill option terms appears below the input and the matching terms and definitions appears in the results.](https://github.com/user-attachments/assets/d8a80e77-aab4-4a6b-b610-75f6decc7537)

### "Paragraph Search": for longer text

Users can paste or type text into a longer input box while the "Paragraph" mode is selected. This allows users to paste in longer paragraphs of text. All matching medical terms within the text are highlighted and their respective definitionas are displayed. When a user clicks on the marked term in the textarea, the term card is highlighted and focus is placed on the term.

![A screenshot showing a user entering a longer string of text. The text has a series of words highlighted. Those highlighted terms appear as terms and definitions next to the input box.](https://github.com/user-attachments/assets/fbffb88d-e804-4131-8199-9db376b5070b)

## Report incorrect definitions & Request more medical terms

To further enrich our repository and keep this product updated, we designed this updating system that allows users to request definitions of terms we do not have and report information they think is incorrect.

![A screenshot showing a user reporting the "Shortness of Breath" term. The term and a definition are shown with an input box where the user can explain the issue with the term.](https://github.com/user-attachments/assets/8d11bb44-9177-409b-aa2b-2d8f4138ec92)

## Development

The widget is built with React.js and the development language is English. The algorithm used for term search is based on [levenshtein-distance](https://github.com/trekhleb/javascript-algorithms/tree/master/src/algorithms/string/levenshtein-distance). The thesaurus is stored in the data.json file.
