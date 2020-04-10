const csv = require('csv');
const fs = require('fs');
const assert = require('assert');


// Generate a string of two-space indentation, depending on the global variable `depth`
let depth = 0;
function indent() {
    let indent = "";
    for (let i = 0; i < depth; ++i) {
        indent += "  ";
    }
    return indent;
}

// Push one or more args onto `output`
// TODO: there's probably some stdlib function for this
function write(output, ...args) {
    args.forEach(arg => {
        output.push(arg);
    });
}

// allows passing literal JS through emit()
class JSLiteral {
    constructor(value) {
        this.value = value;
    }

    toJavascript() {
        return this.value;
    }
}


// Convert `value` into a valid Javascript string literal, appending one or
// more string segments onto `output`.  Handles strings, boolean, arrays, and objects.
// Wrap value in `JSLiteral` if you want to pass raw JS through
function emit(output, value) {
    const type = value.push !== undefined ? "array" : typeof value;
    switch (type) {
        case "array":
            write(output, "[\n");
            depth++;
            value.forEach(val => {
                write(output, indent());
                emit(output, val);
                write(output, ",\n");
            });
            depth--;
            write(output, indent(), "]");
            break;
        case "boolean":
            return write(output, value.toString());
        case "string":
            write(output, "\`", value, "\`");
            break;
        case "object":
            if (value.toJavascript !== undefined) {
                write(output, value.toJavascript());
            } else {
                write(output, "{\n");
                depth++;
                for (const k in value) {
                    write(output, indent(), "\"" + k + "\"", ": ");
                    emit(output, value[k]);
                    write(output, ",\n");
                }
                depth--;
                write(output, indent(), "}");
            }
            break;
        default:
            assert(false, type);
    }
}


function generateQuestions(rows) {
    const questions = {};
    // skip first row it has headings
    rows.slice(1).forEach(row => {

        const questionId = row[0];
        const questionText = row[2].replace(/\n/g, "<br/>\n");

        const answerType = row[3].toLowerCase().trim();
        const answerExtra = row[4].split("\n").map(i => i.trim());

        function gen_buttons() {
            // TODO: if no to previous and not sure
            if (answerType == 'y/n' || answerType == "y/n; if no to previous" || answerType == "y/n/not sure") {
                return {yes_text: "Yes", no_text: "No"};
            } else if (answerType == "agree/cancel") {
                return {yes_text: "Agree", no_text: "Cancel"};
            } else if (answerType == "number") {
                const examples = answerExtra[0];
                const label = answerExtra[1];
                return {input: {
                    // e.g "q1_is_awesome_input"
                    name: questionId + "_input",
                    examples: answerExtra[0],
                    label: label !== undefined ? label : "",
                }};
            } else if (answerType == "select") {
                return {select: {
                    name: questionId + "_input",
                    options: answerExtra,
                }};
            } else {
                console.error('unknown answer type: ' + answerType);
                assert(false);
            }
        }

        questions[questionId] = {
            html: "<p>" + questionText + "</p>",
            ...gen_buttons(),
        };
    });

    return questions;
}

function generateRequirements(rows) {

    const headings = rows[0];

    const requirements = {};

    function addConstraint(pcode, qid, constraint) {

        function getDefault(obj, key, def)  {
            const current = obj[key];
            if (current === undefined) {
                return obj[key] = def;
            } else {
                return current;
            }
        }

        const rules = getDefault(getDefault(requirements, pcode, {}), "rules", []);
        rules.push(new JSLiteral(constraint));
    }

    // Which column in the sheet starts the rules?
    const RULES_COLUMN = 5;

    for (const row of rows.slice(1)) {  // skip headings
        for (let i = RULES_COLUMN; i < row.length; ++i) {
            const rule = row[i].trim();
            if (rule.length === 0) {
                continue;
            }
            const heading = headings[i];
            // "SBA PPP 7(a) Loans" -> "sba_ppp_7a_loans"
            const programId = heading.trim().replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
            const questionId = row[0];

            // Convert a string like "Equal foo bar" into a predicate "Equal" and a suffix "foo bar"
            // super weird that Javascript split(" ", 1) doesn't do this for us
            const splat = rule.split(" ");
            const suffix = splat.slice(1).join(" ");
            const predicate = splat[0];

            // TODO: think about escaping `suffix`.  Currently this uses a template string since backtick
            // is a lot less likely to show up than quotes
            if (predicate === "LessThan") {
                addConstraint(programId, questionId, `LessThan(\"${questionId}\", \`${suffix}\`)`);
            } else if (predicate === "Equals") {
                addConstraint(programId, questionId, `MustEqual(\"${questionId}\", \`${suffix}\`)`);
            } else {
                console.error(row);
                assert(false, rule);
            }
        }
    }

    return requirements;
}

const QUESTION_HEAD = `
var language_defaults = {
    en: {
        yes_text: "Yes",
        no_text: "No",
        skip: "Skip",
        not_sure: "Not Sure",
        examples: "Examples",
        enter: "Enter"
    },
    es: {
        yes_text: "Sí",
        no_text: "No",
        skip: "Pasar",
        not_sure: "Pasar",
        examples: "Ejemplos",
        enter: "Ingresar su respuesta"
    }
};

`

// TODO: these should not be inlined in requirements
const REQUIREMENT_HEAD = `
function MustEqual(qid, value) {
    function cond(answers) {
      return answers[qid] === value;
    }
    return cond;
  }

function LessThan(qid, value) {
    function cond(answers) {
        const val = parseNumber(answers[qid]);
        return val < value;
    }
    return cond;
}
`

function main() {
    if (process.argv.length < 4) {
        console.error(`
Generate a questions.js and requirements.js file from a spreadsheet.

Usage:
  $ node generate_qs.js output_dir input_csv
`);
        return;
    }

    const outputDir = process.argv[2];
    const rules = process.argv[3];
    const input = fs.readFileSync(rules);

    csv.parse(input, {
        comment: '#'
    }, function(err, rows) {

        const questions = generateQuestions(rows);
        const questionText = [QUESTION_HEAD, "var questions = "];
        emit(questionText, questions);
        questionText.push(";\n");
        fs.writeFileSync(outputDir + "/questions.js", questionText.join(""));

        const requirements = generateRequirements(rows);
        const requirementText = [REQUIREMENT_HEAD, "var requirements = "];
        emit(requirementText, requirements);
        requirementText.push(";\n");
        fs.writeFileSync(outputDir + "/requirements.js", requirementText.join(""));
    });
}

main();