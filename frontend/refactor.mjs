import { Project, SyntaxKind } from "ts-morph";
import path from "path";

const project = new Project({
  tsConfigFilePath: "tsconfig.json",
});

const sourceFiles = project.getSourceFiles("src/**/*.{ts,tsx}");
console.log(`Analyzing ${sourceFiles.length} files...`);

for (const sourceFile of sourceFiles) {
  let changed = false;

  // 1. Remove console.logs
  const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  // Iterate in reverse to avoid shifting offsets
  for (let i = callExpressions.length - 1; i >= 0; i--) {
    const callExpr = callExpressions[i];
    const expr = callExpr.getExpression();
    const text = expr.getText();
    if (text === "console.log" || text === "console.error" || text === "console.warn" || text === "console.info") {
      try {
        const statement = callExpr.getFirstAncestorByKind(SyntaxKind.ExpressionStatement);
        if (statement) {
          statement.remove();
          changed = true;
        }
      } catch (e) {
         // ignore issues with particular nodes
      }
    }
  }

  // Helper to place comments cleanly before the nodes
  const addLowercaseComment = (node, name) => {
    if (!name) return;
    try {
      const parentStmt = node.getFirstAncestorByKind(SyntaxKind.VariableStatement) || node.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration) || node;
      
      const humanReadable = name.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
      const commentSnippet = `// handles ${humanReadable} functionality`;

      // Check if any leading comments exist, to not duplicate
      const ranges = parentStmt.getLeadingCommentRanges();
      const alreadyHasComment = ranges.some(r => r.getText().toLowerCase().includes(humanReadable) || r.getText().toLowerCase().includes("handle"));
      
      if (!alreadyHasComment && parentStmt) {
        // Insert right before the node
        const pos = parentStmt.getStart();
        // Adjust for potential leading spaces/exports
        sourceFile.insertText(pos, `${commentSnippet}\n`);
        changed = true;
      }
    } catch (e) {
      // safe catching logic
    }
  };

  // Because inserting text changes node offsets, we must extract all targets first, sort them by descending position, and insert bottom up.
  const targetsToComment = [];

  // Functions
  for (const f of sourceFile.getFunctions()) {
    targetsToComment.push({ node: f, name: f.getName(), pos: f.getStart() });
  }

  // Arrow Functions assigned to variables
  for (const v of sourceFile.getVariableDeclarations()) {
    const init = v.getInitializer();
    if (init && (init.isKind(SyntaxKind.ArrowFunction) || init.isKind(SyntaxKind.FunctionExpression))) {
      targetsToComment.push({ node: v, name: v.getName(), pos: v.getStart() });
    }
  }

  // Methods
  for (const c of sourceFile.getClasses()) {
    for (const m of c.getMethods()) {
      targetsToComment.push({ node: m, name: m.getName(), pos: m.getStart() });
    }
  }

  targetsToComment.sort((a, b) => b.pos - a.pos); // Process bottom up to avoid breaking positions

  for (const target of targetsToComment) {
    addLowercaseComment(target.node, target.name);
  }

  // 3. File path on top
  const absPath = sourceFile.getFilePath();
  const relPathMatch = absPath.split("frontend/src")[1];
  if (relPathMatch) {
    const headerComment = `// ${relPathMatch.replace(/^\//, '')}`;
    const fileText = sourceFile.getFullText();
    
    // Check if it already has the comment
    if (!fileText.startsWith(headerComment)) {
      sourceFile.insertText(0, `${headerComment}\n`);
      changed = true;
    }
  }

  if (changed) {
    sourceFile.saveSync();
    console.log(`Saved: ${relPathMatch}`);
  }
}

console.log("Refactoring complete");
