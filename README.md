# small-business-programs

Survey to recommend programs for small businesses

# Docs v2

This describes the new React-based form interface.

## Development

# Getting started
Make sure you have been added to the USDR accounts for the following services:
- Render
- Github
- Google Analytics
- Namecheap (optional, DNS provider for our old domains, covidloans.us and covidloaninfo.org)

# Run locally

On the first run:

  $ yarn install

And then to test the form interface:

  $ yarn start

This will open a browser window running at localhost:3000

# Deployment
We use Render for hosting/deployment.  The steps to deploy to production are as follows:
1. Create a PR against the `latest` branch
1. Render will generate a staging link to test changes/demo
1. When ready to deploy, merge to `latest` and Render will deploy automatically (takes ~5mins at the time of writing).


# Other helpful guides

## Making copy changes
  1. For the form, go to [form.json](/small-business-programs/blob/latest/src/form.json)
  1. Click the edit button, and use cmd+F to find the text you want to change
  1. Make the changes, being careful not to delete the surrounding `""` on each value
  1. Scroll to the bottom of the page, and select the option to "Create a **new branch** for this commit and start a pull request."
  1. Follow the deployment steps above to ship it
  
  The same will work for copy anywhere on the site but it will not be concentrated in a single file so you'll need to search the whole codebase for the text you want to change instead.

# Documentation

## Questions

We list all questions in order in ```docs/questions.js```

Sample question:

```javascript
{
  "q110_is_non_profit": {
    html: "<p> \
      Is your organization for-profit or not-for-profit? \
    </p>",
    yes_text: "For-profit",
    no_text: "Not-for-profit",
    yes_hides: ["non-profit"]
  }
}
```

Attributes:
- yes_text, no_text: replaces default "Yes" and "No" on buttons
- classes: HTML classes (for example: "non-profit local") which can be used to show/hide questions
- yes_hides, no_hides: array of classes, selects questions to hide and show
- hard_pass: true: ends survey if you answer "Yes" (e.g. is this an illegal business?)
- hard_pass: false: ends survey if you answer "No" (e.g. do you have a business license in our state?)
- input: for numeric inputs: { name: "", label: "", examples: "" }
- skippable: true: add "Not Sure"/"Skip" button
- skippable: "Pass": add "Not Sure"/"Skip" button and replace default text

## Headers

```javascript
{
  "Basic Information": { header: true }
  ...
}
```

## Programs

In ```docs/formflow.js```, set which question codes should be answered YES
or NO. More complex questions, such as numeric values, are answered with
functions.  If the user clicks "Skip", "Not Sure", or otherwise avoids a
question, it will not count against them (i.e. "required_no" behaves more like
"dont_answer_yes")

```javascript
{
  loan_program_A: {
    required_yes: ["q1_is_non_profit_reg_in_nj", "q2_physical_location_in_nj", "q12_is_specific_industry"],
    required_no: ["q3_is_home_based", "q14_is_prohibited_type"],
    eval: {
      "q8_number_of_fte": function (fte) {
        fte = parseNumber(fte);
        return fte >= 1 && fte <= 10;
      }
    }
  }
}
```

## Translations

Update UI options:

```javascript
var language_defaults = {
  en: {
    yes_text: "Yes",
    no_text: "No",
    ...
  }
};
```

Add to questions and headers:

```javascript
{
  "Section Title": {
    header: true,
    es: "Spanish Section Title"
  },
  test: {
    html: "English text",
    yes_text: "English: yes button",
    es: {
      html: "Spanish text",
      yes_text: "Spanish: yes button"
    }
  },
}
```

## Other technologies used
### React Snapshot
We use [React Snapshot](https://github.com/geelen/react-snapshot) for generating static versions of each page when deploying to production so search engines can crawl them properly

### React helmet
We use [React Helmet](https://github.com/nfl/react-helmet) to change the meta tags on each page for SEO.

# Future Expansions

## Lite backend
We have a few lower priority feature that would require some sort of persistent datastore (most prominently the ability to store survey responses).  Based on the current requirements Firebase seems like a promising candidate, and Rene is a great person to talk to for greater detail on those discussions

## Broader CMS
Ideally we could create a workflow for making copy changes such that there is no technical experience required to make or ship changes.  This would unblock content/marketing/product from making those kinds of changes as the need arises rather than waiting for bandwidth from engineering.  We already have a very basic version of this for the form, where all copy and translations are in a single json file.  We could extend that same structure to be used for content pages as well so we would retain the ability to support multiple languages but completely separate (or as much as possible) content from page structure.

# Contributing
We welcome contributions to open source code and documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) for additional information.

# License

Creative Commons Zero license
