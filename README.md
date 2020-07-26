# googlesheet-actions

Github action for google spreadsheets to fetch data.

## Inputs

### sheet-id

Required - `string` - Google spreadsheets id  which is published on web.

## Outputs

### result

steps.googlesheet_actions.outputs.result - json - Get all data as json format. The output is dependant on the output input.

## Example usage

### Simple example

```yml
- name: googlesheet-actions
  uses: rjoydip/googlesheet-actions@0.1.1
```

### Full example

```yml
# bare minimal
name: googlesheet

on:
    push:
      branches:
        - master

jobs:
    fetch:
      runs-on: ubuntu-latest
      steps:
        - id: googlesheet_actions
          uses: rjoydip/googlesheet-actions@0.1.1
          with:
            sheet-id: ${{ secrets.SHEET_ID }}
        - id: echo
          uses: actions/github-script@v2
          with:
            github-token: ${{secrets.GITHUB_TOKEN}}
            script: |
                console.log(${{steps.googlesheet_actions.outputs.result}})
        - name: test
          run: |
            cat $HOME/data.json
```

## Getting Started

Create the Google spreadsheet and publish it:

- Create a [Google Spreadsheet](https://www.google.com/sheets/about/)
- File > Publish to the Web > Publish
- Copy the id between /spreadsheets/ and /edit in the url:
    <https://docs.google.com/spreadsheets/d/>**1fvz34wY6phWDJsuIneqvOoZRPfo6CfJyPg1BYgHt59k**/edit
